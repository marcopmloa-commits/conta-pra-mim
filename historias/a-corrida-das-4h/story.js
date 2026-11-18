(function () {
  const STORY = {
    build({ word, cuts, SC, END }) {
      const ev = {
        wrong: word(3, 'errado'), accel: word(4, 'acelerou'), photo: word(6, 'foto'), plate: word(7, 'placa'), spoke: word(8, 'falou'),
        dontLook: word(9, 'nao'), man: word(10, 'homem'), run: word(11, 'corre'), gone: word(13, 'sumido'), died: word(15, 'morreu'), third: word(16, 'terceira'),
      };
      const fx = [{ t: 0.3, type: 'air', gain: 0.2 }, { t: cuts[1] + 0.2, type: 'hum', len: 3, gain: 0.4 }, { t: cuts[2] + 0.1, type: 'thud', p: 70, gain: 0.7 },
        { t: cuts[2] + 0.4, type: 'hum', len: cuts[11] - cuts[2], gain: 0.45 }, { t: ev.accel, type: 'wind', len: 3, gain: 0.35 }];
      for (let k = 0; k < 6; k++) fx.push({ t: cuts[3] + 0.3 + k * 0.5, type: 'tick', p: 0.5, gain: 0.35 });
      fx.push({ t: cuts[5] + 0.6, type: 'click', gain: 0.4 }, { t: ev.photo, type: 'click', gain: 0.3 }, { t: cuts[8] + 0.4, type: 'click', gain: 0.5 });
      fx.push({ t: ev.run - 0.6, type: 'rewind', gain: 0.4 }, { t: ev.run - 0.05, type: 'thud', p: 60, gain: 0.8 });
      for (let k = 0; k < 8; k++) fx.push({ t: cuts[12] + 0.2 + k * 0.28, type: 'tick', p: 0.3, gain: 0.45 });
      fx.push({ t: cuts[16] + 0.2, type: 'hum', len: 3, gain: 0.35 });
      return {
        ev, fx, hits: [ev.man, ev.third], sync: { man: ev.man, third: ev.third },
        heart: [[cuts[5], cuts[11], 0.9, 0.45], [cuts[15], END, 1.0, 0.6]],
        drone: [[0, 'E2', ['E3', 'B3', 'G4']], [cuts[3], 'C2', ['C3', 'G3', 'E4']], [cuts[6], 'F#1', ['F#2', 'C3', 'A3']], [cuts[11], 'E2', ['E3', 'B3', 'G4']], [cuts[14], 'F2', ['F3', 'C4', 'Ab4']]],
        darkFrom: 2, motif: [],
      };
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = STORY; else globalThis.STORY = STORY;
})();
