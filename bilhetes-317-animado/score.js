// THE SCORE: single source of truth. Times come from the narration's real word timings (timing.js),
// so every cut, sound effect and caption lands on the spoken word.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const TIMING = node ? require('./timing') : globalThis.TIMING;
  const { m, makeClock } = MU;

  const FPS = 30;
  const FORMAT = U.pickFormat('9:16');
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  const WIDE = W / H > 1.2;
  const STYLE = 'paper';
  const clock = makeClock({ bpm: 60, offset: 0 }); // 1 beat = 1 s (only used for bar:beat time arguments)
  const { T, BEAT } = clock;

  const SC = TIMING.scenes;
  const END = SC[SC.length - 1].t1 + 1.3;
  const CAPTIONS = false; // legendas desligadas neste teste // hard cut to black after the last word
  const DURATION = END + 4.2; // end card

  // a visual cut slightly before each line is spoken
  const cuts = SC.map((s, i) => (i === 0 ? 0 : +(s.t0 - 0.22).toFixed(3)));
  const sceneAt = (t) => { let k = 0; for (let i = 0; i < cuts.length; i++) if (t >= cuts[i]) k = i; return k; };
  // time a word starts: word(scene, 'dentro') or word(scene, 'não', 2) for the 2nd occurrence
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  function word(i, w, nth = 1) {
    let n = 0;
    for (const x of SC[i].words) if (norm(x.w) === norm(w) && ++n === nth) return x.t;
    throw new Error(`word "${w}" (#${nth}) not in scene ${i}`);
  }

  const ev = {
    noteUnderDoor: 2.9,
    firstNoteText: word(2, 'voce'),
    notes3: [word(5, 'nao', 1), word(5, 'tranque'), word(5, 'nao', 2)],
    phoneRing: word(6, 'tocou'),
    phoneStop: cuts[8],
    clockFlip: word(10, 'dezessete'),
    freeze: word(11, 'gelar'),
    inside: word(13, 'dentro'),
    self: word(15, 'mim'),
    closedEyes: word(15, 'fechados'),
    onlyASecond: word(17, 'so'),
    someone: word(18, 'alguem'),
    whisper: word(19, 'sussurrando'),
    his: word(20, 'dele'),
    dontLook: word(21, 'nao'),
    black: END,
  };

  // phone rings: two quick trills every 2 s from "tocou" until the next scene cut
  const rings = [];
  for (let t = ev.phoneRing; t < ev.phoneStop - 0.6; t += 2.0) rings.push(+t.toFixed(3));
  // heartbeat: speeds up through the reveals
  const heartbeats = [];
  for (const [a, b, p0, p1] of [[cuts[11], cuts[14], 1.0, 0.75], [cuts[18], END, 0.9, 0.5]]) {
    for (let t = a + 0.3; t < b - 0.2;) { heartbeats.push(+t.toFixed(3)); t += U.lerp(p0, p1, (t - a) / (b - a)); }
  }
  // pencil scribbles while she writes asleep
  const scribbles = [];
  for (const i of [16, 18]) for (let t = cuts[i] + 0.4; t < cuts[i + 1] - 0.4; t += 1.1) scribbles.push(+t.toFixed(3));

  // drone harmony (A minor, very slow), brighter and lower as the story darkens
  const drone = [
    [0, 'A1', ['A2', 'E3', 'C4']], [cuts[4], 'F1', ['F2', 'C3', 'A3']], [cuts[8], 'D2', ['D3', 'A3', 'F4']],
    [cuts[11], 'E1', ['E2', 'B2', 'G#3']], [cuts[15], 'A1', ['A2', 'E3', 'C4']], [cuts[18], 'Bb1', ['Bb2', 'F3', 'Db4']],
    [cuts[21], 'A1', ['A2', 'Eb3', 'C4']],
  ].map(([t, bass, notes], i, all) => ({ t, t1: i + 1 < all.length ? all[i + 1][0] : END, bass: m(bass), notes: notes.map(m) }));
  // a sparse music-box motif in the calm first part
  const motif = [];
  ['E5', 'C5', 'A4', 'B4', 'G#4'].forEach((n, k) => motif.push({ t: 1.2 + k * 0.55, midi: m(n) }));
  ['E5', 'D5', 'C5', 'B4', 'A4'].forEach((n, k) => motif.push({ t: cuts[4] + 0.6 + k * 0.6, midi: m(n) }));

  const S = { intro: [0, cuts[2]], notes: [cuts[2], cuts[8]], camera: [cuts[8], cuts[13]], reveal: [cuts[13], cuts[18]], figure: [cuts[18], END], endcard: [END, DURATION] };

  const markers = {
    clockFlip: { t: ev.clockFlip, sync: 'av' },
    inside: { t: ev.inside, sync: 'av' },
    someone: { t: ev.someone, sync: 'av' },
    black: { t: ev.black, sync: 'av' },
    self: ev.self, whisper: ev.whisper, dontLook: ev.dontLook,
  };
  SC.forEach((s, i) => { markers['s' + i] = cuts[i]; });

  const SCORE = { CAPTIONS, FPS, FORMAT, W, H, SAFE, WIDE, STYLE, DURATION, END, clock, T, BEAT, S, m, TIMING, SC, cuts, sceneAt, word, ev, rings, heartbeats, scribbles, drone, motif, markers };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
