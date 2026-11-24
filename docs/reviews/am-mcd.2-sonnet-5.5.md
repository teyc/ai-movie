# Code review: am-mcd.2 (scripts/narrate.js, test/narrate.test.js)

Reviewer: Sonnet 5.5. Range: 05ce752..HEAD (commit 08e32e6; later commit d64e5a3 touches data only). `node --test`: 53 pass. `generate --dry-run` runs (16 requests, cap 20). Real outputs in runs/child-peek/voice/ read, not modified. No key value was read or printed. No API key pattern found in tracked files; runs/ is git-ignored.

## 1. Wrong against the bead

- **high** scripts/narrate.js:174-195, 223-231, 291; test/narrate.test.js: the bead's test requirement "the script, the transcript and the words heard agree" is not implemented. Nothing compares the transcript with the line's text. The assembled record shows it: runs/child-peek/voice/b4-take1.json heard "Not that." (line is "Not Dad."), and b1 heard "6:00." for "Six o'clock." Both flowed into timed-voice.json `words` and `generate` printed no warning. `findCues` matches only the cue word ("Not"), so the take passes while the film's punchline word may be wrong. Add a normalised script-vs-heard comparison (with a number/word tolerance or an explicit warning) in `generate` and `assemble`, and a fixture test where they differ.
- **medium** scripts/narrate.js:289-292: the bead says hand-check and correct cue marks, but there is no way to record a correction. Cue onsets come only from transcript word starts, and `assemble` rewrites timed-voice.json from scratch (305), so a hand-edit is lost on the next assemble. Add a per-cue override (for example `--cue car=6.74` or an overrides file read by assemble).
- **medium** scripts/narrate.js:179, runs b4-take1.json: transcript timestamps are coarse (0.1 s steps: 0.3/0.4/0.8). Cue onsets are therefore good to about plus or minus 3 frames at 30 fps, and the cuts are placed relative to them (offsetFrames -10/-8). Either refine the onset against audio energy or state the tolerance in the record's note.
- **low** scripts/narrate.js:301-304: "the timed-voice record validates" cannot be checked. No validator or schema for `timed-voice` exists in the repo (only mentions in plan/beads). Say which validator the bead means, or add one.
- **low** scripts/narrate.js:306-309: provenance records the TTS model, but not the transcription model (which produced the timings), and has no run-level date (dates are per take).
- **low** scripts/narrate.js:53: a speech anchor on the first shot is silently ignored (sh1's `watch` anchor).

## 2. Bugs

- **medium** scripts/narrate.js:216-231: `generate` overwrites existing `<beat>-take<N>.wav/.json` without asking. Re-running after the human has picked takes (paid) destroys the picked takes, and `assemble` then fails the digest check or silently uses new audio. There is no resume either: a failure mid-run (for example at b5) leaves partial output and a re-run pays again for all lines. Skip takes that already exist unless `--force`.
- **medium** scripts/narrate.js:57-70, 218, 241, 272: more than one `spoken` entry per beat is mishandled. All entries share `${beat}-take${t}` file names (later overwrites earlier), `takes`/`pick` are keyed by beat, and `lineOf` keeps only the first line of a shot. The other lines are dropped without a message. child-peek has one line per beat, so it works today; a real screenplay would not. Key by line id, or throw on duplicates.
- **medium** scripts/narrate.js:21-34: arguments are not validated. `--max-requests abc` gives NaN, and `planned > NaN` is false, so the paid cap check is bypassed. `--takes abc`, `--takes 0` or a missing value gives NaN or nonsense. Require positive integers.
- **low** scripts/narrate.js:226-231 and 177: a take whose transcript is empty or lacks the cue words is only caught later in `assemble` (`findCues` throws at 192). Check cues in `generate` right after transcription, so the human is told before picking.
- **low** scripts/narrate.js:178-179: `wordsFromResponse` does not handle missing `words` (TypeError) or a missing `startOffset` (NaN onset written silently).
- **low** scripts/narrate.js:136-150: `readWav` accepts any format tag (float PCM with 16 bits would be misread); an odd-length data chunk throws a RangeError from `new Int16Array`; a chunk size past the buffer end is not checked.
- **low** scripts/narrate.js:257: when a later shot's line would start before 0 the code moves `cut` and breaks that shot's anchor. Unreachable for shot 1 only; harmless here.
- **low** scripts/narrate.js:272: an unpicked beat silently defaults to take 1. Fine for a pilot; warn instead.
- **low** scripts/narrate.js:115-122: `fetch` has no timeout or retry; a hung request stalls the run.

## 3. Safety

- No finding on secrets: the key is read at 201 and used only in the `x-goog-api-key` header (117), never in a URL, log, error message (the 500-char error body is the server's) or output file. `meta` (224-226) and provenance hold no key. `runs/` is git-ignored.
- **medium** (paid cap): the cap is checked once up front against `lines x takes x 2` (204-206) and is bypassed by non-numeric `--max-requests` (see Bugs). There is no per-request counter, so the cap is only as good as the plan arithmetic. Add a counter inside `call`.
- **low**: `generate` writes into a relative `runs/<id>/voice` path (319), so the result depends on the current directory; resolve against the repo root.
- No shell-outs; no deletes.

## 4. Tests (test/narrate.test.js)

The 8 tests are offline and meaningful for parsing, but do not prove:
- script, transcript and heard words agree (the bead's stated test); the fixture (50-55) is hand-made to match the script and would pass a wrong take.
- `assemble` end to end: digest mismatch, pick handling, the 48 kHz track length, cue onsets in samples, provenance contents, that no key-like string is written.
- parseArgs cap bypass (`--max-requests abc`), `--takes 0`.
- `readWav` on a real header with extra chunks (LIST), stereo, odd length; `wordsFromResponse` with a missing `endOffset` or empty words.
- layout: a negative start, the MIN_GAP shift on an unanchored line, two lines in one shot.
- line 13 asserts positions from the example's current data, so it breaks on any screenplay edit (fragile, not wrong).

## 6. Simplifications

- **low** scripts/narrate.js:76-83: the breath-removal regex is only partly exercised; fine, but `ttsText` and `stylePrompt` could share one `delivery` builder with the dry run output. Not worth doing now.
- **low**: `takes` and `used` in `assemble` hold the same data twice; build provenance from `takes`.

## Summary of high and medium

high: no script-vs-heard check (b4 take 1 heard "Not that", b1 heard "6:00.").
medium: no way to record hand-corrected cue onsets (assemble overwrites); 0.1 s timestamp granularity; generate overwrites picked takes and cannot resume; multiple spoken lines per beat collide; argument validation lets NaN bypass the request cap (also listed under Safety).
