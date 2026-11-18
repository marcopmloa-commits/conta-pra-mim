(function () {
  const STORY = {
    build({ word, cuts, SC, END }) {
      const ev = {
        lightUp: word(2, 'acendeu'), singing: word(2, 'cantando'), stop: word(7, 'parou'), whisper: word(8, 'sussurrou'),
        awake: word(9, 'acordada'), open: word(10, 'abri'), knock: cuts[12] + 0.35, song: word(14, 'musica'), alone: word(16, 'sozinha'),
      };
      // an original lullaby phrase (music box), played while "she" sings
      const LULL = [76, 74, 72, 74, 76, 76, 76, 74, 74, 76, 79, 79];
      const fx = [{ t: 0.3, type: 'air', gain: 0.2 }, { t: ev.lightUp, type: 'click', gain: 0.5 }];
      let k = 0;
      for (let t = ev.lightUp + 0.3; t < ev.stop - 0.2; t += 0.55, k++) fx.push({ t, type: 'mb', p: LULL[k % LULL.length], gain: 0.13, verb: 0.15 });
      for (let t = ev.song, j = 0; j < 8; t += 0.55, j++) fx.push({ t, type: 'mb', p: LULL[j] - 12, gain: 0.08, verb: 0.2 });
      fx.push({ t: ev.whisper + 0.3, type: 'whisper', len: 2.8, gain: 0.3 }, { t: ev.open, type: 'thud', p: 70, gain: 0.8 });
      fx.push({ t: ev.knock, type: 'knock', n: 3, gap: 0.4, gain: 0.6 });
      for (let t = ev.alone + 0.2, j = 0; j < 10; t += 0.55, j++) fx.push({ t, type: 'mb', p: LULL[j], gain: 0.13, verb: 0.2 });
      return {
        ev, fx, hits: [ev.awake, ev.alone], sync: { awake: ev.awake, alone: ev.alone },
        heart: [[cuts[6], cuts[11], 1.0, 0.55], [cuts[15], END, 0.9, 0.5]],
        drone: [[0, 'C2', ['C3', 'G3', 'Eb4']], [cuts[2], 'Ab1', ['Ab2', 'Eb3', 'C4']], [cuts[6], 'F1', ['F2', 'C3', 'Ab3']], [cuts[11], 'C2', ['C3', 'G3', 'Eb4']], [cuts[14], 'Db2', ['Db3', 'Ab3', 'F4']]],
        darkFrom: 2, motif: [],
      };
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = STORY; else globalThis.STORY = STORY;
})();
