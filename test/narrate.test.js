'use strict';
// Offline tests for scripts/narrate.js: no network, no API key.
const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const n = require('../scripts/narrate.js');

const dir = path.join(__dirname, '..', 'examples', 'child-peek');

test('lines are placed at shot start plus startAt', () => {
  const p = n.loadProject(dir);
  const at = Object.fromEntries(p.lines.map(l => [l.beat, +l.at.toFixed(2)]));
  assert.deepStrictEqual(at, { b1: 0.8, b2: 4.5, b4: 10.5, b5: 13 }); // anchored lines carry no startAt
  assert.strictEqual(p.total, 17.5);
});

test('TTS text carries the accent tag, pause tags and no breath marks', () => {
  const p = n.loadProject(dir);
  const t = n.ttsText(p.lines[0], p.vd);
  assert.match(t, /^<australian accent> /);
  assert.match(t, /o'clock\. <short pause> Mia keeps watch\.$/);
  assert.doesNotMatch(t, /breath|\|/);
});

test('style prompt includes the voice direction and the line delivery', () => {
  const p = n.loadProject(dir);
  const s = n.stylePrompt(p.lines[2], p.vd);
  assert.match(s, /deadpan Australian man/);
  assert.match(s, /Avoid: rising inflection/);
  assert.match(s, /This line: Deadpan correction/);
});

test('audio is read from a WAV response and from raw L16', () => {
  const pcm = new Int16Array([0, 1000, -1000, 32767]);
  const wav = n.writeWav(pcm, 24000);
  const a = n.audioFromResponse({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'audio/wav', data: wav.toString('base64') } }] } }] });
  assert.strictEqual(a.rate, 24000);
  assert.deepStrictEqual(Array.from(a.samples), [0, 1000, -1000, 32767]);
  const raw = Buffer.from(pcm.buffer).toString('base64');
  const b = n.audioFromResponse({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'audio/L16;codec=pcm;rate=16000', data: raw } }] } }] });
  assert.strictEqual(b.rate, 16000);
  assert.deepStrictEqual(Array.from(b.samples), [0, 1000, -1000, 32767]);
});

test('resampling 24 kHz to 48 kHz doubles the length', () => {
  assert.strictEqual(n.resample(new Int16Array(240), 24000, 48000).length, 480);
});

test('transcription words and cue positions are parsed', () => {
  const resp = { candidates: [{ content: { parts: [{ audioTranscription: { words: [
    { word: 'Six', startOffset: '0.100s', endOffset: '0.350s' },
    { word: "o'clock.", startOffset: '0.350s', endOffset: '0.800s' },
    { word: 'Mia', startOffset: '1.300s', endOffset: '1.550s' },
    { word: 'keeps', startOffset: '1.550s', endOffset: '1.850s' },
    { word: 'watch.', startOffset: '1.850s', endOffset: '2.400s' }] } }] } }] };
  const w = n.wordsFromResponse(resp);
  assert.strictEqual(w[4].start, 1.85);
  assert.deepStrictEqual(n.findCues(w, [{ id: 'watch', word: 'watch', occurrence: 1 }]), { watch: 4 });
  assert.throws(() => n.findCues(w, [{ id: 'car', word: 'car' }]), /not found/);
});

test('arguments: picks, cap and unknown options', () => {
  const o = n.parseArgs(['assemble', 'x', '--pick', 'b1=2,b4=1']);
  assert.deepStrictEqual(o.pick, { b1: 2, b4: 1 });
  assert.throws(() => n.parseArgs(['generate', 'x', '--nope']), /unknown option/);
});

test('voice-first layout: anchors place lines, crowded lines lengthen the earlier shot', () => {
  const p = n.loadProject(dir);
  const mk = (ws, secs) => ({ seconds: secs, words: ws.map((w, i) => ({ word: w, start: 0.05 + i * 0.25, end: 0.25 + i * 0.25 })) });
  const takes = { b1: mk(['Six', "o'clock.", 'Mia', 'keeps', 'watch.'], 2.4), b2: mk(['She', 'knows', 'the', 'sound', 'of', "Dad's", 'car.'], 1.9),
    b4: mk(['Not', 'Dad.'], 0.8), b5: mk(['Even', 'better.'], 1.0) };
  const lay = n.layout(p, takes);
  const c = Object.fromEntries(lay.cuts.map(x => [x.shot, x]));
  const b2 = lay.placed.find(x => x.line.beat === 'b2');
  // "car" (word 7) lands 10 frames after the cut into sh2
  assert.strictEqual(+(b2.start + 1.55).toFixed(3), +(c.sh2.start + 10 / 30).toFixed(3));
  // b1 ends at 3.2 s, so sh2's cut moved later and sh1 grew beyond its planned 4.5 s
  assert.ok(c.sh1.seconds > 4.5);
  assert.ok(b2.start >= 0.8 + 2.4 + 0.4 - 1e-9);
  // shots never shrink below their planned length
  for (const x of lay.cuts) assert.ok(x.seconds >= x.planned);
});

test('script and heard words are compared, with numbers matched loosely', () => {
  const w = s => s.split(' ').map((x, i) => ({ word: x, start: i * 0.3 }));
  assert.strictEqual(n.compareHeard("Six o'clock. Mia keeps watch.", w('6:00. Mia keeps watch.')).ok, true);
  assert.strictEqual(n.compareHeard('Not Dad.', w('Not dad.')).ok, true);
  const bad = n.compareHeard('Not Dad.', w('Not that.'));
  assert.strictEqual(bad.ok, false);
  assert.strictEqual(bad.heard, 'not that');
});

test('arguments are validated, so junk cannot bypass the request cap', () => {
  assert.throws(() => n.parseArgs(['generate', 'x', '--max-requests', 'abc']), /positive whole number/);
  assert.throws(() => n.parseArgs(['generate', 'x', '--takes', '0']), /positive whole number/);
  assert.throws(() => n.parseArgs(['generate', 'x', '--takes']), /needs a value/);
  assert.deepStrictEqual([...n.parseArgs(['assemble', 'x', '--allow-mismatch', 'b1,b4']).allowMismatch], ['b1', 'b4']);
});

test('readWav rejects float audio and survives an odd-length data chunk', () => {
  const wav = n.writeWav(new Int16Array([1, 2, 3]), 24000);
  const f = Buffer.from(wav); f.writeUInt16LE(3, 20);
  assert.throws(() => n.readWav(f), /not integer PCM/);
  const odd = Buffer.concat([wav, Buffer.from([7])]); odd.writeUInt32LE(7, 40);
  assert.deepStrictEqual(Array.from(n.readWav(odd).samples), [1, 2, 3]);
});

test('hand marks apply only to the take they were made on', () => {
  const take = { digest: 'sha256:aaa', words: [{ word: 'Not', start: 0.3 }, { word: 'Dad.', start: 0.6 }] };
  const cues = [{ id: 'notdad', word: 'Not' }];
  const stale = n.applyMarks('b4', { ...take }, cues, [{ cue: 'notdad', takeDigest: 'sha256:bbb', startInTake: 0.25 }]);
  assert.match(stale[0], /different take/);
  const t2 = { ...take };
  n.applyMarks('b4', t2, cues, [{ cue: 'notdad', takeDigest: 'sha256:aaa', startInTake: 0.25 }]);
  assert.strictEqual(t2.words[0].start, 0.25);
  assert.strictEqual(take.words[0].start, 0.3, 'the original words are not mutated');
});
