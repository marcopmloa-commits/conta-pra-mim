(function () {
  const EU = { skin: '#F3D2B3', hair: '#B8452A', hairStyle: 'long', outfit: 'hoodie', shirt: '#7A9A6A', bottoms: 'pants', pants: '#3A3A44', sleeves: 'long' };
  const VO = { skin: '#F3D2B3', hair: '#E8E4DA', hairStyle: 'bun', outfit: 'dress', shirt: '#7A4E6E', glasses: 'round' };
  const VOJOVEM = { skin: '#F3D2B3', hair: '#B8452A', hairStyle: 'long', outfit: 'dress', shirt: '#3D7A74' };
  const STORY = {
    name: 'A caixa no sótão', voice: 'pt-BR-FranciscaNeural', mood: 'warm', title: ['A CAIXA', 'NO SÓTÃO'], titleColor: '#F2B84B', endText: 'PARTE 2?',
    drama: ['trancada.', 'minha.', 'mim.', 'acontecido.', 'hein.', 'nasci.', 'lacrada.', 'menina.'],
    cast: { eu: EU, vo: VO, vojovem: VOJOVEM },
    scenes: [
      { fala: 'Quando a minha avó se mudou pra um asilo, eu fui ajudar a esvaziar a casa dela.', set: 'living', light: 'day',
        chars: [{ id: 'eu', walk: [-150, 420, 2.4], expr: 'sad', hold: 'box' }] },
      { fala: 'No sótão, embaixo de um monte de cobertores, eu achei uma caixa de madeira trancada.', set: 'attic', light: 'dim', sfx: [{ at: 'caixa', type: 'thud', p: 90, gain: 0.5 }],
        chars: [{ id: 'eu', x: 540, pose: 'floor', s: 1.4, hold: 'box', expr: 'neutral', lookY: 0.7, then: [{ at: 'trancada', expr: 'worried', fx: 'question' }] }] },
      { fala: 'Ela era pesada, e tinha o meu nome escrito na tampa.', tpl: 'note', bg: '#5B4632', text: 'MARINA', at: 'nome', dur: 1.4, size: 110 },
      { fala: 'O estranho é que a letra parecia a minha.', tpl: 'close', set: 'attic', light: 'dim', char: { id: 'eu', expr: 'worried', hold: 'box' } },
      { fala: 'Eu procurei a chave pela casa inteira, e achei dentro de um livro de receitas.', tpl: 'icon', icon: 'key', label: 'A CHAVE', at: 'achei', sfx: [{ at: 'achei', type: 'ding', gain: 0.3 }] },
      { fala: 'Dentro da caixa tinha cartas. Dezenas delas. Todas endereçadas a mim.', tpl: 'icon', icon: 'envelope', label: 'PARA MARINA', at: 'cartas', sfx: [{ at: 'cartas', type: 'paper', gain: 0.5 }] },
      { fala: 'A primeira dizia: você vai encontrar isso quando a vó for embora. Não fique triste.', tpl: 'note', text: 'Você vai encontrar isso\nquando a vó for embora.\nNão fique triste.', at: 'voce', dur: 4 },
      { fala: 'Cada carta falava de algo que ia acontecer na minha vida. E tudo tinha acontecido.', tpl: 'note', text: '2015: vai mudar de cidade\n2019: vai perder o emprego\n2021: vai achar o amor', at: 'cada', dur: 3.6, size: 52 },
      { fala: 'A minha mudança, o meu primeiro emprego, até o nome do meu namorado.', tpl: 'close', set: 'attic', light: 'dim', char: { id: 'eu', expr: 'shocked', hold: 'letter' } },
      { fala: 'Eu corri pro asilo com a caixa nos braços.', set: 'street', light: 'day', chars: [{ id: 'eu', walk: [-150, 1200, 3], expr: 'determined', hold: 'box' }] },
      { fala: 'A minha avó sorriu quando me viu e disse: demorou, hein.', tpl: 'close', set: 'living', light: 'warm', char: { id: 'vo', expr: 'happy', then: [{ at: 'disse', expr: 'talk' }, { at: 'hein', expr: 'smirk' }] } },
      { fala: 'Ela me contou que, quando era jovem, tinha sonhos que se realizavam.', tpl: 'photo', caption: '1962', chars: [{ id: 'vojovem', x: 0, s: 0.85, expr: 'smile' }] },
      { fala: 'E que sonhou com a minha vida inteira na noite em que eu nasci.', set: 'bedroom', light: 'night', chars: [{ id: 'vojovem', x: 560, pose: 'sit', s: 1.25, blanket: true, expr: 'sleep', fx: 'zzz' }] },
      { fala: 'Ela escreveu tudo, pra eu nunca me sentir sozinha nas partes difíceis.', set: 'living', light: 'warm',
        chars: [{ id: 'vo', x: 680, pose: 'sit', expr: 'love', look: -0.6, fx: 'hearts' }, { id: 'eu', x: 380, expr: 'cry', fx: 'tears', look: 0.6 }] },
      { fala: 'Só que, no fundo da caixa, tinha uma última carta. Lacrada.', tpl: 'icon', icon: 'envelope', at: 'carta', label: 'LACRADA', bg: '#3A2440', bg2: '#0E0A14' },
      { fala: 'Do lado de fora, ela escreveu: só abra quando você tiver uma filha.', tpl: 'note', text: 'Só abra quando\nvocê tiver uma filha.', at: 'so', dur: 2.6 },
      { fala: 'Ontem, eu descobri que estou grávida. De uma menina.', tpl: 'icon', icon: 'heart', s: 0.9, label: 'É MENINA', labelColor: '#E8718D', at: 'menina', fx: 'hearts', sfx: [{ at: 'menina', type: 'ding', gain: 0.4 }] },
    ],
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = STORY; else globalThis.STORY = STORY;
})();
