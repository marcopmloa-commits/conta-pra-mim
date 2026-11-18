(function () {
  const EU = { skin: '#E6B48C', hair: '#3A2A20', hairStyle: 'short', facialHair: 'stubble', outfit: 'hoodie', shirt: '#5A6A7A', bottoms: 'pants', pants: '#2C2F3A', sleeves: 'long' };
  const PAI = { skin: '#E6B48C', hair: '#9A9A9A', hairStyle: 'short', facialHair: 'mustache', outfit: 'shirt', shirt: '#8A6A4E', glasses: 'square', bottoms: 'pants', pants: '#3A3A44' };
  const MAE = { skin: '#E6B48C', hair: '#C9C1B0', hairStyle: 'bun', outfit: 'dress', shirt: '#5A3E5E' };
  const KID = { skin: '#E6B48C', hair: '#3A2A20', hairStyle: 'short', outfit: 'tee', shirt: '#E0703E', bottoms: 'shorts', shorts: '#27305C' };
  const STORY = {
    name: 'A carta do meu pai', voice: 'pt-BR-AntonioNeural', mood: 'sad', title: ['A CARTA', 'DO MEU PAI'], titleColor: '#F2B84B', endText: 'LIGA PRO SEU PAI',
    drama: ['vez.', 'foi.', 'carta.', 'amo.', 'vida.'],
    cast: { eu: EU, pai: PAI, mae: MAE, kid: KID },
    scenes: [
      { fala: 'O meu pai nunca disse que me amava. Nem uma vez.', set: 'living', light: 'dim',
        chars: [{ id: 'pai', x: 540, pose: 'sit', hold: 'book', expr: 'neutral', lookY: 0.6 }] },
      { fala: 'Ele era um homem quieto, que consertava tudo na garagem e falava pouco.', set: 'attic', light: 'dim',
        chars: [{ id: 'pai', x: 560, expr: 'determined', hold: 'box', lookY: 0.5 }], sfx: [{ at: 'consertava', type: 'tick', p: 0.5, gain: 0.4 }] },
      { fala: 'Quando eu ganhei o meu primeiro troféu na escola, ele só balançou a cabeça.', tpl: 'photo', caption: '1998',
        chars: [{ id: 'kid', x: -120, s: 0.55, expr: 'laugh' }, { id: 'pai', x: 120, s: 0.75, expr: 'neutral' }] },
      { fala: 'Quando eu passei na faculdade, ele só disse: tá bom.', set: 'living', light: 'day',
        chars: [{ id: 'eu', x: 330, expr: 'happy', hold: 'letter', look: 0.6 }, { id: 'pai', x: 760, expr: 'neutral', look: -0.6, then: [{ at: 'disse', expr: 'talk' }, { at: 'bom', expr: 'neutral' }] }] },
      { fala: 'Eu cresci achando que nunca fui o suficiente pra ele.', tpl: 'close', set: 'bedroom', light: 'night', char: { id: 'eu', expr: 'sad' } },
      { fala: 'No ano passado, ele ficou doente. E em três meses, ele se foi.', set: 'hospital', light: 'dim',
        chars: [{ id: 'pai', x: 380, pose: 'sit', blanket: true, expr: 'closed', s: 1.2 }, { id: 'eu', x: 820, expr: 'sad', look: -0.7, then: [{ at: 'foi', expr: 'cry', fx: 'tears' }] }] },
      { fala: 'Depois do enterro, minha mãe me entregou uma caixa de sapato velha.', set: 'living', light: 'dim',
        chars: [{ id: 'mae', x: 720, expr: 'sad', hold: 'box', look: -0.6 }, { id: 'eu', x: 330, expr: 'sad', look: 0.6 }] },
      { fala: 'Dentro tinha todos os meus boletins. As fotos de todas as minhas apresentações.', tpl: 'photo', caption: 'apresentação, 2001', rot: 0.04,
        chars: [{ id: 'kid', x: 0, s: 0.75, expr: 'happy', }] },
      { fala: 'O recorte do jornal com o meu nome na lista da faculdade.', tpl: 'note', text: 'LISTA DE APROVADOS\n...\nGabriel Souza  ✓', at: 'recorte', dur: 2.6 },
      { fala: 'Tudo guardado. Tudo com a data escrita na letra dele.', tpl: 'note', text: '12/03/1998\nprimeiro troféu\ndo meu filho', at: 'data', dur: 2.2 },
      { fala: 'E no fundo da caixa, tinha uma carta.', tpl: 'icon', icon: 'envelope', at: 'carta', sfx: [{ at: 'carta', type: 'paper', gain: 0.5 }] },
      { fala: 'Ele escreveu: filho, eu não sei falar, mas eu sei guardar.', tpl: 'note', text: 'Filho, eu não sei\nfalar, mas eu\nsei guardar.', at: 'filho', dur: 3 },
      { fala: 'Cada coisa nessa caixa é uma vez que eu quis dizer que te amo.', tpl: 'note', text: 'Cada coisa nessa caixa\né uma vez que eu quis\ndizer que te amo.', at: 'cada', dur: 3.6 },
      { fala: 'Eu chorei como nunca tinha chorado na vida.', tpl: 'close', set: 'living', light: 'dim', char: { id: 'eu', expr: 'cry', fx: 'tears', hold: 'letter' } },
      { fala: 'Hoje eu tenho um filho de quatro anos.', set: 'living', light: 'day',
        chars: [{ id: 'eu', x: 380, expr: 'happy', look: 0.5 }, { id: 'kid', x: 700, s: 1.0, expr: 'laugh', look: -0.6 }] },
      { fala: 'E todo dia, antes de dormir, eu digo pra ele que amo ele.', set: 'bedroom', light: 'night',
        chars: [{ id: 'kid', x: 560, pose: 'sit', s: 0.95, blanket: true, expr: 'sleep', fx: 'zzz' }, { id: 'eu', x: 860, expr: 'love', look: -0.7, fx: 'hearts' }] },
      { fala: 'Porque eu aprendi com o meu pai que o amor guardado também precisa ser dito.', tpl: 'note', bg: '#2A2420', text: 'te amo, pai.', at: 'amor', dur: 1.6, size: 90 },
    ],
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = STORY; else globalThis.STORY = STORY;
})();
