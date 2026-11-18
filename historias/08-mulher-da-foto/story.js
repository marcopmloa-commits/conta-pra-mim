(function () {
  const EU = { skin: '#F3D2B3', hair: '#C9A063', hairStyle: 'long', outfit: 'tee', shirt: '#3D7A74', bottoms: 'pants', pants: '#27305C', sleeves: 'long' };
  const MARIDO = { skin: '#C98A62', hair: '#2B211E', hairStyle: 'short', facialHair: 'trimmed', outfit: 'tee', shirt: '#8A8E96', bottoms: 'pants', pants: '#2C2F3A' };
  const DAMA = { skin: '#D9D4CC', hair: '#14111A', hairStyle: 'long', outfit: 'dress', shirt: '#14111A', shoes: '#14111A' };
  const SENHORA = { skin: '#E6B48C', hair: '#E8E4DA', hairStyle: 'bun', outfit: 'dress', shirt: '#7A5C8E', glasses: 'round' };
  const F1 = { skin: '#E6B48C', hair: '#3A2A20', hairStyle: 'short', outfit: 'suit', robe: '#3A3A44', bottoms: 'pants' };
  const F2 = { skin: '#E6B48C', hair: '#3A2A20', hairStyle: 'bun', outfit: 'dress', shirt: '#8A6A4E' };
  const STORY = {
    name: 'A mulher da foto', voice: 'pt-BR-FranciscaNeural', mood: 'dark', title: ['A MULHER', 'DA FOTO'],
    drama: ['anos.', 'câmera.', 'canto.', 'idade.', 'gelou.', 'ano.', 'lado.'],
    cast: { eu: EU, marido: MARIDO, dama: DAMA, senhora: SENHORA, f1: F1, f2: F2 },
    scenes: [
      { fala: 'A gente comprou uma casa antiga no interior, que estava fechada há anos.', set: 'living', light: 'day',
        chars: [{ id: 'marido', x: 330, hold: 'box', expr: 'happy' }, { id: 'eu', walk: [1200, 740, 2], hold: 'box', expr: 'happy', look: -0.5 }] },
      { fala: 'Arrumando o porão, eu achei um álbum de fotos da família que morava ali.', set: 'attic', light: 'dim',
        chars: [{ id: 'eu', x: 540, pose: 'floor', s: 1.4, hold: 'book', expr: 'neutral', lookY: 0.7 }] },
      { fala: 'Era uma foto de mil novecentos e cinquenta. Uma família sorrindo na frente da casa.', tpl: 'photo', caption: '1950',
        chars: [{ id: 'f1', x: -140, s: 0.7 }, { id: 'f2', x: 0, s: 0.68 }, { id: 'dama', x: 210, s: 0.62, expr: 'neutral' }] },
      { fala: 'Mas no canto da foto, tinha uma mulher de vestido preto, olhando direto pra câmera.', tpl: 'close', set: 'black', light: 'dim', hit: 'olhando', zoom: [2.0, 2.3],
        char: { id: 'dama', expr: 'neutral', s: 1.2 } },
      { fala: 'Eu virei a página. Mil novecentos e setenta. Outra família. A mesma mulher, no mesmo canto.', tpl: 'photo', caption: '1970', rot: 0.03, sfx: [{ at: 'virei', type: 'paper', gain: 0.4 }],
        chars: [{ id: 'f2', x: -150, s: 0.7, expr: 'smile' }, { id: 'f1', x: 10, s: 0.72 }, { id: 'dama', x: 210, s: 0.62, expr: 'neutral' }] },
      { fala: 'Mil novecentos e noventa. A mesma mulher. Com a mesma idade.', tpl: 'photo', caption: '1990', hit: 'idade',
        chars: [{ id: 'f1', x: -130, s: 0.72, expr: 'happy' }, { id: 'dama', x: 210, s: 0.62, expr: 'neutral' }] },
      { fala: 'Eu mostrei pro meu marido e ele riu, disse que era coincidência.', set: 'living', light: 'night',
        chars: [{ id: 'eu', x: 330, hold: 'book', expr: 'worried', look: 0.6 }, { id: 'marido', x: 760, expr: 'neutral', look: -0.6, then: [{ at: 'riu', expr: 'laugh' }] }] },
      { fala: 'Naquela noite, a gente tirou a nossa primeira foto na casa nova.', set: 'living', light: 'night', sfx: [{ at: 'foto', type: 'click', gain: 0.6 }],
        chars: [{ id: 'eu', x: 420, expr: 'happy' }, { id: 'marido', x: 680, expr: 'laugh', gesture: 'phone' }], confetti: null },
      { fala: 'Quando eu abri a foto no celular, meu sangue gelou.', tpl: 'close', set: 'bedroom', light: 'night', hit: 'gelou', heart: true,
        char: { id: 'eu', gesture: 'phone', expr: 'neutral', then: [{ at: 'gelou', expr: 'scared' }] } },
      { fala: 'No canto, perto da escada, estava ela. Olhando pra câmera.', tpl: 'photo', caption: 'hoje', sepia: false, photoBg: '#3A3456', hit: 'ela', heart: true,
        chars: [{ id: 'eu', x: -150, s: 0.7, expr: 'happy' }, { id: 'marido', x: 20, s: 0.72, expr: 'laugh' }, { id: 'dama', x: 220, s: 0.62, expr: 'neutral' }] },
      { fala: 'Eu procurei os antigos donos da casa. Achei uma senhora que morou ali nos anos noventa.', set: 'street', light: 'day',
        chars: [{ id: 'eu', x: 330, expr: 'worried', hold: 'phone', look: 0.6 }, { id: 'senhora', x: 760, expr: 'neutral', look: -0.6 }] },
      { fala: 'Ela ficou pálida quando eu mostrei a foto.', tpl: 'close', set: 'street', light: 'day', char: { id: 'senhora', expr: 'shocked' } },
      { fala: 'E disse: ela aparece em todas as fotos. Mas só pra quem vai embora logo.', tpl: 'close', set: 'street', light: 'day', char: { id: 'senhora', expr: 'talk', then: [{ at: 'embora', expr: 'scared' }] } },
      { fala: 'Todas as famílias que viram ela saíram da casa em menos de um ano.', tpl: 'big', lines: ['MENOS DE', '1 ANO'], colors: ['#F4EEE0', '#FF3B3B'], at: 'menos', stagger: 0.6 },
      { fala: 'A gente decidiu ficar. Achamos que era só uma lenda.', set: 'living', light: 'day',
        chars: [{ id: 'eu', x: 400, expr: 'determined' }, { id: 'marido', x: 680, expr: 'smile' }] },
      { fala: 'Ontem, eu olhei de novo a foto que a gente tirou naquela primeira noite.', tpl: 'close', set: 'bedroom', light: 'night', heart: true, char: { id: 'eu', gesture: 'phone', expr: 'worried' } },
      { fala: 'Ela não estava mais no canto. Agora, ela está do meu lado.', tpl: 'photo', caption: 'hoje', sepia: false, photoBg: '#3A3456', hit: 'lado', heart: true,
        chars: [{ id: 'dama', x: -260, s: 0.64, expr: 'neutral' }, { id: 'eu', x: -110, s: 0.7, expr: 'happy' }, { id: 'marido', x: 80, s: 0.72, expr: 'laugh' }] },
    ],
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = STORY; else globalThis.STORY = STORY;
})();
