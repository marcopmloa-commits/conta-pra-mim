(function () {
  const EU = { skin: '#A86E4B', hair: '#1A1414', hairStyle: 'curlytop', outfit: 'tee', shirt: '#B8452A', bottoms: 'pants', pants: '#2C2F3A' };
  const ANTONIO = { skin: '#E6B48C', hair: '#E8E4DA', hairStyle: 'short', facialHair: 'beard', outfit: 'shirt', shirt: '#9CB4D8', glasses: 'round', bottoms: 'pants', pants: '#6A7A9A' };
  const SINDICO = { skin: '#C98A62', hair: '#3A3A3A', hairStyle: 'short', facialHair: 'mustache', outfit: 'suit', robe: '#3A3A44', bottoms: 'pants' };
  const STORY = {
    name: 'O vizinho do 404', voice: 'pt-BR-AntonioNeural', mood: 'dark', title: ['O VIZINHO', 'DO 404'],
    drama: ['tosse.', 'parede.', 'pijama.', 'disse:', 'anos.', 'letra.', 'vizinho.'],
    cast: { eu: EU, antonio: ANTONIO, sindico: SINDICO, sombra: { kind: 'figure' } },
    scenes: [
      { fala: 'Eu morava no apartamento quatrocentos e três. Do lado, o quatrocentos e quatro.', set: 'hallway', light: 'night',
        chars: [{ id: 'eu', walk: [300, 460, 2], expr: 'neutral', s: 1.4, y: 1580 }] },
      { fala: 'Toda noite, eu ouvia alguém do outro lado da parede. Passos, a TV, uma tosse.', set: 'bedroom', light: 'night',
        chars: [{ id: 'eu', x: 560, pose: 'sit', s: 1.25, blanket: true, expr: 'neutral', look: -0.9, then: [{ at: 'passos', fx: 'question' }] }],
        sfx: [{ at: 'passos', type: 'tick', p: 0.3, gain: 0.4 }, { at: 'tosse', type: 'thud', p: 160, gain: 0.3 }] },
      { fala: 'Às vezes, até alguém cantando baixinho.', set: 'bedroom', light: 'night', zoom: [1.1, 1.25],
        chars: [{ id: 'eu', x: 560, pose: 'sit', s: 1.25, blanket: true, expr: 'worried', look: -0.9, fx: 'music' }] },
      { fala: 'Numa noite, eu coloquei música alta. E ouvi três batidas na parede.', set: 'living', light: 'night',
        chars: [{ id: 'eu', x: 540, expr: 'laugh', fx: 'music', then: [{ at: 'batidas', expr: 'shocked', fx: null }] }], sfx: [{ at: 'batidas', type: 'knock', n: 3, gap: 0.45, gain: 0.9 }] },
      { fala: 'Depois, alguém bateu na minha porta. Um senhor, de pijama.', set: 'door', light: 'night', sfx: [{ at: 'bateu', type: 'knock', n: 2, gap: 0.4, gain: 0.7 }],
        chars: [{ id: 'antonio', x: 540, appear: 'senhor', expr: 'smile' }] },
      { fala: 'Ele pediu, muito educado, pra eu abaixar o som, porque ele acordava cedo.', tpl: 'close', set: 'hallway', light: 'night', char: { id: 'antonio', expr: 'talk', then: [{ at: 'cedo', expr: 'smile' }] } },
      { fala: 'Eu pedi desculpa, e ele voltou pro quatrocentos e quatro.', set: 'hallway', light: 'night',
        chars: [{ id: 'antonio', walk: [560, 640, 3], s: 1.2, y: 1500, expr: 'smile' }, { id: 'eu', x: 230, s: 1.45, y: 1620, expr: 'embarrassed', look: 0.6 }] },
      { fala: 'Durante meses, a gente se cumprimentava pelo corredor. Ele sempre sorria.', set: 'hallway', light: 'day',
        chars: [{ id: 'antonio', x: 720, expr: 'happy', gesture: 'wave', look: -0.6 }, { id: 'eu', x: 330, expr: 'happy', gesture: 'wave', look: 0.6 }] },
      { fala: 'Até que um dia, eu encontrei o síndico e comentei: o seu Antônio do quatrocentos e quatro é muito gente boa.', set: 'door', light: 'day',
        chars: [{ id: 'eu', x: 300, expr: 'talk', look: 0.6, then: [{ at: 'gente', expr: 'happy' }] }, { id: 'sindico', x: 780, expr: 'neutral', look: -0.6 }] },
      { fala: 'O síndico me olhou estranho e disse:', tpl: 'close', set: 'door', light: 'day', char: { id: 'sindico', expr: 'worried' } },
      { fala: 'O quatrocentos e quatro está vazio. Há dez anos.', tpl: 'big', lines: ['404', 'VAZIO HÁ', '10 ANOS'], colors: ['#FF3B3B', '#F4EEE0', '#F4EEE0'], at: 'vazio', stagger: 0.5, hit: 'vazio' },
      { fala: 'Desde que o seu Antônio morreu lá dentro, dormindo.', tpl: 'photo', caption: 'seu Antônio, 2014', chars: [{ id: 'antonio', x: 0, s: 0.85, expr: 'happy' }] },
      { fala: 'Ele me levou até a porta e abriu. Só tinha poeira e uma cadeira no meio da sala.', set: 'attic', light: 'dim', sfx: [{ at: 'abriu', type: 'thud', p: 70, gain: 0.6 }],
        chars: [{ id: 'eu', x: 330, expr: 'scared', look: 0.5 }, { id: 'sindico', x: 760, expr: 'worried', look: -0.5 }] },
      { fala: 'Em cima da cadeira, tinha um bilhete. Com a minha letra.', tpl: 'note', bg: '#2A2420', text: 'Desculpa pelo som,\nseu Antônio.\n(vizinho do 403)', at: 'bilhete', dur: 2.4, hit: 'letra' },
      { fala: 'Era o bilhete que eu tinha deixado embaixo da porta dele, no dia seguinte da música.', tpl: 'close', set: 'attic', light: 'dim', heart: true, char: { id: 'eu', expr: 'scared', hold: 'letter' } },
      { fala: 'Naquela noite, eu ouvi três batidas na parede de novo.', set: 'bedroom', light: 'night', heart: true, sfx: [{ at: 'batidas', type: 'knock', n: 3, gap: 0.55, gain: 1 }],
        chars: [{ id: 'eu', x: 560, pose: 'sit', s: 1.25, blanket: true, expr: 'scared', look: -0.9 }] },
      { fala: 'E uma voz baixinha, do outro lado, dizendo: obrigado pelo bilhete, vizinho.', tpl: 'note', bg: '#07070C', text: 'obrigado pelo\nbilhete, vizinho.', at: 'obrigado', dur: 2.2, figure: 'voz', sfx: [{ at: 'voz', type: 'whisper', len: 3, gain: 0.35 }] },
    ],
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = STORY; else globalThis.STORY = STORY;
})();
