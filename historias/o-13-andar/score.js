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
  const st = STORY.build({ U, m, word, cuts, SC, END });
  const heartbeats = [];
  for (const [a, b, p0, p1] of st.heart || []) for (let t = a + 0.3; t < b - 0.2;) { heartbeats.push(+t.toFixed(3)); t += U.lerp(p0, p1, (t - a) / (b - a)); }
  const drone = (st.drone || [[0, 'A1', ['A2', 'E3', 'C4']]]).map(([t, bass, notes], i, all) => ({ t, t1: i + 1 < all.length ? all[i + 1][0] : END, bass: m(bass), notes: notes.map(m), dark: i >= (st.darkFrom || 3) }));
  const markers = {};
  for (const [k, v] of Object.entries(st.sync || {})) markers[k] = { t: v, sync: 'av' };
  markers.black = { t: END, sync: 'av' };
  SC.forEach((s, i) => { markers['s' + i] = cuts[i]; });
  const SCORE = { CAPTIONS, FPS, FORMAT, W, H, SAFE, WIDE, STYLE, DURATION, END, clock, T, BEAT, m, TIMING, SC, cuts, sceneAt, word,
    ev: st.ev, fx: st.fx || [], hits: st.hits || [], heartbeats, drone, motif: st.motif || [], markers, S: { story: [0, END], endcard: [END, DURATION] }, endText: st.endText || 'PARTE 2?' };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
