// "A ligação da vó"
(function () {
  const U = globalThis.U, G = globalThis.G, Ch = globalThis.Ch, S = globalThis.SCORE, L = globalThis.L;
  const prog = L.prog;
  const { clamp, lerp, ease, pulse } = U;
  const { ev, cuts } = S;
  const W = G.W, H = G.H, SAFE = S.SAFE, FLOOR = L.FLOOR;
  const HIM = { skin: Ch.SKIN_TONES[1], hair: '#2B211E', hairStyle: 'curlytop', outfit: 'hoodie', shirt: '#3D5A4A', bottoms: 'pants', pants: '#2C2F3A', shoes: '#DDD', sleeves: 'long' };
  const VO = { skin: Ch.SKIN_TONES[1], hair: '#D8D4CC', hairStyle: 'bun', outfit: 'dress', shirt: '#7A4E6E', glasses: 'round', shoes: '#3A2A2A' };
  globalThis.CAST = { neto: HIM, vo: VO };
  const him = L.person(HIM, 1.55, 900), vo = L.person(VO, 1.45, 920);
  const knocksAt = (t) => { const k = [0, 0.7, 1.4].map((x) => ev.knock + x); const hard = Array.from({ length: 6 }, (_, i) => cuts[12] + i * 0.32); return [...k, ...hard].reduce((a, x) => Math.max(a, t >= x ? Math.exp(-(t - x) * 14) : 0), 0); };

  function rainWindow(ctx, t, x, y, w, h, dawn = 0) {
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, dawn ? '#F2B07A' : '#0A0E24'); g.addColorStop(1, dawn ? '#F7D9A8' : '#1E2648');
    G.rrect(ctx, x - 16, y - 16, w + 32, h + 32, 6, { fill: '#3B344A', lw: 5, seed: 930 });
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    if (!dawn) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.strokeStyle = 'rgba(180,200,255,0.5)'; ctx.lineWidth = 2;
      for (let k = 0; k < 40; k++) { const rx = x + U.hash(k, 1) * w, ry = y + ((U.hash(k, 2) * h + t * 900) % h); ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 8, ry + 40); ctx.stroke(); } ctx.restore();
      if (Math.floor(t * 0.7) % 9 === 0 && (t * 0.7) % 1 < 0.08) { ctx.fillStyle = 'rgba(230,235,255,0.7)'; ctx.fillRect(x, y, w, h); } }
    G.line(ctx, [[x + w / 2, y], [x + w / 2, y + h]], { lw: 8, color: '#3B344A', seed: 931 });
  }
  function livingRoom(ctx, t, o = {}) {
    L.wall(ctx, '#2A2E44', '#1A1D30', '#2A2430');
    rainWindow(ctx, t, 600, 480, 380, 460, o.dawn);
    G.rrect(ctx, 80, 640, 300, 24, 4, { fill: '#5B4632', lw: 4, seed: 932 });
    G.rrect(ctx, 150, 470, 160, 170, 6, { fill: '#C9A24A', lw: 5, seed: 933 }); G.rrect(ctx, 168, 488, 124, 134, 4, { fill: '#9C8A6C', lw: 3, seed: 934 });
    ctx.save(); ctx.beginPath(); ctx.rect(168, 488, 124, 134); ctx.clip(); vo(ctx, { x: 230, y: 760, s: 0.42, mouth: 'smile', shadow: false }); ctx.restore();
    G.rrect(ctx, 320, 590, 22, 50, 4, { fill: '#F4EEE0', lw: 3, seed: 935 }); G.ellipse(ctx, 331, 580, 8, 14, { fill: '#FFB347', lw: 0, seed: 936 }); L.glow(ctx, 331, 580, 120, 'rgba(255,180,70,0.6)');
  }
  function phoneScreen(ctx, t, draw, shakeAmt = 0) {
    ctx.fillStyle = '#0B0D16'; ctx.fillRect(0, 0, W, H);
    const [sx, sy] = L.shake(t, shakeAmt, 40);
    const pw = 680, ph = 1260, px = W / 2 - pw / 2 - 30 + sx, py = 320 + sy;
    G.rrect(ctx, px - 24, py - 24, pw + 48, ph + 48, 70, { fill: '#18181F', lw: 6, seed: 940 });
    ctx.save(); ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip(); ctx.translate(px, py); draw(ctx, pw, ph); ctx.restore();
    L.glow(ctx, W / 2, 950, 900, 'rgba(160,180,255,0.25)');
  }
  function frontDoor(ctx, t, o = {}) {
    L.wall(ctx, '#262A40', '#171A2C', '#241E2A');
    const k = knocksAt(t), dx = k * 10 * (o.hard ? 2 : 1);
    ctx.save(); ctx.translate(dx, 0); L.door(ctx, 280, 480, 520, 1020); ctx.restore();
    ctx.fillStyle = '#FFE7A6'; ctx.fillRect(280, FLOOR - 6, 520, 10);
    // the shadow of two feet under the door
    ctx.fillStyle = '#0A0910'; ctx.fillRect(430, FLOOR - 6, 70, 10); ctx.fillRect(560, FLOOR - 6, 70, 10);
    if (k > 0.05) for (const r of [120, 200]) { ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${0.5 * k})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(540, 900, r, -0.7, 0.7); ctx.stroke(); ctx.beginPath(); ctx.arc(540, 900, r, Math.PI - 0.7, Math.PI + 0.7); ctx.stroke(); ctx.restore(); }
  }

  const SCENES = [
    (ctx, t, u) => { // 0 grandma's photo and a candle
      ctx.fillStyle = '#16131C'; ctx.fillRect(0, 0, W, H);
      const z = lerp(1, 1.12, prog(t, t - u, 4));
      ctx.save(); ctx.translate(W / 2, 900); ctx.scale(z, z);
      G.rrect(ctx, -300, -380, 600, 720, 10, { fill: '#C9A24A', lw: 6, seed: 950 }); G.rrect(ctx, -250, -330, 500, 620, 6, { fill: '#9C8A6C', lw: 4, seed: 951 });
      ctx.save(); ctx.beginPath(); ctx.rect(-250, -330, 500, 620); ctx.clip(); vo(ctx, { x: 0, y: 900, s: 2.1, mouth: 'smile', eyes: 'happy', shadow: false }); ctx.restore();
      ctx.restore();
      G.rrect(ctx, 760, 1260, 60, 200, 6, { fill: '#F4EEE0', lw: 4, seed: 952 }); const f = 1 + 0.15 * Math.sin(t * 13);
      G.ellipse(ctx, 790, 1225, 16 * f, 34 * f, { fill: '#FFB347', lw: 0, seed: 953 }); L.glow(ctx, 790, 1225, 400, 'rgba(255,170,60,0.55)');
      L.light(ctx, 790, 1100, 1500, '#F6E4C8', '#120E14');
      const ti = prog(t, t - u, 0.4) * (1 - clamp((u - 3.0) / 0.5));
      if (ti > 0) G.decor(() => { G.text(ctx, 'A LIGAÇÃO', W / 2 - 50, SAFE.y + 30, { size: 110, fam: 'Bungee', color: '#F4EEE0', align: 'center', alpha: ti, stroke: '#000', strokeW: 10 }); G.text(ctx, 'DA VÓ', W / 2 - 50, SAFE.y + 150, { size: 120, fam: 'Bungee', color: '#FF3B3B', align: 'center', alpha: ti, stroke: '#000', strokeW: 10 }); });
    },
    (ctx, t, u) => { // 1 a rainy night, the phone rings
      livingRoom(ctx, t);
      G.rrect(ctx, 120, 1220, 840, 180, 40, { fill: '#5A3E5E', lw: 5, seed: 960 });
      const ring = t >= ev.ring;
      him(ctx, { x: 420, y: 1340, pose: 'sit', s: 1.3, look: ring ? 0.8 : 0, eyes: ring ? 'wide' : 'normal', mouth: 'flat' });
      G.rrect(ctx, 100, 1330, 880, 170, 40, { fill: '#6A4A6E', lw: 5, seed: 961 });
      const [sx, sy] = ring ? L.shake(t, 5, 40) : [0, 0];
      L.phone(ctx, 760 + sx, 1300 + sy, 0.6, 0.2, ring ? '#5D7BFF' : '#222', 0);
      L.light(ctx, 790, 800, 1600, '#D8DCF0', '#1A1C30');
    },
    (ctx, t, u) => { // 2 "Vó" calling
      phoneScreen(ctx, t, (c, w, h) => {
        const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#2A3A6A'); g.addColorStop(1, '#0E1430'); c.fillStyle = g; c.fillRect(0, 0, w, h);
        G.ellipse(c, w / 2, 380, 160, 160, { fill: '#9C8A6C', lw: 5, seed: 970 });
        c.save(); c.beginPath(); c.arc(w / 2, 380, 155, 0, Math.PI * 2); c.clip(); vo(c, { x: w / 2, y: 840, s: 1.4, mouth: 'smile', shadow: false }); c.restore();
        G.text(c, 'Vó ❤', w / 2, 650, { size: 80, fam: 'Inter', weight: 800, color: '#fff', align: 'center' });
        G.text(c, 'chamando...', w / 2, 720, { size: 40, fam: 'Inter', weight: 400, color: '#C8D0F0', align: 'center' });
        G.ellipse(c, 170, h - 200, 70, 70, { fill: '#E04848', lw: 3, seed: 971 }); G.ellipse(c, w - 170, h - 200 - 10 * Math.abs(Math.sin(t * 6)), 70, 70, { fill: '#3DBB6A', lw: 3, seed: 972 });
      }, 5);
    },
    (ctx, t, u) => { // 3 he answers, trembling
      livingRoom(ctx, t);
      const [sx] = L.shake(t, 3, 20);
      ctx.save(); ctx.translate(W / 2 + sx, 0); ctx.scale(1.8, 1.8); ctx.translate(-W / 2, -560);
      him(ctx, { x: W / 2, y: 1300, s: 1.2, handR: [70, -400], eyes: 'wide', brows: 'worried', mouth: 'wavy', sweat: 0.7, look: -0.3, shadow: false });
      ctx.restore();
      L.light(ctx, W / 2, 700, 1500, '#D8DCF0', '#1A1C30');
    },
    (ctx, t, u) => { // 4 her voice: don't open the door
      ctx.fillStyle = '#0E1020'; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.globalAlpha = 0.45 + 0.1 * Math.sin(t * 2); vo(ctx, { x: W / 2 - 30, y: 1500, s: 1.7, mouth: Math.sin(t * 12) > 0 ? 'o' : 'flat', brows: 'worried', shadow: false }); ctx.restore();
      L.glow(ctx, W / 2, 900, 700, 'rgba(160,190,255,0.35)');
      const rev = prog(t, t - (t - ev.warn), 2.2);
      if (rev > 0) L.note(ctx, W / 2 - 30, SAFE.y + 170, 860, 300, -0.03, 'não abre a porta\npro seu irmão hoje', rev, 64, 12);
    },
    (ctx, t, u) => { // 5 she hung up
      phoneScreen(ctx, t, (c, w, h) => { c.fillStyle = '#10142A'; c.fillRect(0, 0, w, h); G.text(c, 'Vó ❤', w / 2, 520, { size: 80, fam: 'Inter', weight: 800, color: '#fff', align: 'center' }); G.text(c, 'chamada encerrada', w / 2, 610, { size: 44, fam: 'Inter', weight: 400, color: '#E04848', align: 'center' }); G.text(c, '00:09', w / 2, 680, { size: 40, fam: 'Inter', weight: 400, color: '#8890B0', align: 'center' }); });
    },
    (ctx, t, u) => { // 6 the number does not exist
      phoneScreen(ctx, t, (c, w, h) => { c.fillStyle = '#10142A'; c.fillRect(0, 0, w, h); G.text(c, 'Vó ❤', w / 2, 520, { size: 80, fam: 'Inter', weight: 800, color: '#fff', align: 'center' }); if (u > 0.9) { G.rrect(c, 60, 640, w - 120, 150, 24, { fill: '#3A0E14', lw: 4, seed: 980 }); G.text(c, 'NÚMERO INEXISTENTE', w / 2, 735, { size: 44, fam: 'Bungee', color: '#FF5050', align: 'center' }); } });
    },
    (ctx, t, u) => { // 7 three slow knocks
      frontDoor(ctx, t);
      L.light(ctx, 540, FLOOR, 1500, '#D8D4E8', '#141424');
    },
    (ctx, t, u) => { // 8 his brother's voice outside
      frontDoor(ctx, t);
      const a = prog(t, t - (t - ev.voice + 0.1), 0.3);
      if (a > 0) { G.text(ctx, '"abre aí,', W / 2 - 40, SAFE.y + 110, { size: 96, fam: 'Gochi Hand', weight: 400, color: '#F4EEE0', align: 'center', alpha: a, stroke: '#000', strokeW: 10 });
        G.text(ctx, 'sou eu!"', W / 2 - 40, SAFE.y + 215, { size: 96, fam: 'Gochi Hand', weight: 400, color: '#F4EEE0', align: 'center', alpha: prog(t, t - (t - ev.voice - 0.5), 0.3), stroke: '#000', strokeW: 10 }); }
      L.light(ctx, 540, FLOOR, 1500, '#D8D4E8', '#141424');
    },
    (ctx, t, u) => { // 9 his hand on the lock
      ctx.fillStyle = '#4A3828'; ctx.fillRect(0, 0, W, H); G.hatch(ctx, [0, 0, W, H], { color: 'rgba(0,0,0,0.25)', gap: 9, angle: 1.5 });
      G.rrect(ctx, 400, 700, 280, 420, 30, { fill: '#C9A24A', lw: 6, seed: 990 }); G.ellipse(ctx, 540, 860, 70, 70, { fill: '#E2C06A', lw: 5, seed: 991 }); G.rrect(ctx, 515, 960, 50, 100, 10, { fill: '#2A2320', lw: 4, seed: 992 });
      const turn = clamp(u / (cuts[10] - cuts[9])) * 0.4;
      G.limb(ctx, [[-120, 1700], [250, 1250], [500, 900]], { color: HIM.shirt, lw: 120 });
      ctx.save(); ctx.translate(530, 880); ctx.rotate(turn); G.ellipse(ctx, 0, 0, 110, 85, { fill: HIM.skin, lw: 6, seed: 993 }); ctx.restore();
      L.light(ctx, 540, 860, 1300, '#E8DCC8', '#16120E');
    },
    (ctx, t, u) => { // 10 the phone buzzes
      livingRoom(ctx, t);
      const on = t >= ev.buzz; const [sx, sy] = on ? L.shake(t, 7, 45) : [0, 0];
      L.phone(ctx, W / 2 + sx, 1100 + sy, 1.8, 0.1, on ? '#5D7BFF' : '#222', 0);
      if (on) { G.rrect(ctx, 180, 520, 720, 150, 30, { fill: '#F4F4F6', lw: 5, seed: 1000 }); G.text(ctx, 'Irmão: nova mensagem', 220, 610, { size: 42, fam: 'Inter', weight: 700, color: '#222' }); }
      L.light(ctx, W / 2, 900, 1500, '#D8DCF0', '#1A1C30');
    },
    (ctx, t, u) => { // 11 "stuck in traffic, there in an hour"
      phoneScreen(ctx, t, (c, w, h) => {
        c.fillStyle = '#ECE5DD'; c.fillRect(0, 0, w, h); c.fillStyle = '#075E54'; c.fillRect(0, 0, w, 140);
        G.text(c, 'Irmão', 40, 95, { size: 50, fam: 'Inter', weight: 800, color: '#fff' });
        const p = ease.outBack(prog(t, t - u, 0.4), 2);
        c.save(); c.translate(40, 300); c.scale(p, p);
        G.rrect(c, 0, 0, w - 120, 210, 26, { fill: '#FFFFFF', lw: 3, seed: 1010 });
        G.text(c, 'tô preso no trânsito', 30, 80, { size: 46, fam: 'Inter', weight: 400, color: '#111' });
        G.text(c, 'chego em uma hora', 30, 150, { size: 46, fam: 'Inter', weight: 400, color: '#111' });
        c.restore();
      });
    },
    (ctx, t, u) => { // 12 the knocking grows... and laughs
      frontDoor(ctx, t, { hard: true });
      if (t >= ev.laugh) { const a = prog(t, t - (t - ev.laugh), 0.3); G.text(ctx, 'HAHAHA', W / 2 - 40, SAFE.y + 150 + Math.sin(t * 20) * 6, { size: 120, fam: 'Bungee', color: '#FF3B3B', align: 'center', alpha: a * 0.9, stroke: '#000', strokeW: 10 }); L.glitch(ctx, 0.6 * a, t); }
      L.light(ctx, 540, FLOOR, 1500, '#D8D4E8', '#141424');
      L.flash(ctx, t, ev.laugh, 8, 0.8);
    },
    (ctx, t, u) => { // 13 all night on the floor, holding the handle
      L.wall(ctx, '#262A40', '#171A2C', '#241E2A');
      L.door(ctx, 280, 480, 520, 1020);
      him(ctx, { x: 540, y: FLOOR - 10, pose: 'floor', s: 1.4, handR: [130, -330], eyes: 'wide', brows: 'worried', mouth: 'flat', sweat: 0.6, look: 0.3 });
      const hrs = 3 + Math.floor(clamp(u / ((cuts[14] || u + 1) - cuts[13])) * 3);
      L.clock(ctx, W / 2 - 40, SAFE.y + 120, 0.5, `${hrs}:00`);
      L.light(ctx, 540, 900, 1400, '#D8D4E8', '#141424');
    },
    (ctx, t, u) => { // 14 dawn: the knocking stops
      L.wall(ctx, '#5A4E5A', '#3A3240', '#3A3036');
      L.door(ctx, 280, 480, 520, 1020);
      him(ctx, { x: 540, y: FLOOR - 10, pose: 'floor', s: 1.4, handR: [130, -330], eyes: u > 1.5 ? 'closed' : 'normal', mouth: 'flat', blink: 0, headRot: 0.15 });
      L.glow(ctx, 1000, 400, 900, 'rgba(255,190,120,0.45)');
      L.light(ctx, 900, 400, 1700, '#FFE6C8', '#3A2E30');
    },
    (ctx, t, u) => { // 15 outside: scratch marks
      L.wall(ctx, '#8A8070', '#6A6050', '#5A4A3A');
      L.door(ctx, 280, 480, 520, 1020);
      const n = Math.floor(prog(t, t - (t - cuts[15] - 0.3), 2.2) * 14);
      for (let k = 0; k < n; k++) { const x = 330 + U.hash(k, 3) * 400, y = 700 + U.hash(k, 4) * 650;
        for (let j = 0; j < 4; j++) G.line(ctx, [[x + j * 18, y], [x + j * 18 + 30, y + 160 + U.hash(k, j) * 80]], { lw: 5, color: 'rgba(30,15,10,0.85)', seed: 1100 + k * 4 + j }); }
      L.light(ctx, 540, 700, 1700, '#FFF0D8', '#5A4A3A');
      L.flash(ctx, t, ev.many, 8, 0.7);
    },
    (ctx, t, u) => { // 16 a note in grandma's handwriting
      L.wall(ctx, '#8A8070', '#6A6050', '#5A4A3A');
      ctx.fillStyle = '#5A4A3A'; ctx.fillRect(0, 0, W, H); G.hatch(ctx, [0, 0, W, H], { color: 'rgba(0,0,0,0.25)', gap: 12, angle: 0.15 });
      ctx.save(); ctx.globalAlpha = prog(t, t - (t - ev.note - 1.5), 1.5) * 0.35; vo(ctx, { x: W / 2 - 30, y: 900, s: 1.1, mouth: 'smile', eyes: 'happy', shadow: false }); ctx.restore();
      L.note(ctx, W / 2 - 30, 1150, 860, 360, -0.04, 'eu sempre vou\ncuidar de você', prog(t, t - (t - ev.note), 2.4), 72, 21);
      L.light(ctx, W / 2, 900, 1600, '#FFF0D8', '#3A2E24');
    },
  ];
  L.run(SCENES);
})();
