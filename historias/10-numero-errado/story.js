(function () {
  const EU = { skin: '#8D5A3B', hair: '#1A1414', hairStyle: 'curly', outfit: 'tee', shirt: '#F2B84B', bottoms: 'pants', pants: '#3D5A8A', sleeves: 'long' };
  const RAFA = { skin: '#E6B48C', hair: '#5A3A22', hairStyle: 'quiff', outfit: 'hoodie', shirt: '#3D7A74', bottoms: 'pants', pants: '#2C2F3A', sleeves: 'long' };
  const MAE = { skin: '#E6B48C', hair: '#9A9A9A', hairStyle: 'bun', outfit: 'dress', shirt: '#E8718D', glasses: 'round' };
  const KIDEU = { skin: '#8D5A3B', hair: '#1A1414', hairStyle: 'ponytail', outfit: 'tee', shirt: '#FFFFFF', bottoms: 'skirt', shorts: '#27305C' };
  const KIDRAFA = { skin: '#E6B48C', hair: '#5A3A22', hairStyle: 'quiff', outfit: 'tee', shirt: '#FFFFFF', bottoms: 'shorts', shorts: '#27305C' };
  const STORY = {
    name: 'O número errado', voice: 'pt-BR-FranciscaNeural', mood: 'warm', title: ['O NÚMERO', 'ERRADO'], titleColor: '#E8718D',
    drama: ['desconhecido.', 'hora.', 'você.', 'junto.', 'vida.'],
    cast: { eu: EU, rafa: RAFA, mae: MAE, kideu: KIDEU, kidrafa: KIDRAFA },
    scenes: [
      { fala: 'Era uma madrugada de domingo quando eu recebi uma mensagem de um número desconhecido.', tpl: 'phone', mode: 'lock', time: '02:14', app: 'Número desconhecido', text: 'Oi mãe, cheguei bem!', at: 'mensagem', sfx: [{ at: 'mensagem', type: 'buzz' }] },
      { fala: 'Oi, mãe, cheguei bem. O ônibus atrasou, mas tá tudo certo.', tpl: 'phone', title: '+55 11 9...', msgs: [{ text: 'Oi mãe, cheguei bem!', at: 'oi' }, { text: 'O ônibus atrasou, mas tá tudo certo.', at: 'onibus' }] },
      { fala: 'Eu respondi: acho que você errou o número, mas que bom que chegou bem.', tpl: 'phone', title: '+55 11 9...',
        msgs: [{ text: 'Oi mãe, cheguei bem!', at: 0 }, { text: 'O ônibus atrasou, mas tá tudo certo.', at: 0 }, { me: true, text: 'Acho que você errou o número, mas que bom que chegou bem :)', at: 'acho' }] },
      { fala: 'Ele pediu desculpa e mandou uma foto do pôr do sol da cidade nova.', set: 'park', light: 'sunset', zoom: [1, 1.1], chars: [] },
      { fala: 'A gente começou a conversar. Sobre a cidade, sobre música, sobre tudo.', set: 'bedroom', light: 'night',
        chars: [{ id: 'eu', x: 560, pose: 'sit', s: 1.25, blanket: true, gesture: 'phone', expr: 'happy', then: [{ at: 'musica', expr: 'laugh', fx: 'music' }] }] },
      { fala: 'Todo dia de manhã, chegava um bom dia. E toda noite, um boa noite.', tpl: 'phone', mode: 'lock', time: '07:00', app: 'Desconhecido', text: 'Bom dia, desconhecida :)', at: 'bom' },
      { fala: 'Seis meses depois, a gente ainda não sabia como era o rosto um do outro.', tpl: 'big', lines: ['6 MESES', 'SEM FOTO'], colors: ['#F4EEE0', '#E8718D'], at: 'seis', stagger: 0.9, bg: '#27305C' },
      { fala: 'Até que ele disse que ia voltar pra minha cidade no Natal.', tpl: 'phone', title: 'Desconhecido', msgs: [{ text: 'Vou passar o Natal aí. Um café?', at: 'voltar' }, { me: true, text: 'Simmm!', at: 'natal' }] },
      { fala: 'A gente marcou num café. Eu cheguei meia hora antes, tremendo.', set: 'cafe', light: 'day',
        chars: [{ id: 'eu', x: 360, expr: 'embarrassed', hold: 'cup', look: 0.4 }] },
      { fala: 'Ele entrou. E eu reconheci na hora.', set: 'cafe', light: 'day', sfx: [{ at: 'entrou', type: 'ding', gain: 0.3 }],
        chars: [{ id: 'eu', x: 360, expr: 'neutral', look: 0.6, then: [{ at: 'reconheci', expr: 'shocked' }] }, { id: 'rafa', walk: [1250, 760, 1.6], expr: 'smile', look: -0.6 }] },
      { fala: 'Era o menino que sentava atrás de mim na escola. O que eu gostava escondido há anos.', tpl: 'photo', caption: 'escola, 2009',
        chars: [{ id: 'kideu', x: -110, s: 0.7, expr: 'smile' }, { id: 'kidrafa', x: 110, s: 0.72, expr: 'embarrassed' }] },
      { fala: 'Ele também me reconheceu. E disse: eu nunca tive coragem de falar com você.', tpl: 'close', set: 'cafe', light: 'day', char: { id: 'rafa', expr: 'embarrassed', then: [{ at: 'disse', expr: 'talk' }, { at: 'voce', expr: 'love' }] } },
      { fala: 'Foi preciso errar um número pra gente se encontrar de novo.', tpl: 'close', set: 'cafe', light: 'day', char: { id: 'eu', expr: 'love', fx: 'hearts' } },
      { fala: 'Hoje, a gente mora junto.', set: 'living', light: 'warm',
        chars: [{ id: 'eu', x: 420, pose: 'sit', expr: 'love', look: 0.6 }, { id: 'rafa', x: 660, pose: 'sit', expr: 'happy', look: -0.6, fx: 'hearts' }] },
      { fala: 'E a mãe dele ainda pergunta, rindo, quem foi que recebeu a mensagem dela.', set: 'living', light: 'day',
        chars: [{ id: 'mae', x: 540, expr: 'laugh' }, { id: 'eu', x: 260, expr: 'laugh', look: 0.6 }, { id: 'rafa', x: 830, expr: 'laugh', look: -0.6 }] },
      { fala: 'E eu respondo: fui eu. A melhor mensagem errada da minha vida.', tpl: 'icon', icon: 'heart', s: 0.9, label: 'FUI EU', labelColor: '#E8718D', at: 'fui', fx: 'hearts' },
    ],
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = STORY; else globalThis.STORY = STORY;
})();
