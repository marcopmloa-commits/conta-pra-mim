// Generic score for a dark-story film. Story-specific events come from story.js (STORY.build).
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const TIMING = node ? require('./timing') : globalThis.TIMING;
  const STORY = node ? require('./story') : globalThis.STORY;
  const { m, makeClock } = MU;
  const FPS = 30, FORMAT = U.pickFormat('9:16');
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H), WIDE = W / H > 1.2, STYLE = 'paper';
  const clock = makeClock({ bpm: 60, offset: 0 });
  const { T, BEAT } = clock;
  const CAPTIONS = STORY.captions === true;
  const SC = TIMING.scenes;
  const END = SC[SC.length - 1].t1 + 1.3;
  const DURATION = END + 4.2;
  const cuts = SC.map((s, i) => (i === 0 ? 0 : +(s.t0 - 0.22).toFixed(3)));
  const sceneAt = (t) => { let k = 0; for (let i = 0; i < cuts.length; i++) if (t >= cuts[i]) k = i; return k; };
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  function word(i, w, nth = 1) {
    let n = 0;
    for (const x of SC[i].words) if (norm(x.w) === norm(w) && ++n === nth) return x.t;
    throw new Error(`word "${w}" (#${nth}) not in scene ${i}`);
  }
  const mood = STORY.mood || 'dark';
  const st = STORY.build ? STORY.build({ U, m, word, cuts, SC, END }) : genericBuild();
  function genericBuild() {
    const atT = (i, a) => (a == null ? cuts[i] : typeof a === 'number' ? cuts[i] + a : Array.isArray(a) ? word(i, a[0], a[1]) : word(i, a));
    const fx = [{ t: 0.3, type: 'air', gain: 0.2 }], hits = [], sync = {}, heart = [];
    const KEYS = ['at', 'appear', 'walkAt', 'hit', 'confetti', 'buzz', 'figure'];
    const check = (i, o) => { if (!o || typeof o !== 'object') return; if (Array.isArray(o) && typeof o[0] === 'string' && typeof o[1] === 'number') return; for (const [k, v] of Object.entries(o)) { if (KEYS.includes(k) && v != null && typeof v !== 'object') atT(i, v); else if (KEYS.includes(k) && Array.isArray(v)) atT(i, v); else check(i, v); } };
    STORY.scenes.forEach((sp, i) => {
      if (i >= SC.length) throw new Error('more scenes in story.js than lines in the script');
      check(i, sp);
      for (const e of sp.sfx || []) fx.push(Object.assign({}, e, { t: atT(i, e.at) }));
      if (sp.hit != null) { const t = atT(i, sp.hit); hits.push(t); sync['hit' + i] = t; }
      if (sp.heart) heart.push([cuts[i], cuts[i + 1] || END, 0.95, 0.6]);
    });
    if (STORY.scenes.length !== SC.length) throw new Error(`story.js has ${STORY.scenes.length} scenes but the script has ${SC.length}`);
    const PRE = {
      dark: [['A1', ['A2', 'E3', 'C4']], ['F1', ['F2', 'C3', 'A3']], ['D2', ['D3', 'A3', 'F4']], ['E1', ['E2', 'B2', 'G#3']]],
      tense: [['D2', ['D3', 'A3', 'F4']], ['Bb1', ['Bb2', 'F3', 'D4']], ['G1', ['G2', 'D3', 'Bb3']], ['A1', ['A2', 'E3', 'C#4']]],
      warm: [['C2', ['C3', 'G3', 'E4']], ['A1', ['A2', 'E3', 'C4']], ['F1', ['F2', 'C3', 'A3']], ['G1', ['G2', 'D3', 'B3']]],
      sad: [['A1', ['A2', 'E3', 'C4']], ['F1', ['F2', 'C3', 'A3']], ['C2', ['C3', 'G3', 'E4']], ['G1', ['G2', 'D3', 'B3']]],
      fun: [['C2', ['C3', 'G3', 'E4']], ['F1', ['F2', 'C3', 'A3']], ['G1', ['G2', 'D3', 'B3']], ['C2', ['C3', 'G3', 'E4']]],
    }[mood];
    const seg = mood === 'fun' ? 4 : 8, drone = [];
    for (let t = 0, k = 0; t < END; t += seg, k++) drone.push([t, PRE[k % 4][0], PRE[k % 4][1]]);
    const motif = [];
    if (mood === 'warm' || mood === 'sad') drone.forEach(([t, b, notes]) => { for (let j = 0; j < 4; j++) motif.push({ t: t + 0.5 + j * 1.6, midi: m(notes[j % 3]) + 12 + (j === 3 ? 12 : 0), gain: mood === 'sad' ? 0.09 : 0.11 }); });
    if (mood === 'fun') drone.forEach(([t, b, notes]) => { for (let j = 0; j < 16; j++) if (j % 4 !== 3) motif.push({ t: t + j * 0.25, midi: m(notes[[0, 1, 2, 1][j % 4]]) + 12, gain: j % 4 === 0 ? 0.16 : 0.1, inst: 'marimba' }); });
    if (mood === 'dark' || mood === 'tense') [0, 1, 2, 3, 4].forEach((j) => motif.push({ t: 1 + j * 0.55, midi: m(['E5', 'C5', 'A4', 'B4', 'G#4'][j]), gain: 0.12 }));
    return { ev: {}, fx, hits, sync, heart, drone, motif, darkFrom: mood === 'dark' || mood === 'tense' ? 2 : 99 };
  }
  const heartbeats = [];
  for (const [a, b, p0, p1] of st.heart || []) for (let t = a + 0.3; t < b - 0.2;) { heartbeats.push(+t.toFixed(3)); t += U.lerp(p0, p1, (t - a) / (b - a)); }
  const drone = (st.drone || [[0, 'A1', ['A2', 'E3', 'C4']]]).map(([t, bass, notes], i, all) => ({ t, t1: i + 1 < all.length ? all[i + 1][0] : END, bass: m(bass), notes: notes.map(m), dark: i >= (st.darkFrom || 3) }));
  const markers = {};
  for (const [k, v] of Object.entries(st.sync || {})) markers[k] = { t: v, sync: 'av' };
  markers.black = { t: END, sync: 'av' };
  SC.forEach((s, i) => { markers['s' + i] = cuts[i]; });
  const SCORE = { CAPTIONS, FPS, FORMAT, W, H, SAFE, WIDE, STYLE, DURATION, END, clock, T, BEAT, m, TIMING, SC, cuts, sceneAt, word,
    ev: st.ev, fx: st.fx || [], hits: st.hits || [], heartbeats, drone, motif: st.motif || [], markers, S: { story: [0, END], endcard: [END, DURATION] }, mood, endText: STORY.endText || st.endText || (mood === 'dark' || mood === 'tense' ? 'PARTE 2?' : 'CURTIU?') };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
