#!/usr/bin/env node
'use strict';
// Narration for a storyboard film: Gemini TTS per spoken line, Gemini transcription for
// word timings, then offline assembly of the chosen takes into a timed voice track.
//
//   node scripts/narrate.js generate <project-dir> [--takes 2] [--voice Algenib] [--max-requests 20] [--dry-run]
//   node scripts/narrate.js assemble <project-dir> [--pick b1=1,b2=2,...]
//
// The API key is read from GEMINI_API_KEY or GEMINI_VIDEO_API_KEY and is never written anywhere.
// Outputs go to runs/<project-id>/voice/ (ignored by git).

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const API = 'https://generativelanguage.googleapis.com/v1beta/models/';
const OUT_RATE = 48000;

// ---------------------------------------------------------------- arguments
function parseArgs(argv) {
  const [cmd, dir, ...rest] = argv;
  const o = { cmd, dir, takes: 2, maxRequests: 20, dryRun: false, pick: {},
    ttsModel: 'gemini-3.8-flash-tts', sttModel: 'gemini-3.5-transcribe', voice: null };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i], v = rest[i + 1];
    if (a === '--takes') { o.takes = +v; i++; }
    else if (a === '--voice') { o.voice = v; i++; }
    else if (a === '--max-requests') { o.maxRequests = +v; i++; }
    else if (a === '--tts-model') { o.ttsModel = v; i++; }
    else if (a === '--stt-model') { o.sttModel = v; i++; }
    else if (a === '--dry-run') o.dryRun = true;
    else if (a === '--pick') { for (const kv of v.split(',')) { const [b, t] = kv.split('='); o.pick[b] = +t; } i++; }
    else throw new Error('unknown option ' + a);
  }
  if (!['generate', 'assemble'].includes(cmd) || !dir) {
    throw new Error('usage: narrate.js generate|assemble <project-dir> [options]');
  }
  return o;
}

// ---------------------------------------------------------------- project
function loadProject(dir) {
  const sp = JSON.parse(fs.readFileSync(path.join(dir, 'screenplay.json'), 'utf8'));
  const shots = JSON.parse(fs.readFileSync(path.join(dir, 'shots.json'), 'utf8'));
  const id = sp.id;
  const vd = sp.payload.voiceDirection || {};
  // shot start times in seconds, in shot-list order
  const fps = shots.payload.fps || 30;
  let t = 0; const shotStart = {}, shotOfBeat = {}, anchorOf = {}, first = shots.payload.shots[0].id;
  for (const s of shots.payload.shots) {
    shotStart[s.id] = t; t += s.seconds;
    if (!(s.beat in shotOfBeat)) shotOfBeat[s.beat] = s.id;
    if (s.anchor && s.anchor.kind === 'speech' && s.id !== first) anchorOf[s.id] = s.anchor;
  }
  const total = t;
  const lines = [];
  for (const sc of sp.payload.scenes) for (const b of sc.beats) {
    for (const sk of b.spoken || []) {
      const d = sk.delivery || {};
      const shot = shotOfBeat[b.id];
      if (!shot) throw new Error(`beat ${b.id} has no shot in shots.json`);
      // A speech anchor on the shot (other than the first) fixes where its cue word lands:
      // the cut is at cue onset + offsetFrames, and the cut is the shot's planned start.
      const an = anchorOf[shot];
      const cue = an && (b.cues || []).find(c => c.id === an.cue || c.word === an.cue);
      lines.push({ beat: b.id, shot, text: sk.text, delivery: d, cues: b.cues || [],
        at: shotStart[shot] + (d.startAt || 0),
        anchor: cue ? { cueId: cue.id, offsetFrames: an.offsetFrames, cueTime: shotStart[shot] - an.offsetFrames / fps } : null });
    }
  }
  const shotList = shots.payload.shots.map(s => ({ id: s.id, beat: s.beat, seconds: s.seconds, anchor: s.anchor || null }));
  return { id, vd, lines, total, fps, shots: shotList };
}

// Text sent to TTS: accent tag, then the line with pause marks turned into pause tags and
// breath marks removed (breaths are placed by the gaps between separately generated lines).
function ttsText(line, vd) {
  const marked = line.delivery.marked || line.text;
  let s = marked.replace(/\([^)]*breath[^)]*\)/gi, ' ').replace(/\s*\|\s*/g, ' <short pause> ');
  s = s.replace(/\s+/g, ' ').trim();
  const tag = (vd.tts && vd.tts.accentTag) || '';
  return (tag ? tag + ' ' : '') + s;
}

function stylePrompt(line, vd) {
  const d = line.delivery;
  const parts = [];
  if (vd.who) parts.push(vd.who + '.');
  if (vd.register) parts.push(vd.register + '.');
  for (const k of ['pitch', 'pace', 'mic']) if (vd[k]) parts.push(vd[k] + '.');
  if (vd.avoid && vd.avoid.length) parts.push('Avoid: ' + vd.avoid.join('; ') + '.');
  if (d.intent) parts.push('This line: ' + d.intent + '.');
  if (d.inflection) parts.push('Inflection: ' + d.inflection + '.');
  if (d.emphasis && d.emphasis.length) parts.push('Lift: ' + d.emphasis.join(', ') + '.');
  if (d.pace) parts.push('Pace: ' + d.pace + '.');
  return parts.join(' ');
}

// ---------------------------------------------------------------- requests
function ttsRequest(line, vd, voice) {
  return {
    contents: [{ role: 'user', parts: [{ text: ttsText(line, vd), speech_metadata: { style: stylePrompt(line, vd) } }] }],
    generationConfig: { responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
  };
}

function sttRequest(wavBuf, lang) {
  return {
    contents: [{ role: 'user', parts: [{ inlineData: { mimeType: 'audio/wav', data: wavBuf.toString('base64') } }] }],
    generationConfig: { audioTranscriptionConfig: { wordTimestamp: true, languageCodes: [lang] } },
  };
}

async function call(model, body, key) {
  const r = await fetch(API + model + ':generateContent', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify(body) });
  const txt = await r.text();
  if (!r.ok) throw new Error(`${model} HTTP ${r.status}: ${txt.slice(0, 500)}`);
  return JSON.parse(txt);
}

// ---------------------------------------------------------------- audio
// Returns {rate, samples: Int16Array} from a TTS response part (WAV, or raw L16 PCM).
function audioFromResponse(resp) {
  const parts = (((resp.candidates || [])[0] || {}).content || {}).parts || [];
  const p = parts.find(x => x.inlineData && x.inlineData.data);
  if (!p) throw new Error('no audio in TTS response');
  const buf = Buffer.from(p.inlineData.data, 'base64');
  if (buf.slice(0, 4).toString('ascii') === 'RIFF') return readWav(buf);
  const m = /rate=(\d+)/.exec(p.inlineData.mimeType || '');
  return { rate: m ? +m[1] : 24000, samples: new Int16Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length - (buf.length % 2))) };
}

function readWav(buf) {
  let off = 12, rate = 24000, bits = 16, ch = 1, data = null;
  while (off + 8 <= buf.length) {
    const id = buf.slice(off, off + 4).toString('ascii'), size = buf.readUInt32LE(off + 4);
    if (id === 'fmt ') { ch = buf.readUInt16LE(off + 10); rate = buf.readUInt32LE(off + 12); bits = buf.readUInt16LE(off + 22); }
    if (id === 'data') { data = buf.slice(off + 8, off + 8 + size); break; }
    off += 8 + size + (size % 2);
  }
  if (!data || bits !== 16) throw new Error('expected 16-bit PCM WAV');
  const all = new Int16Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.length));
  if (ch === 1) return { rate, samples: all };
  const mono = new Int16Array(all.length / ch);
  for (let i = 0; i < mono.length; i++) mono[i] = all[i * ch];
  return { rate, samples: mono };
}

function writeWav(samples, rate) {
  const b = Buffer.alloc(44 + samples.length * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + samples.length * 2, 4); b.write('WAVE', 8);
  b.write('fmt ', 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) b.writeInt16LE(samples[i], 44 + i * 2);
  return b;
}

function resample(samples, from, to) {
  if (from === to) return samples;
  const n = Math.round(samples.length * to / from), out = new Int16Array(n);
  for (let i = 0; i < n; i++) {
    const x = i * from / to, j = Math.floor(x), f = x - j;
    const a = samples[j] || 0, c = samples[Math.min(j + 1, samples.length - 1)] || 0;
    out[i] = Math.round(a + (c - a) * f);
  }
  return out;
}

// ---------------------------------------------------------------- timings
function wordsFromResponse(resp) {
  const parts = (((resp.candidates || [])[0] || {}).content || {}).parts || [];
  const p = parts.find(x => x.audioTranscription);
  if (!p) throw new Error('no audioTranscription in response');
  const sec = s => parseFloat(String(s).replace(/s$/, ''));
  return p.audioTranscription.words.map(w => ({ word: w.word, start: sec(w.startOffset), end: w.endOffset != null ? sec(w.endOffset) : null }));
}

const norm = w => w.toLowerCase().replace(/[^a-z0-9']/g, '');

// Find each cue word's occurrence in a take's words; returns {cueId: wordIndex}.
function findCues(words, cues) {
  const out = {};
  for (const c of cues) {
    let n = 0;
    for (let i = 0; i < words.length; i++) {
      if (norm(words[i].word) === norm(c.word) && ++n === (c.occurrence || 1)) { out[c.id] = i; break; }
    }
    if (!(c.id in out)) throw new Error(`cue "${c.word}" not found in the transcript`);
  }
  return out;
}

const sha = b => 'sha256:' + crypto.createHash('sha256').update(b).digest('hex');

// ---------------------------------------------------------------- commands
async function generate(o, proj, outDir) {
  const key = process.env.GEMINI_API_KEY || process.env.GEMINI_VIDEO_API_KEY;
  const voice = o.voice || (proj.vd.tts && proj.vd.tts.voice) || 'Algenib';
  const lang = (proj.vd.tts && proj.vd.tts.languageCode) || 'en-AU';
  const planned = proj.lines.length * o.takes * 2;
  console.log(`${proj.lines.length} lines x ${o.takes} takes, voice ${voice}: ${planned} requests (cap ${o.maxRequests})`);
  if (planned > o.maxRequests) throw new Error('over the request cap; raise --max-requests or lower --takes');
  if (o.dryRun) {
    for (const l of proj.lines) {
      const r = ttsRequest(l, proj.vd, voice);
      console.log(`\n[${l.beat}] text: ${r.contents[0].parts[0].text}\n      style: ${r.contents[0].parts[0].speech_metadata.style}`);
    }
    return;
  }
  if (!key) throw new Error('set GEMINI_API_KEY or GEMINI_VIDEO_API_KEY in the environment');
  fs.mkdirSync(outDir, { recursive: true });
  for (const l of proj.lines) {
    for (let t = 1; t <= o.takes; t++) {
      const base = path.join(outDir, `${l.beat}-take${t}`);
      const req = ttsRequest(l, proj.vd, voice);
      const a = audioFromResponse(await call(o.ttsModel, req, key));
      const wav = writeWav(a.samples, a.rate);
      fs.writeFileSync(base + '.wav', wav);
      const words = wordsFromResponse(await call(o.sttModel, sttRequest(wav, lang), key));
      const meta = { beat: l.beat, take: t, text: l.text, sentText: req.contents[0].parts[0].text,
        style: req.contents[0].parts[0].speech_metadata.style, voice, ttsModel: o.ttsModel, sttModel: o.sttModel,
        rate: a.rate, seconds: a.samples.length / a.rate, digest: sha(wav), words, date: new Date().toISOString() };
      fs.writeFileSync(base + '.json', JSON.stringify(meta, null, 2) + '\n');
      console.log(`${l.beat} take ${t}: ${meta.seconds.toFixed(2)} s, heard "${words.map(w => w.word).join(' ')}"`);
    }
  }
  console.log(`\nListen to ${outDir}/*.wav, then run: node scripts/narrate.js assemble ${o.dir} --pick b1=1,b2=1,...`);
}

// Voice-first layout. Walk the shots in order with a running cut time. A shot's line is placed
// from its cut: an anchored line so its cue word lands offsetFrames after the cut (a negative
// offset means the cut comes first), otherwise at the reading notes' startAt. If a line would
// start less than MIN_GAP after the previous line ends, the cut moves later, lengthening the
// previous shot. A shot lasts its planned seconds, or longer if its line needs a tail.
const MIN_GAP = 0.4, TAIL = 0.5;
function layout(proj, takes) {
  const lineOf = {}; for (const l of proj.lines) if (!(l.shot in lineOf)) lineOf[l.shot] = l;
  let cut = 0, prevEnd = -Infinity, prevBeat = null;
  const cuts = [], placed = [], notes = [];
  for (const sh of proj.shots) {
    const l = lineOf[sh.id];
    let start = null, end = null;
    if (l) {
      const tk = takes[l.beat];
      start = l.anchor ? cut - l.anchor.offsetFrames / proj.fps - tk.words[findCues(tk.words, l.cues)[l.anchor.cueId]].start
                       : cut + (l.delivery.startAt || 0);
      if (start < prevEnd + MIN_GAP) {
        const shift = prevEnd + MIN_GAP - start;
        notes.push(`${sh.id}: cut moved ${shift.toFixed(2)} s later so ${l.beat} has room to breathe after ${prevBeat}`);
        cut += shift; start += shift;
        if (cuts.length) cuts[cuts.length - 1].seconds += shift;
      }
      if (start < 0) { notes.push(`${l.beat}: moved to start at 0`); cut -= start; start = 0; }
      end = start + tk.seconds;
      placed.push({ line: l, start, take: tk });
      prevEnd = end; prevBeat = l.beat;
    }
    const seconds = Math.max(sh.seconds, end == null ? 0 : end + TAIL - cut);
    cuts.push({ shot: sh.id, start: cut, seconds, planned: sh.seconds });
    cut += seconds;
  }
  return { cuts, placed, total: cut, notes };
}

function assemble(o, proj, outDir) {
  const takes = {}, used = [];
  for (const l of proj.lines) {
    const t = o.pick[l.beat] || 1;
    const base = path.join(outDir, `${l.beat}-take${t}`);
    const meta = JSON.parse(fs.readFileSync(base + '.json', 'utf8'));
    const wavBuf = fs.readFileSync(base + '.wav');
    if (sha(wavBuf) !== meta.digest) throw new Error(`${base}.wav does not match its recorded digest`);
    const a = readWav(wavBuf);
    takes[l.beat] = { ...meta, audio: resample(a.samples, a.rate, OUT_RATE), seconds: a.samples.length / a.rate };
    used.push({ beat: l.beat, take: t, digest: meta.digest, voice: meta.voice, ttsModel: meta.ttsModel, style: meta.style, sentText: meta.sentText, date: meta.date });
  }
  const lay = layout(proj, takes);
  for (const n of lay.notes) console.log(n);
  const total = Math.round(lay.total * OUT_RATE);
  const track = new Int16Array(total);
  const words = [], cues = [], phrases = [];
  for (const p of lay.placed) {
    const at = Math.round(p.start * OUT_RATE), s = p.take.audio;
    for (let i = 0; i < s.length && at + i < total; i++) track[at + i] = s[i];
    const lw = p.take.words.map(w => ({ word: w.word, beat: p.line.beat,
      onset: at + Math.round(w.start * OUT_RATE), end: w.end == null ? null : at + Math.round(w.end * OUT_RATE) }));
    const idx = findCues(p.take.words, p.line.cues);
    for (const c of p.line.cues) cues.push({ id: c.id, word: c.word, beat: p.line.beat, onset: lw[idx[c.id]].onset });
    phrases.push({ beat: p.line.beat, text: p.line.text, start: lw.length ? lw[0].onset : at,
      end: lw.length ? (lw[lw.length - 1].end || lw[lw.length - 1].onset) : at });
    words.push(...lw);
  }
  const wav = writeWav(track, OUT_RATE);
  fs.writeFileSync(path.join(outDir, 'voice.wav'), wav);
  const digest = sha(wav);
  const cuts = lay.cuts.map(c => ({ shot: c.shot, startFrame: Math.round(c.start * proj.fps), seconds: +c.seconds.toFixed(3), plannedSeconds: c.planned }));
  const timed = { kind: 'timed-voice', version: 1, id: proj.id, payload: {
    audio: 'voice.wav', digest, sampleRate: OUT_RATE, samples: total, fps: proj.fps, source: 'synthesised',
    words, phrases, cues, cuts,
    note: 'Word offsets are in samples. Cuts are a voice-first layout for the edit; picture-anchored cuts (sh3) are set by the editor. Hand-check cue onsets before cutting.' } };
  fs.writeFileSync(path.join(outDir, 'timed-voice.json'), JSON.stringify(timed, null, 2) + '\n');
  const prov = { kind: 'asset-provenance', version: 1, id: proj.id + '-voice', payload: {
    asset: 'voice.wav', digest, role: 'narration', source: 'generated',
    provider: 'Google Gemini API', terms: 'https://ai.google.dev/gemini-api/terms', takes: used,
    publicUse: true, aiDisclosure: 'synthetic voice' } };
  fs.writeFileSync(path.join(outDir, 'provenance.json'), JSON.stringify(prov, null, 2) + '\n');
  console.log(`voice.wav: ${lay.total.toFixed(2)} s (planned ${proj.total} s) at ${OUT_RATE} Hz`);
  console.log('cuts: ' + cuts.map(c => `${c.shot} ${c.seconds.toFixed(2)}s${Math.abs(c.seconds - c.plannedSeconds) > 0.05 ? ` (planned ${c.plannedSeconds})` : ''}`).join(', '));
  console.log('cues: ' + cues.map(c => `${c.word}@${(c.onset / OUT_RATE).toFixed(2)}s`).join(', '));
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  const proj = loadProject(o.dir);
  const outDir = path.join('runs', proj.id, 'voice');
  if (o.cmd === 'generate') await generate(o, proj, outDir);
  else assemble(o, proj, outDir);
}

if (require.main === module) main().catch(e => { console.error('error: ' + e.message); process.exit(1); });

module.exports = { parseArgs, loadProject, ttsText, stylePrompt, ttsRequest, sttRequest, audioFromResponse,
  readWav, writeWav, resample, wordsFromResponse, findCues, layout };
