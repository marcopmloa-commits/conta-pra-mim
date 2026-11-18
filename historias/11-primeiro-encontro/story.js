(function () {
  const EU = { skin: '#E6B48C', hair: '#8C5A2B', hairStyle: 'quiff', outfit: 'shirt', shirt: '#F4F1EA', bottoms: 'pants', pants: '#27305C' };
  const JU = { skin: '#C98A62', hair: '#1A1414', hairStyle: 'bun', outfit: 'dress', shirt: '#B8452A', shoes: '#2A2320' };
  const GARCOM = { skin: '#A86E4B', hair: '#1A1414', hairStyle: 'buzz', outfit: 'suit', robe: '#1A1A20', trim: '#1A1A20', bottoms: 'pants' };
  const STORY = {
    name: 'O primeiro encontro', voice: 'pt-BR-AntonioNeural', mood: 'fun', title: ['O PRIMEIRO', 'ENCONTRO'], titleColor: '#F2B84B',
    drama: ['história.', 'inteira.', 'tudo.', 'vento.', 'olhar.', 'anos.', 'mesa.'],
    cast: { eu: EU, ju: JU, garcom: GARCOM },
    scenes: [
      { fala: 'O meu primeiro encontro com a Júlia foi o maior desastre da história.', set: 'street', light: 'sunset',
        chars: [{ id: 'eu', walk: [-150, 540, 3], expr: 'happy', hold: 'flower' }] },
      { fala: 'Eu cheguei atrasado, porque o ônibus quebrou no meio do caminho.', set: 'bus', light: 'sunset', sfx: [{ at: 'quebrou', type: 'thud', p: 60, gain: 0.7 }],
        chars: [{ id: 'eu', x: 360, expr: 'neutral', hold: 'flower', then: [{ at: 'quebrou', expr: 'shocked', fx: 'question' }] }] },
      { fala: 'Corri tanto que cheguei suado, sem fôlego e com a camisa pra fora.', tpl: 'close', set: 'street', light: 'sunset', char: { id: 'eu', expr: 'embarrassed', hold: 'flower' } },
      { fala: 'No restaurante, eu fui puxar a cadeira pra ela e derrubei a mesa inteira.', set: 'cafe', light: 'warm', hit: 'derrubei', sfx: [{ at: 'derrubei', type: 'thud', p: 70, gain: 0.9 }],
        chars: [{ id: 'ju', x: 720, expr: 'smile', look: -0.6, then: [{ at: 'derrubei', expr: 'shocked' }] }, { id: 'eu', x: 360, expr: 'happy', look: 0.6, then: [{ at: 'derrubei', expr: 'scared' }] }] },
      { fala: 'O garçom escorregou no suco e caiu em cima de mim.', tpl: 'big', lines: ['SPLASH!'], color: '#F2B84B', size: 190, at: 'caiu', bg: '#E0703E', sfx: [{ at: 'escorregou', type: 'rewind', gain: 0.3 }, { at: 'caiu', type: 'thud', p: 60, gain: 1 }] },
      { fala: 'Eu fiquei todo molhado de laranja, na frente de todo mundo.', tpl: 'close', set: 'cafe', light: 'warm', char: { id: 'eu', expr: 'embarrassed', style: null, fx: 'tears' } },
      { fala: 'Pra piorar, quando a conta chegou, eu descobri que tinha esquecido a carteira.', tpl: 'icon', icon: 'money', label: 'E A CARTEIRA?', at: 'conta', bg: '#B8452A', bg2: '#3A1010' },
      { fala: 'A Júlia teve que pagar tudo.', tpl: 'close', set: 'cafe', light: 'warm', char: { id: 'ju', expr: 'smirk', hold: 'phone' } },
      { fala: 'Na saída, começou a chover. E o meu guarda-chuva quebrou na primeira rajada de vento.', set: 'street', light: 'night', rain: true, sfx: [{ at: 'chover', type: 'rain', len: 5, gain: 0.4 }, { at: 'quebrou', type: 'wind', len: 2, gain: 0.5 }],
        chars: [{ id: 'ju', x: 720, expr: 'neutral', look: -0.6 }, { id: 'eu', x: 360, expr: 'worried', look: 0.6, then: [{ at: 'quebrou', expr: 'shocked' }] }] },
      { fala: 'Eu olhei pra ela e pedi desculpa. Disse que entendia se ela nunca mais quisesse me ver.', tpl: 'close', set: 'street', light: 'night', rain: true, char: { id: 'eu', expr: 'sad' } },
      { fala: 'Ela ficou em silêncio. Molhada, olhando pra mim.', tpl: 'close', set: 'street', light: 'night', rain: true, char: { id: 'ju', expr: 'neutral' } },
      { fala: 'E começou a rir. Uma risada tão alta que as pessoas pararam pra olhar.', tpl: 'close', set: 'street', light: 'night', rain: true, char: { id: 'ju', expr: 'laugh', fx: 'music' } },
      { fala: 'Ela disse que foi o encontro mais divertido da vida dela.', set: 'street', light: 'night', rain: true,
        chars: [{ id: 'ju', x: 700, expr: 'laugh', look: -0.6 }, { id: 'eu', x: 380, expr: 'laugh', look: 0.6, fx: 'hearts' }] },
      { fala: 'E que ia me dar uma segunda chance. Desde que eu pagasse o próximo.', tpl: 'big', lines: ['SEGUNDA', 'CHANCE'], colors: ['#F4EEE0', '#F2B84B'], at: 'segunda', stagger: 1.6, bg: '#27305C' },
      { fala: 'Isso foi há cinco anos.', tpl: 'big', lines: ['5 ANOS', 'DEPOIS'], at: 'cinco', stagger: 0.4, bg: '#3A2A20' },
      { fala: 'Ontem, eu pedi ela em casamento. No mesmo restaurante. Na mesma mesa.', tpl: 'icon', icon: 'ring', label: 'CASA COMIGO?', labelColor: '#F4EEE0', at: 'casamento', fx: 'hearts' },
      { fala: 'Ela disse sim. E dessa vez, ninguém derrubou nada. Quer dizer, quase ninguém.', set: 'cafe', light: 'warm', confetti: 'sim', sfx: [{ at: 'quase', type: 'thud', p: 70, gain: 0.8 }],
        chars: [{ id: 'garcom', x: 880, expr: 'happy', look: -0.6, then: [{ at: 'quase', expr: 'shocked' }] }, { id: 'ju', x: 560, expr: 'love', look: -0.6 }, { id: 'eu', x: 300, expr: 'laugh', look: 0.6, fx: 'hearts' }] },
    ],
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = STORY; else globalThis.STORY = STORY;
})();
