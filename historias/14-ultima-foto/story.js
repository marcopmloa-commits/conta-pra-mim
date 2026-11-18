(function () {
  const EU = { skin: '#C98A62', hair: '#1A1414', hairStyle: 'short', facialHair: 'stubble', outfit: 'tee', shirt: '#5A6A7A', bottoms: 'pants', pants: '#2C2F3A' };
  const STORY = {
    name: 'A última foto', voice: 'pt-BR-AntonioNeural', mood: 'dark', title: ['A ÚLTIMA', 'FOTO'],
    drama: ['minha.', 'manhã.', 'porta.', 'sozinho.', 'foto.', 'celular.', 'compridas.', 'dentro.'],
    cast: { eu: EU, sombra: { kind: 'figure' } },
    scenes: [
      { fala: 'Eu sempre deixo o celular carregando na cômoda, do lado da cama.', set: 'bedroom', light: 'night',
        chars: [{ id: 'eu', x: 560, pose: 'sit', s: 1.25, blanket: true, expr: 'sleep', fx: 'zzz' }], props: [{ kind: 'phone', x: 120, y: 1260, s: 0.8 }] },
      { fala: 'Ontem de manhã, eu fui ver as fotos de um aniversário.', tpl: 'close', set: 'bedroom', light: 'day', char: { id: 'eu', gesture: 'phone', expr: 'happy' } },
      { fala: 'E a última foto da galeria não era minha.', tpl: 'close', set: 'bedroom', light: 'day', char: { id: 'eu', gesture: 'phone', expr: 'worried' } },
      { fala: 'Era uma foto de mim. Dormindo. Tirada às três e trinta e três da manhã.', set: 'bedroom', light: 'night', label: '03:33', hit: 'dormindo', zoom: [1.15, 1.2],
        chars: [{ id: 'eu', x: 560, pose: 'sit', s: 1.25, blanket: true, expr: 'sleep' }] },
      { fala: 'O ângulo era de dentro do quarto. Do lado da porta.', set: 'bedroom', light: 'night', label: '03:33', zoom: [1.3, 1.5], focus: [560, 1200], heart: true,
        chars: [{ id: 'eu', x: 560, pose: 'sit', s: 1.25, blanket: true, expr: 'sleep' }] },
      { fala: 'Eu moro sozinho.', tpl: 'big', lines: ['EU MORO', 'SOZINHO'], colors: ['#F4EEE0', '#FF3B3B'], at: 'moro', stagger: 0.4, hit: 'sozinho' },
      { fala: 'Eu chequei as portas, as janelas, tudo estava trancado.', set: 'door', light: 'day', sfx: [{ at: 'portas', type: 'click', gain: 0.4 }, { at: 'janelas', type: 'click', gain: 0.4 }],
        chars: [{ id: 'eu', x: 700, expr: 'worried', look: -0.7 }] },
      { fala: 'Achei que era algum aplicativo com defeito. Apaguei a foto e tentei esquecer.', tpl: 'close', set: 'living', light: 'day', char: { id: 'eu', gesture: 'phone', expr: 'worried' } },
      { fala: 'Hoje de manhã, tinha outra foto.', tpl: 'phone', mode: 'lock', time: '07:02', app: 'Galeria', text: 'Nova foto adicionada', at: 'outra', buzz: 'outra', sfx: [{ at: 'outra', type: 'buzz' }], heart: true },
      { fala: 'Mais perto. Do lado da cama. Às três e trinta e três.', set: 'bedroom', light: 'night', label: '03:33', zoom: [1.7, 1.9], focus: [560, 1150], heart: true,
        chars: [{ id: 'eu', x: 560, pose: 'sit', s: 1.25, blanket: true, expr: 'sleep' }] },
      { fala: 'E dessa vez, dava pra ver uma mão segurando o celular.', set: 'bedroom', light: 'night', label: '03:33', zoom: [1.7, 1.75], focus: [560, 1150], hit: 'mao',
        chars: [{ id: 'eu', x: 560, pose: 'sit', s: 1.25, blanket: true, expr: 'sleep' }, { id: 'sombra', x: 1080, y: 2100, s: 1.6, reach: true, lean: -0.3, appear: 'mao' }] },
      { fala: 'Uma mão magra, cinza, com as unhas compridas.', tpl: 'close', set: 'bedroom', light: 'night', heart: true, char: { id: 'sombra', x: 600, y: 1700, s: 1.5, reach: true, lean: -0.2 } },
      { fala: 'Eu não dormi em casa. Fui pra casa de um amigo.', set: 'street', light: 'night', chars: [{ id: 'eu', walk: [1250, -150, 4], expr: 'scared', look: -0.5 }] },
      { fala: 'Deixei o celular lá, na cômoda, de propósito.', set: 'bedroom', light: 'night', props: [{ kind: 'phone', x: 120, y: 1260, s: 1 }], zoom: [1.2, 1.4], focus: [200, 1200], chars: [] },
      { fala: 'Agora são três e trinta e dois. Eu tô olhando a galeria pelo computador.', tpl: 'clock', from: '3:31', to: '3:32', at: 'tres', heart: true },
      { fala: 'E acabou de aparecer uma foto nova.', tpl: 'phone', mode: 'lock', time: '03:33', app: 'Galeria', text: 'Nova foto adicionada', at: 'foto', buzz: 'foto', sfx: [{ at: 'foto', type: 'buzz' }], heart: true },
      { fala: 'É uma foto da porta da casa do meu amigo. Tirada de dentro.', set: 'door', light: 'night', label: '03:33', hit: 'dentro', heart: true,
        chars: [{ id: 'sombra', x: 540, y: 1560, s: 1.25, appear: 'dentro' }] },
    ],
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = STORY; else globalThis.STORY = STORY;
})();
