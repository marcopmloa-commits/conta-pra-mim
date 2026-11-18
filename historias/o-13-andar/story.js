(function () {
  const STORY = {
    build({ word, cuts, SC, END }) {
      const ev = {
        floors: [word(4, 'dez'), word(4, 'onze'), word(4, 'doze')],
        thirteen: word(5, 'treze'),
        open: cuts[6] + 0.25,
        turn: word(9, 'virar'),
        close: word(10, 'fecharam'),
        fire: word(12, 'incendio'),
        notAlone: word(14, 'sozinho'),
        burned: word(15, 'queimada'),
        whisper: word(16, 'sussurrou'),
      };
      const fx = [{ t: 0.3, type: 'air', gain: 0.25 }, { t: cuts[2] + 0.4, type: 'click', gain: 0.4 }, { t: cuts[2] + 1.2, type: 'thud', p: 90, gain: 0.5 },
        { t: cuts[2] + 1.6, type: 'hum', len: ev.thirteen - cuts[2] - 1.6, gain: 0.35 }];
      for (let k = 0; k < 4; k++) fx.push({ t: cuts[3] + 0.4 + k * 0.45, type: 'click', gain: 0.35 });
      for (const t of ev.floors) fx.push({ t, type: 'ding', gain: 0.18, verb: 0.1 });
      fx.push({ t: ev.open, type: 'ding', gain: 0.3, verb: 0.3 }, { t: ev.open + 0.2, type: 'wind', len: 2.4, gain: 0.2 });
      for (let t = cuts[8] + 0.2; t < cuts[9] - 0.2; t += 0.22) fx.push({ t, type: 'click', gain: 0.35 });
      fx.push({ t: ev.close, type: 'thud', p: 60, gain: 0.9 }, { t: ev.close + 0.1, type: 'hum', len: 2.2, gain: 0.4 });
      fx.push({ t: cuts[13] + 0.3, type: 'click', gain: 0.4 }, { t: ev.whisper - 0.2, type: 'whisper', len: 3.2, gain: 0.25 });
      return {
        ev, fx,
        hits: [ev.thirteen, ev.burned],
        sync: { thirteen: ev.thirteen, burned: ev.burned },
        heart: [[cuts[6], cuts[11], 1.0, 0.55], [cuts[14], END, 0.9, 0.5]],
        drone: [[0, 'D2', ['D3', 'A3', 'F4']], [cuts[4], 'Bb1', ['Bb2', 'F3', 'D4']], [cuts[6], 'A1', ['A2', 'E3', 'C4']], [cuts[11], 'D2', ['D3', 'A3', 'F4']], [cuts[14], 'Eb2', ['Eb3', 'Bb3', 'Gb4']]],
        darkFrom: 2,
        motif: [['A4', 1.0], ['F4', 1.5], ['D4', 2.0], ['E4', 2.6], ['C#4', 3.2]].map(([n, t]) => ({ t, midi: ({ 'A4': 69, 'F4': 65, 'D4': 62, 'E4': 64, 'C#4': 61 })[n] })),
      };
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = STORY; else globalThis.STORY = STORY;
})();
