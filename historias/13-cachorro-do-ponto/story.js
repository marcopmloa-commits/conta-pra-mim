(function () {
  const ZE = { skin: '#A86E4B', hair: '#E8E4DA', hairStyle: 'short', facialHair: 'beard', outfit: 'shirt', shirt: '#8A6A4E', bottoms: 'pants', pants: '#3A3A44', headwear: 'cap', headwearColor: '#3D5A8A' };
  const NETA = { skin: '#A86E4B', hair: '#1A1414', hairStyle: 'curly', outfit: 'hoodie', shirt: '#E8718D', bottoms: 'pants', pants: '#27305C', sleeves: 'long' };
  const VIZ = { skin: '#E6B48C', hair: '#5A3A22', hairStyle: 'bun', outfit: 'dress', shirt: '#3D7A74' };
  const STORY = {
    name: 'O cachorro do ponto', voice: 'pt-BR-AntonioNeural', mood: 'sad', title: ['O CACHORRO', 'DO PONTO'], titleColor: '#F2B84B',
    drama: ['ponto.', 'rabo.', 'mais.', 'tarde.', 'casa.', 'esperando.', 'nele.', 'Zé.'],
    cast: { ze: ZE, neta: NETA, viz: VIZ, caramelo: { kind: 'dog', color: '#C9A063' } },
    scenes: [
      { fala: 'Todo dia, às seis da tarde, o seu Zé descia do ônibus no mesmo ponto.', set: 'bus', light: 'sunset', sfx: [{ at: 0.3, type: 'hum', len: 2.5, gain: 0.35 }],
        chars: [{ id: 'ze', walk: [1250, 760, 2.4], expr: 'smile', look: -0.6 }] },
      { fala: 'E todo dia, o Caramelo estava lá, esperando, abanando o rabo.', set: 'bus', light: 'sunset',
        chars: [{ id: 'ze', x: 760, expr: 'happy', look: -0.8 }, { id: 'caramelo', x: 380, expr: 'happy', look: 0.8 }] },
      { fala: 'Os dois voltavam juntos pra casa, devagar, pela mesma calçada.', set: 'street', light: 'sunset',
        chars: [{ id: 'ze', walk: [-200, 520, 4.5], expr: 'happy' }, { id: 'caramelo', walk: [-380, 340, 4.5], expr: 'happy' }] },
      { fala: 'Um dia, o seu Zé passou mal no trabalho, e não voltou mais.', set: 'hospital', light: 'dim', chars: [{ id: 'ze', x: 380, pose: 'sit', s: 1.2, blanket: true, expr: 'closed' }] },
      { fala: 'Mas o Caramelo continuou indo pro ponto. Todo dia, às seis da tarde.', set: 'bus', light: 'sunset', chars: [{ id: 'caramelo', x: 600, pose: 'sit', look: 0.8 }] },
      { fala: 'Ele esperava cada ônibus chegar, olhava cada porta abrir.', set: 'bus', light: 'sunset', sfx: [{ at: 'onibus', type: 'hum', len: 2, gain: 0.4 }, { at: 'porta', type: 'thud', p: 90, gain: 0.4 }],
        chars: [{ id: 'caramelo', x: 600, pose: 'sit', expr: 'happy', look: 1, then: [{ at: 'porta', expr: 'neutral', look: 0.4 }] }] },
      { fala: 'E quando o último ônibus passava, ele voltava sozinho pra casa.', set: 'street', light: 'night', rain: true, sfx: [{ at: 0.2, type: 'rain', len: 4, gain: 0.3 }],
        chars: [{ id: 'caramelo', walk: [1250, 300, 4.5], look: -0.5 }] },
      { fala: 'Os vizinhos começaram a levar comida e água pra ele.', set: 'bus', light: 'day',
        chars: [{ id: 'viz', x: 760, expr: 'smile', hold: 'cup', look: -0.7 }, { id: 'caramelo', x: 380, pose: 'sit', expr: 'happy', look: 0.8 }] },
      { fala: 'Fizeram uma casinha embaixo do ponto, com cobertor e tudo.', set: 'bus', light: 'day', props: [{ kind: 'box', x: 740, y: 1270, s: 1.8 }],
        chars: [{ id: 'caramelo', x: 460, pose: 'sit', expr: 'happy', look: 0.5 }] },
      { fala: 'Passou o inverno. Passou um ano inteiro. E ele continuou esperando.', tpl: 'big', lines: ['1 ANO', 'ESPERANDO'], colors: ['#F4EEE0', '#F2B84B'], at: 'ano', stagger: 1.2, bg: '#1E2238' },
      { fala: 'Até que um dia, desceu do ônibus uma moça com uma mala.', set: 'bus', light: 'day', sfx: [{ at: 0.2, type: 'hum', len: 2, gain: 0.35 }],
        chars: [{ id: 'caramelo', x: 380, pose: 'sit', look: 0.8 }, { id: 'neta', walk: [1250, 780, 2.2], hold: 'box', expr: 'sad', look: -0.5 }] },
      { fala: 'Era a neta do seu Zé, que morava em outro estado.', tpl: 'close', set: 'bus', light: 'day', char: { id: 'neta', expr: 'sad', hold: 'box' } },
      { fala: 'Ela tinha vindo buscar as coisas do avô. E viu o Caramelo no ponto.', set: 'bus', light: 'day',
        chars: [{ id: 'neta', x: 760, expr: 'sad', look: -0.8, then: [{ at: 'caramelo', expr: 'shocked' }] }, { id: 'caramelo', x: 380, pose: 'sit', look: 0.8 }] },
      { fala: 'Ele correu até ela e cheirou a mão dela. Ela tinha o mesmo cheiro do seu Zé.', set: 'bus', light: 'day',
        chars: [{ id: 'neta', x: 760, expr: 'cry', look: -0.8 }, { id: 'caramelo', walk: [380, 600, 1], expr: 'happy', look: 0.8 }] },
      { fala: 'Ela sentou no chão e chorou abraçada nele.', set: 'bus', light: 'sunset',
        chars: [{ id: 'neta', x: 620, pose: 'floor', s: 1.4, expr: 'cry', fx: 'tears' }, { id: 'caramelo', x: 380, pose: 'sit', expr: 'happy', look: 0.8 }] },
      { fala: 'Hoje, o Caramelo mora com ela. Mas todo dia, às seis da tarde,', set: 'living', light: 'sunset',
        chars: [{ id: 'neta', x: 300, expr: 'happy', look: 0.6 }, { id: 'caramelo', x: 700, pose: 'sit', expr: 'happy', look: 0.6 }] },
      { fala: 'ele ainda senta na janela e olha pra rua. Como quem diz: eu ainda tô aqui, seu Zé.', set: 'living', light: 'sunset', zoom: [1.1, 1.3], focus: [760, 1100],
        chars: [{ id: 'caramelo', x: 780, y: 1180, pose: 'sit', look: 0.8 }] },
    ],
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = STORY; else globalThis.STORY = STORY;
})();
