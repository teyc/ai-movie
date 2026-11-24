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
