(function () {
  const EU = { skin: '#C98A62', hair: '#2B211E', hairStyle: 'quiff', outfit: 'shirt', shirt: '#9CC1FF', bottoms: 'pants', pants: '#2C2F3A' };
  const CHEFE = { skin: '#F3D2B3', hair: '#9A9A9A', hairStyle: 'short', facialHair: 'mustache', outfit: 'suit', robe: '#2C2F3A', trim: '#B01E1E', glasses: 'square', bottoms: 'pants' };
  const AMIGO = { skin: '#8D5A3B', hair: '#1A1414', hairStyle: 'buzz', outfit: 'tee', shirt: '#F2B84B', bottoms: 'pants', pants: '#3A3A44' };
  const STORY = {
    name: 'O áudio errado', voice: 'pt-BR-AntonioNeural', mood: 'fun', title: ['O ÁUDIO', 'ERRADO'], titleColor: '#F2B84B',
    drama: ['empresa.', 'pinguim.', 'disse:', 'mesmo.'],
    cast: { eu: EU, chefe: CHEFE, amigo: AMIGO },
    scenes: [
      { fala: 'Sexta-feira, seis da tarde, o meu chefe me mandou mais um trabalho pra fazer no fim de semana.', set: 'office', light: 'sunset',
        chars: [{ id: 'eu', x: 330, expr: 'neutral', gesture: 'phone', then: [{ at: 'trabalho', expr: 'angry', fx: 'anger' }] }], sfx: [{ at: 'mandou', type: 'buzz' }] },
      { fala: 'Eu fiquei tão bravo que gravei um áudio pro meu melhor amigo reclamando dele.', tpl: 'close', set: 'office', light: 'sunset',
        char: { id: 'eu', gesture: 'mic', expr: 'angry', fx: 'anger', then: [{ at: 'gravei', expr: 'talk' }] } },
      { fala: 'Falei que ele era chato, que tinha bafo de café e que parecia um pinguim de terno.', tpl: 'big', lines: ['CHATO', 'BAFO DE CAFÉ', 'PINGUIM'], colors: ['#F4EEE0', '#C9A27A', '#9CC1FF'], at: 'chato', stagger: 1.5, size: 120, bg: '#27305C',
        sfx: [{ at: 'chato', type: 'thud', gain: 0.4 }, { at: 'bafo', type: 'thud', gain: 0.4 }, { at: 'pinguim', type: 'thud', gain: 0.4 }] },
      { fala: 'Mandei o áudio, guardei o celular e fui embora feliz da vida.', set: 'street', light: 'sunset',
        chars: [{ id: 'eu', walk: [-150, 700, 3.4], expr: 'happy', fx: 'music' }] },
      { fala: 'Dez minutos depois, o celular vibrou. Uma mensagem do meu chefe.', tpl: 'phone', mode: 'lock', time: '18:12', app: 'Chefe', text: 'Recebi seu áudio.', at: 'mensagem', buzz: 'vibrou', sfx: [{ at: 'vibrou', type: 'buzz' }] },
      { fala: 'Recebi seu áudio.', tpl: 'phone', title: 'Chefe', msgs: [{ text: 'Recebi seu áudio.', at: 'recebi' }], bg: '#1A0B0E' },
      { fala: 'Eu gelei. Tinha mandado o áudio pro grupo errado. O grupo da empresa.', tpl: 'close', set: 'street', light: 'sunset', hit: 'empresa',
        char: { id: 'eu', gesture: 'phone', expr: 'shocked', then: [{ at: 'empresa', expr: 'scared' }] } },
      { fala: 'Com quarenta pessoas. Incluindo o próprio pinguim.', tpl: 'big', lines: ['40 PESSOAS', 'E O PINGUIM'], colors: ['#F4EEE0', '#9CC1FF'], at: 'quarenta', stagger: 1.4, bg: '#3A1018' },
      { fala: 'Eu passei o fim de semana inteiro pensando em mudar de país.', set: 'bedroom', light: 'night',
        chars: [{ id: 'eu', x: 560, pose: 'sit', s: 1.25, blanket: true, expr: 'worried', fx: 'question' }] },
      { fala: 'Na segunda-feira, eu entrei no escritório olhando pro chão.', set: 'office', light: 'day',
        chars: [{ id: 'amigo', x: 860, expr: 'shocked', look: -0.8 }, { id: 'eu', walk: [-150, 380, 3], expr: 'sad', lookY: 1 }] },
      { fala: 'Todo mundo ficou em silêncio. E o chefe me chamou na sala dele.', set: 'office', light: 'day',
        chars: [{ id: 'amigo', x: 860, expr: 'worried', look: -0.8 }, { id: 'eu', x: 380, expr: 'worried', look: 0.5 }, { id: 'chefe', x: 620, appear: 'chefe', expr: 'determined', gesture: 'point', look: -0.6 }] },
      { fala: 'Ele fechou a porta, sentou, me olhou bem sério e disse:', tpl: 'close', set: 'office', light: 'day', sfx: [{ at: 'porta', type: 'thud', gain: 0.6 }],
        char: { id: 'chefe', expr: 'determined', look: 0 } },
      { fala: 'Eu tenho bafo de café mesmo.', tpl: 'close', set: 'office', light: 'day', char: { id: 'chefe', expr: 'talk', then: [{ at: 'mesmo', expr: 'smirk' }] } },
      { fala: 'E aí ele começou a rir. Rir tanto que ficou vermelho.', tpl: 'close', set: 'office', light: 'day', char: { id: 'chefe', expr: 'laugh', then: [{ at: 'vermelho', expr: 'laugh', fx: 'music' }] }, extra: [] },
      { fala: 'Ele disse que foi o áudio mais sincero que ele recebeu em vinte anos.', set: 'office', light: 'day',
        chars: [{ id: 'chefe', x: 700, expr: 'laugh', look: -0.6 }, { id: 'eu', x: 330, expr: 'embarrassed', look: 0.6 }] },
      { fala: 'E que, a partir daquele dia, sexta-feira ia ser dia de folga pra equipe toda.', tpl: 'icon', icon: 'trophy', label: 'SEXTOU!', at: 'sexta-feira', fx: 'confetti', sfx: [{ at: 'sexta-feira', type: 'ding', gain: 0.4 }] },
      { fala: 'Hoje, todo mundo no escritório me chama de pinguim. E eu nunca mais mandei áudio sem conferir o grupo.', set: 'office', light: 'day',
        chars: [{ id: 'amigo', x: 820, expr: 'laugh', look: -0.7 }, { id: 'eu', x: 360, expr: 'embarrassed', gesture: 'phone', then: [{ at: 'nunca', expr: 'laugh' }] }] },
    ],
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = STORY; else globalThis.STORY = STORY;
})();
