(function () {
  const EU = { skin: '#E6B48C', hair: '#3A2A20', hairStyle: 'ponytail', outfit: 'tee', shirt: '#E8718D', bottoms: 'pants', pants: '#27305C', shoes: '#F4F1EA', sleeves: 'long' };
  const LEO = { skin: '#A86E4B', hair: '#1A1414', hairStyle: 'short', facialHair: 'stubble', outfit: 'shirt', shirt: '#3D7A74', glasses: 'round', bottoms: 'pants', pants: '#2C2F3A' };
  const DONA = { skin: '#F3D2B3', hair: '#E8E4DA', hairStyle: 'bun', outfit: 'dress', shirt: '#B8452A', glasses: 'round' };
  const STORY = {
    name: 'O bilhete no copo', voice: 'pt-BR-FranciscaNeural', mood: 'warm', title: ['O BILHETE', 'NO COPO'], titleColor: '#E8718D',
    drama: ['copo.', 'lá.', 'nome.', 'ligado.'],
    cast: { eu: EU, leo: LEO, dona: DONA },
    scenes: [
      { fala: 'Todo dia, antes do trabalho, eu passava no mesmo café da esquina.', set: 'cafe', light: 'day',
        chars: [{ id: 'leo', x: 800, behind: true, expr: 'smile', look: -0.6 }, { id: 'eu', walk: [-150, 380], expr: 'happy', look: 0.6 }], sfx: [{ at: 0.4, type: 'ding', gain: 0.25 }] },
      { fala: 'E todo dia, o barista escrevia uma frase diferente no meu copo.', set: 'cafe', light: 'day', zoom: [1.2, 1.35], focus: [700, 1050],
        chars: [{ id: 'leo', x: 780, behind: true, expr: 'smile', lookY: 0.8, gesture: 'typing' }], sfx: [{ at: 'frase', type: 'scribble', gain: 0.3 }] },
      { fala: 'Bom dia, sorriso bonito. Hoje vai dar tudo certo. Você fica linda de azul.', tpl: 'note', bg: '#C9A27A', text: 'Bom dia, sorriso bonito.\nHoje vai dar tudo certo.\nVocê fica linda de azul.', at: 'bom', dur: 4, size: 58 },
      { fala: 'Eu achava aquilo um charme, mas ele era tão tímido que nunca olhava nos meus olhos.', tpl: 'close', set: 'cafe', light: 'day',
        char: { id: 'leo', behind: false, expr: 'embarrassed', look: -0.8, lookY: 0.6 } },
      { fala: 'Um dia, o meu copo veio sem frase nenhuma.', tpl: 'icon', icon: 'cup', label: 'SEM FRASE?', at: 'copo' },
      { fala: 'Eu fiquei estranhamente triste. Olhei pro balcão, e ele não estava lá.', set: 'cafe', light: 'day',
        chars: [{ id: 'eu', x: 360, expr: 'sad', hold: 'cup', look: 0.6, then: [{ at: 'balcao', expr: 'worried', look: 0.9 }] }] },
      { fala: 'No dia seguinte, também não. Nem no outro.', tpl: 'big', lines: ['DIA 2...', 'DIA 3...'], at: 'seguinte', stagger: 1.2, color: '#F4EEE0', bg: '#3A2A20' },
      { fala: 'Uma semana depois, eu criei coragem e perguntei pra dona do café.', set: 'cafe', light: 'day',
        chars: [{ id: 'dona', x: 800, behind: true, expr: 'neutral', look: -0.6 }, { id: 'eu', x: 330, expr: 'talk', look: 0.7, then: [{ at: 'dona', expr: 'worried' }] }] },
      { fala: 'Ela sorriu e me entregou um envelope com o meu nome.', tpl: 'icon', icon: 'envelope', label: 'PRA VOCÊ', at: 'envelope', sfx: [{ at: 'envelope', type: 'paper', gain: 0.5 }] },
      { fala: 'Dentro tinha todos os copos que ele não teve coragem de me entregar.', tpl: 'note', bg: '#C9A27A', text: 'Você ri alto e eu adoro.\nHoje você estava triste.\nQueria ter dito oi.', at: 'copos', dur: 3, size: 56 },
      { fala: 'E um bilhete: eu fui transferido pra outra cidade. Se um dia quiser um café de verdade, me liga.', tpl: 'note', bg: '#5B4632', text: 'Fui transferido pra\noutra cidade. Se quiser\num café de verdade,\nme liga. (11) 9...', at: 'fui', dur: 4.5, size: 54 },
      { fala: 'Eu liguei na mesma hora. Meu coração batia tão forte que eu mal conseguia falar.', tpl: 'phone', mode: 'call', caller: 'Barista ☕', who: 'leo', status: 'chamando...',
        statusAfter: { at: 'coracao', status: 'em chamada  00:04', statusColor: '#57D68D' }, sfx: [{ at: 'liguei', type: 'ring', gain: 0.35 }], heart: true },
      { fala: 'Ele atendeu e ficou em silêncio. Até que eu disse: você esqueceu de escrever no meu copo.', tpl: 'close', set: 'living', light: 'warm',
        char: { id: 'eu', gesture: 'phone', expr: 'worried', then: [{ at: 'disse', expr: 'smirk' }] } },
      { fala: 'Ele riu. Pela primeira vez, eu ouvi a risada dele.', tpl: 'close', set: 'living', light: 'night',
        char: { id: 'leo', gesture: 'phone', expr: 'laugh', fx: 'hearts' } },
      { fala: 'Três semanas depois, ele voltou pra cidade só pra me ver.', set: 'street', light: 'sunset',
        chars: [{ id: 'eu', x: 760, expr: 'love', look: -0.8 }, { id: 'leo', walk: [-150, 380, 2.5], expr: 'smile', hold: 'flower', look: 0.8 }], sfx: [{ at: 'voltou', type: 'ding', gain: 0.2 }] },
      { fala: 'Hoje, a gente tem um café juntos. E todo dia, eu ainda acho uma frase no meu copo.', set: 'cafe', light: 'day', confetti: 'hoje',
        chars: [{ id: 'leo', x: 640, behind: true, expr: 'happy', look: -0.5 }, { id: 'eu', x: 860, behind: true, expr: 'love', look: -0.6, fx: 'hearts' }] },
      { fala: 'A de hoje dizia: obrigado por ter ligado.', tpl: 'note', bg: '#C9A27A', text: 'Obrigado por\nter ligado.', at: 'obrigado', dur: 1.8, size: 84 },
    ],
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = STORY; else globalThis.STORY = STORY;
})();
