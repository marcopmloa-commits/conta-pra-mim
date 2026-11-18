(function () {
  const STORY = {
    build({ word, cuts, SC, END }) {
      const ev = {
        ring: word(1, 'tocou'), answer: word(3, 'atendi'), warn: word(4, 'nao'), hangup: word(5, 'desligou'), knock: word(7, 'bateu'),
        voice: word(8, 'abre'), buzz: word(10, 'vibrou'), laugh: word(12, 'rir'), dawn: word(14, 'amanheceu'), many: word(15, 'muitas'), note: word(16, 'bilhete'),
      };
      const fx = [{ t: 0.2, type: 'rain', len: cuts[14] - 0.2, gain: 0.3 }];
      for (let t = ev.ring; t < cuts[3] - 0.5; t += 2) fx.push({ t, type: 'ring', gain: 0.4 });
      fx.push({ t: ev.hangup, type: 'click', gain: 0.5 }, { t: cuts[6] + 0.3, type: 'tick', p: 0.6, gain: 0.3 });
      fx.push({ t: ev.knock, type: 'knock', n: 3, gap: 0.7, gain: 0.9 });
      fx.push({ t: ev.buzz, type: 'buzz' }, { t: cuts[12], type: 'knock', n: 6, gap: 0.32, gain: 1 }, { t: ev.laugh + 0.2, type: 'whisper', len: 2.4, gain: 0.35 });
      fx.push({ t: ev.dawn, type: 'air', len: 2, gain: 0.25 }, { t: ev.note, type: 'paper', gain: 0.4 });
      const motif = [72, 71, 69, 67, 69].map((midi, k) => ({ t: ev.note + 0.6 + k * 0.6, midi, gain: 0.16 }));
      return {
        ev, fx, hits: [ev.laugh, ev.many], sync: { laugh: ev.laugh, many: ev.many }, motif,
        heart: [[cuts[7], cuts[14], 1.0, 0.5]],
        drone: [[0, 'G1', ['G2', 'D3', 'Bb3']], [cuts[3], 'Eb2', ['Eb3', 'Bb3', 'G4']], [cuts[7], 'C2', ['C3', 'G3', 'Eb4']], [cuts[12], 'Db2', ['Db3', 'Ab3', 'F4']], [cuts[14], 'G1', ['G2', 'D3', 'Bb3']], [cuts[16], 'Eb2', ['Eb3', 'G3', 'Bb3']]],
        darkFrom: 2,
      };
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = STORY; else globalThis.STORY = STORY;
})();
