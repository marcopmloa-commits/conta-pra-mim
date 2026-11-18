// "A corrida das 4h"
(function () {
  const U = globalThis.U, G = globalThis.G, Ch = globalThis.Ch, S = globalThis.SCORE, L = globalThis.L;
  const prog = L.prog;
  const { clamp, lerp, ease, pulse } = U;
  const { ev, cuts } = S;
  const W = G.W, H = G.H, SAFE = S.SAFE, FLOOR = L.FLOOR;
  const HER = { skin: Ch.SKIN_TONES[3], hair: '#1A1414', hairStyle: 'curly', outfit: 'dress', shirt: '#B8452A', shoes: '#1A1414', sleeves: 'none' };
  const DRIVER = { skin: Ch.SKIN_TONES[2], hair: '#3A3A3A', hairStyle: 'short', facialHair: 'trimmed', outfit: 'shirt', shirt: '#4A5A6E' };
  const APPGUY = { skin: Ch.SKIN_TONES[0], hair: '#C9A063', hairStyle: 'quiff', outfit: 'tee', shirt: '#3D7A74' };
  const COP = { skin: Ch.SKIN_TONES[4], hair: '#1A1414', hairStyle: 'buzz', outfit: 'suit', robe: '#1E2A44', trim: '#1E2A44', bottoms: 'pants', headwear: 'cap', headwearColor: '#1E2A44' };
  globalThis.CAST = { ela: HER, motorista: DRIVER, foto: APPGUY, policial: COP };
  const her = L.person(HER, 1.55, 640), cop = L.person(COP, 1.5, 660);

  function street(ctx, t, o = {}) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#05071A'); g.addColorStop(1, '#1B1F3A');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let k = 0; k < 4; k++) { const bx = -100 + k * 320, bh = 600 + U.hash(k, 5) * 500; G.rrect(ctx, bx, 1300 - bh, 300, bh, 4, { fill: '#151A30', lw: 5, seed: 700 + k }); for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) { ctx.fillStyle = U.hash(k, r, c) > 0.75 ? '#F2C66B' : '#0E1124'; ctx.fillRect(bx + 30 + c * 90, 1300 - bh + 40 + r * 110, 50, 60); } }
    G.rrect(ctx, -50, 1300, W + 100, 100, 0, { fill: '#5A5A66', lw: 5, seed: 710 });
    G.rrect(ctx, -50, 1400, W + 100, 600, 0, { fill: '#26262E', lw: 5, seed: 711 });
    for (let k = 0; k < 6; k++) { const x = ((k * 260 - (o.scroll || 0)) % (W + 260) + W + 260) % (W + 260) - 130; ctx.fillStyle = '#D8D0A0'; ctx.fillRect(x, 1640, 140, 14); }
    G.line(ctx, [[880, 1300], [880, 600]], { lw: 10, color: '#3A3A44', seed: 712 }); G.ellipse(ctx, 840, 600, 50, 18, { fill: '#FFE7A6', lw: 4, seed: 713 }); L.glow(ctx, 840, 700, 500, 'rgba(255,220,140,0.35)');
  }
  function car(ctx, x, y, s, o = {}) { // side view, silver sedan, facing right
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    G.poly(ctx, [[-330, -60], [-300, -150], [-170, -160], [-90, -250], [140, -250], [220, -160], [330, -140], [350, -60], [330, 0], [-330, 0]], { fill: '#AEB4BE', lw: 6, seed: 720, hatch: { color: 'rgba(255,255,255,0.15)', gap: 9 } });
    G.poly(ctx, [[-70, -235], [40, -235], [40, -165], [-150, -165]], { fill: '#1E2236', lw: 5, seed: 721 });
    G.poly(ctx, [[60, -235], [130, -235], [195, -165], [60, -165]], { fill: '#1E2236', lw: 5, seed: 722 });
    if (o.driver) { ctx.fillStyle = '#0A0A10'; ctx.beginPath(); ctx.ellipse(110, -195, 26, 30, 0, 0, Math.PI * 2); ctx.fill(); }
    for (const wx of [-200, 210]) { G.ellipse(ctx, wx, 0, 66, 66, { fill: '#1A1A20', lw: 5, seed: 723 + wx }); G.ellipse(ctx, wx, 0, 30, 30, { fill: '#8A8E96', lw: 4, seed: 724 + wx }); }
    G.ellipse(ctx, 335, -95, 22, 14, { fill: '#FFF2B0', lw: 3, seed: 725 }); ctx.restore();
    L.glow(ctx, x + 380 * s, y - 95 * s, 260 * s, 'rgba(255,240,170,0.5)');
  }
  // inside the car, from the dashboard looking back: two front headrests, the back seat, side windows
  function interior(ctx, t, o = {}) {
    ctx.fillStyle = '#14141C'; ctx.fillRect(0, 0, W, H);
    G.poly(ctx, [[0, 300], [W, 300], [W, 1100], [0, 1100]], { fill: '#0B0E1E', lw: 5, seed: 730 });
    const sp = o.speed || 1;
    for (let k = 0; k < 4; k++) { const p = ((t * 0.5 * sp + k / 4) % 1); const x = lerp(-300, W + 300, p); L.glow(ctx, x, 600, 260, 'rgba(255,200,120,0.4)'); }
    G.rrect(ctx, 60, 300, W - 120, 800, 30, { fill: 'rgba(0,0,0,0)', lw: 12, seed: 731 });
    G.line(ctx, [[W / 2, 300], [W / 2, 1100]], { lw: 30, color: '#2A2A34', seed: 732 });
    G.rrect(ctx, 0, 1000, W, 900, 60, { fill: '#3A3440', lw: 6, seed: 733, hatch: { color: 'rgba(0,0,0,0.25)', gap: 10 } });
    if (o.inside) o.inside(ctx);
    for (const sd of [-1, 1]) G.rrect(ctx, W / 2 + sd * 300 - 150, 1480, 300, 500, 70, { fill: '#2A2630', lw: 6, seed: 734 + sd, hatch: { color: 'rgba(0,0,0,0.3)', gap: 9 } });
    if (o.driverHead) { G.ellipse(ctx, W / 2 - 300, 1400, 85, 100, { fill: DRIVER.hair, lw: 6, seed: 736 }); }
    for (const sd of [-1, 1]) G.rrect(ctx, W / 2 + sd * 300 - 100, 1400, 200, 140, 40, { fill: '#332E38', lw: 6, seed: 737 + sd });
  }
  function phoneBig(ctx, t, screen, o = {}) {
    ctx.fillStyle = o.bg || '#0B0D16'; ctx.fillRect(0, 0, W, H);
    const pw = 700, ph = 1300, px = W / 2 - pw / 2 - 30, py = 300;
    G.rrect(ctx, px - 24, py - 24, pw + 48, ph + 48, 70, { fill: '#18181F', lw: 6, seed: 740 });
    ctx.save(); ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip(); ctx.fillStyle = '#F2F2F4'; ctx.fillRect(px, py, pw, ph); ctx.translate(px, py); screen(ctx, pw, ph); ctx.restore();
    L.glow(ctx, W / 2, 900, 900, 'rgba(160,180,255,0.25)');
  }
  function map(ctx, w, h, t, wrong) {
    ctx.fillStyle = '#E8E6DF'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 34; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(0, 150 + k * 220); ctx.lineTo(w, 100 + k * 220); ctx.stroke(); ctx.beginPath(); ctx.moveTo(80 + k * 130, 0); ctx.lineTo(120 + k * 130, h); ctx.stroke(); }
    ctx.strokeStyle = '#3D7AF0'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(200, 1100); ctx.lineTo(210, 600); ctx.lineTo(520, 420); ctx.stroke();
    G.ellipse(ctx, 520, 420, 26, 26, { fill: '#3D7AF0', lw: 4, seed: 750 }); G.text(ctx, 'CASA', 520, 380, { size: 34, fam: 'Bungee', color: '#3D7AF0', align: 'center' });
    const k = wrong ? clamp(wrong) : 0;
    const cx = lerp(205, 210, 0), cy = lerp(1050, 760, clamp(t)), dx = lerp(0, -170, k), dy = lerp(0, 220, k);
    if (k > 0) { ctx.strokeStyle = '#E53935'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(210, 760); ctx.lineTo(210 + dx, 760 + dy * 0 - 0); ctx.lineTo(40, 900); ctx.stroke(); }
    G.rrect(ctx, (k > 0 ? lerp(210, 40, k) : cx) - 26, (k > 0 ? lerp(760, 900, k) : cy) - 18, 52, 36, 8, { fill: '#AEB4BE', lw: 4, seed: 751 });
  }

  const SCENES = [
    (ctx, t, u) => { // 0 4 a.m., requesting a ride
      phoneBig(ctx, t, (c, w, h) => { map(c, w, h, 0, 0); G.rrect(c, 30, h - 300, w - 60, 250, 30, { fill: '#FFFFFF', lw: 4, seed: 760 }); G.text(c, 'Procurando motorista' + '.'.repeat(1 + Math.floor(t * 2) % 3), 70, h - 190, { size: 40, fam: 'Inter', weight: 700, color: '#222' }); G.text(c, '04:00', 70, h - 120, { size: 36, fam: 'Inter', weight: 400, color: '#666' }); });
      const ti = prog(t, t - u, 0.4) * (1 - clamp((u - 3.6) / 0.5));
      if (ti > 0) G.decor(() => { G.text(ctx, 'A CORRIDA', W / 2 - 50, SAFE.y + 20, { size: 110, fam: 'Bungee', color: '#F4EEE0', align: 'center', alpha: ti, stroke: '#000', strokeW: 10 }); G.text(ctx, 'DAS 4H', W / 2 - 50, SAFE.y + 140, { size: 110, fam: 'Bungee', color: '#FF3B3B', align: 'center', alpha: ti, stroke: '#000', strokeW: 10 }); });
    },
    (ctx, t, u) => { // 1 the silver sedan arrives
      street(ctx, t);
      her(ctx, { x: 860, y: 1320, s: 1.2, gesture: 'phone', look: -0.8, mouth: 'flat' });
      const x = lerp(-500, 380, ease.outCubic(prog(t, t - u, 2.2)));
      car(ctx, x, 1560, 1.25, { driver: true });
      L.light(ctx, 840, 700, 1700, '#E8E4D8', '#1A1C34');
    },
    (ctx, t, u) => { // 2 in the back seat, on her phone
      interior(ctx, t, { driverHead: true, inside: (c) => her(c, { x: W / 2 + 120, y: 1500, pose: 'sit', s: 1.3, gesture: 'phone', lookY: 0.6, mouth: 'flat', shadow: false }) });
      L.light(ctx, W / 2, 600, 1600, '#E8E0F0', '#1C1A2A');
    },
    (ctx, t, u) => { // 3 the wrong way
      phoneBig(ctx, t, (c, w, h) => map(c, w, h, 1, (t - ev.wrong + 0.3) / 1.2));
    },
    (ctx, t, u) => { // 4 "my house is the other way" — he speeds up
      const sp = t > ev.accel ? 3 : 1;
      const [sx, sy] = t > ev.accel ? L.shake(t, 5, 25) : [0, 0];
      ctx.save(); ctx.translate(sx, sy);
      interior(ctx, t, { driverHead: true, speed: sp, inside: (c) => her(c, { x: W / 2 + 60, y: 1480, pose: 'sit', s: 1.35, handR: [120, -250], mouth: t < ev.accel ? (Math.sin(t * 14) > 0 ? 'open' : 'flat') : 'o', brows: 'worried', eyes: t > ev.accel ? 'wide' : 'normal', look: -0.6, shadow: false }) });
      ctx.restore();
      L.light(ctx, W / 2, 600, 1600, '#E8E0F0', '#1C1A2A');
    },
    (ctx, t, u) => { // 5 share my location
      phoneBig(ctx, t, (c, w, h) => { map(c, w, h, 1, 1); G.rrect(c, 60, h - 280, w - 120, 150, 75, { fill: '#3DBB6A', lw: 4, seed: 770 }); G.text(c, 'Compartilhar localização', w / 2, h - 190, { size: 38, fam: 'Inter', weight: 700, color: '#fff', align: 'center' }); }, { bg: '#1A0B0E' });
      if (u > 0.6 && u < 1.1) G.ellipse(ctx, W / 2, 1450, 60 * (u - 0.6) * 4, 60 * (u - 0.6) * 4, { fill: 'rgba(255,255,255,0.4)', lw: 3, seed: 771 });
    },
    (ctx, t, u) => { // 6 the photo in the app is someone else
      phoneBig(ctx, t, (c, w, h) => {
        c.fillStyle = '#F2F2F4'; c.fillRect(0, 0, w, h);
        G.text(c, 'Seu motorista', w / 2, 120, { size: 44, fam: 'Inter', weight: 700, color: '#222', align: 'center' });
        G.ellipse(c, w / 2, 420, 220, 220, { fill: '#DDE6F0', lw: 5, seed: 780 });
        c.save(); c.beginPath(); c.arc(w / 2, 420, 215, 0, Math.PI * 2); c.clip(); Ch.person(c, { x: w / 2, y: 900, s: 1.3, pose: 'stand', style: APPGUY, mouth: 'smile', shadow: false, seed: 680 }); c.restore();
        G.text(c, 'Carlos  ★ 4.9', w / 2, 720, { size: 48, fam: 'Inter', weight: 700, color: '#222', align: 'center' });
      });
      const k = prog(t, t - (t - ev.photo - 0.4), 0.5);
      if (k > 0) { G.rrect(ctx, 600, 1180, 380, 380, 30, { fill: '#0B0D16', lw: 6, seed: 781 }); ctx.save(); ctx.beginPath(); ctx.rect(620, 1200, 340, 340); ctx.clip(); Ch.person(ctx, { x: 790, y: 1900, s: 1.4, pose: 'stand', style: DRIVER, mouth: 'flat', eyes: 'normal', brows: 'determined', shadow: false, seed: 670 }); ctx.restore(); G.text(ctx, 'NO VOLANTE', 790, 1610, { size: 40, fam: 'Bungee', color: '#FF3B3B', align: 'center' }); }
    },
    (ctx, t, u) => { // 7 the plate is different too
      ctx.fillStyle = '#0B0D16'; ctx.fillRect(0, 0, W, H);
      const plate = (y, txt, label, col) => { G.text(ctx, label, W / 2, y - 100, { size: 46, fam: 'Bungee', color: col, align: 'center' }); G.rrect(ctx, 170, y - 70, 740, 200, 20, { fill: '#F4F4F0', lw: 8, seed: y }); G.rrect(ctx, 170, y - 70, 740, 46, 10, { fill: '#2A4FA8', lw: 0, seed: y + 1 }); G.text(ctx, txt, W / 2, y + 110, { size: 110, fam: 'Bungee', color: '#1A1A1A', align: 'center' }); };
      plate(700, 'BRA-2E19', 'NO APLICATIVO', '#9CC1FF');
      if (u > 0.9) { plate(1250, 'QHT-7A04', 'NO CARRO', '#FF3B3B'); }
    },
    (ctx, t, u) => { // 8 hand on the door handle
      ctx.fillStyle = '#2A2630'; ctx.fillRect(0, 0, W, H);
      G.hatch(ctx, [0, 0, W, H], { color: 'rgba(0,0,0,0.3)', gap: 10 });
      G.rrect(ctx, 260, 700, 560, 220, 60, { fill: '#8A8E96', lw: 6, seed: 790 });
      const pull = prog(t, t - (u - 0.6), 1) * 30;
      const [sx, sy] = L.shake(t, 4, 14);
      G.limb(ctx, [[-100, 1500], [300, 1100], [520 + sx, 860 + pull + sy]], { color: HER.skin, lw: 100 });
      G.ellipse(ctx, 540 + sx, 830 + pull + sy, 110, 80, { fill: HER.skin, lw: 6, seed: 791 });
      L.light(ctx, 540, 800, 1300, '#D8D0E0', '#141220');
    },
    (ctx, t, u) => { // 9 the eyes in the rear-view mirror
      ctx.fillStyle = '#0B0D16'; ctx.fillRect(0, 0, W, H);
      G.line(ctx, [[W / 2, 0], [W / 2, 560]], { lw: 30, color: '#222', seed: 800 });
      G.rrect(ctx, 80, 560, 920, 400, 60, { fill: '#1A1A20', lw: 10, seed: 801 });
      ctx.save(); ctx.beginPath(); ctx.rect(110, 590, 860, 340); ctx.clip();
      ctx.fillStyle = '#2C2A30'; ctx.fillRect(110, 590, 860, 340);
      Ch.person(ctx, { x: W / 2, y: 2200, s: 3.4, pose: 'stand', style: DRIVER, eyes: 'normal', look: 0.3, lookY: 0.2, brows: 'worried', mouth: 'flat', shadow: false, seed: 670 });
      ctx.restore();
      G.text(ctx, 'não olhe pro lado.', W / 2 - 20, 1250, { size: 70, fam: 'Gochi Hand', weight: 400, color: '#F4EEE0', align: 'center', alpha: prog(t, t - (t - ev.dontLook), 0.5) });
      G.text(ctx, 'fica calma.', W / 2 - 20, 1350, { size: 70, fam: 'Gochi Hand', weight: 400, color: '#F4EEE0', align: 'center', alpha: prog(t, t - (t - ev.dontLook - 1.4), 0.5) });
    },
    (ctx, t, u) => { // 10 a man sitting beside her
      const on = t >= ev.man;
      interior(ctx, t, { driverHead: true, inside: (c) => {
        if (on) { L.glow(c, W / 2 - 180, 1050, 420, 'rgba(170,190,255,0.45)'); c.save(); c.beginPath(); c.rect(0, 0, W, 1300); c.clip(); L.figure(c, W / 2 - 180, 1900, 1.25, 1, { eyes: 1 }); c.restore(); }
        her(c, { x: W / 2 + 200, y: 1500, pose: 'sit', s: 1.3, eyes: 'wide', brows: 'worried', mouth: 'o', sweat: 1, look: 0.4, shadow: false, blink: 0 });
      } });
      L.light(ctx, W / 2, 600, 1600, '#E8E0F0', '#1C1A2A');
      if (on) { L.glitch(ctx, Math.exp(-(t - ev.man) * 3) * 1.2, t); L.flash(ctx, t, ev.man, 8, 0.85); }
    },
    (ctx, t, u) => { // 11 the police station: "RUN!"
      street(ctx, t);
      G.rrect(ctx, 80, 560, 700, 740, 6, { fill: '#D8D4CC', lw: 6, seed: 810 });
      G.rrect(ctx, 120, 600, 620, 110, 10, { fill: '#1E2A44', lw: 5, seed: 811 }); G.text(ctx, 'DELEGACIA', 430, 680, { size: 64, fam: 'Bungee', color: '#F4EEE0', align: 'center' });
      L.door(ctx, 320, 900, 220, 400);
      const blue = Math.floor(t * 3) % 2; L.glow(ctx, 430, 560, 400, blue ? 'rgba(60,120,255,0.6)' : 'rgba(255,40,40,0.5)');
      const [sx, sy] = L.shake(t, t > ev.run ? 8 : 0, 30);
      car(ctx, 520 + sx, 1600 + sy, 1.25, { driver: true });
      if (t > ev.run - 0.1) G.text(ctx, 'CORRE!', W / 2 - 40, SAFE.y + 120, { size: 150, fam: 'Bungee', color: '#FF3B3B', align: 'center', stroke: '#000', strokeW: 12 });
      L.light(ctx, 430, 700, 1700, '#E8E4D8', '#1A1C34');
    },
    (ctx, t, u) => { // 12 she runs without looking back
      street(ctx, t, { scroll: u * 900 });
      const wk = Ch.walk(u, { x0: 1150, speed: -420, s: 1.5 });
      her(ctx, { x: wk.x, y: 1480, s: 1.5, pose: 'walk', walk: wk.walk * 1.6, eyes: 'wide', brows: 'worried', mouth: 'o', sweat: 1, look: -1 });
      L.light(ctx, 840, 700, 1700, '#E8E4D8', '#1A1C34');
    },
    (ctx, t, u) => { // 13 back on the street: the car is gone
      street(ctx, t);
      cop(ctx, { x: 300, y: 1480, look: 0.6, mouth: 'flat', gesture: 'point' });
      her(ctx, { x: 640, y: 1480, s: 1.45, look: 0.6, eyes: 'wide', brows: 'worried', mouth: 'flat', handL: [-60, -250] });
      L.light(ctx, 840, 700, 1700, '#E8E4D8', '#1A1C34');
    },
    (ctx, t, u) => { // 14 the officer grows serious
      street(ctx, t);
      ctx.save(); ctx.translate(W / 2, 0); ctx.scale(1.9, 1.9); ctx.translate(-W / 2, -560);
      cop(ctx, { x: W / 2, y: 1300, s: 1.2, brows: 'determined', mouth: 'flat', look: 0.2 });
      ctx.restore();
      L.light(ctx, W / 2, 700, 1500, '#E8E4D8', '#1A1C34');
    },
    (ctx, t, u) => { // 15 the old newspaper
      ctx.fillStyle = '#2A2420'; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(W / 2, 900); ctx.rotate(0.03); const z = lerp(1, 1.1, prog(t, t - u, 4)); ctx.scale(z, z);
      G.rrect(ctx, -420, -560, 840, 1100, 6, { fill: '#E6DCC4', lw: 5, seed: 820 });
      G.text(ctx, 'MOTORISTA MORRE', 0, -420, { size: 66, fam: 'Bungee', color: '#2A2420', align: 'center' });
      G.text(ctx, 'AO SALVAR PASSAGEIRA', 0, -340, { size: 50, fam: 'Bungee', color: '#2A2420', align: 'center' });
      G.rrect(ctx, -340, -280, 680, 420, 4, { fill: '#9C9486', lw: 4, seed: 821 });
      car(ctx, 0, 60, 0.75, {});
      for (let k = 0; k < 8; k++) G.line(ctx, [[-340, 200 + k * 40], [340 - (k % 3) * 60, 200 + k * 40]], { lw: 6, color: 'rgba(40,30,20,0.45)', seed: 822 + k });
      ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = '#888'; ctx.globalAlpha = 0.8; ctx.fillRect(0, 0, W, H); ctx.restore();
      L.light(ctx, W / 2, 800, 1500, '#F2E4C8', '#2A2018');
    },
    (ctx, t, u) => { // 16 the third person
      street(ctx, t);
      car(ctx, 480, 1600, 1.25, { driver: true });
      const k = prog(t, t - (t - ev.third), 0.3);
      if (k > 0) G.text(ctx, '#3', W / 2 - 40, SAFE.y + 260, { size: 260, fam: 'Bungee', color: '#FF3B3B', align: 'center', alpha: k, stroke: '#000', strokeW: 14 });
      L.light(ctx, 840, 700, 1700, '#E8E4D8', '#0E0F1E');
      L.flash(ctx, t, ev.third, 8, 0.6);
    },
  ];
  L.run(SCENES);
})();
