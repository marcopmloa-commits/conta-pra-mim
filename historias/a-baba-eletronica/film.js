// "A babá eletrônica"
(function () {
  const U = globalThis.U, G = globalThis.G, Ch = globalThis.Ch, S = globalThis.SCORE, L = globalThis.L;
  const prog = L.prog;
  const { clamp, lerp, ease, pulse } = U;
  const { ev, cuts } = S;
  const W = G.W, H = G.H, SAFE = S.SAFE, FLOOR = L.FLOOR;
  const MOM = { skin: Ch.SKIN_TONES[0], hair: '#5A3A22', hairStyle: 'long', outfit: 'tee', shirt: '#C98BA0', bottoms: 'pants', pants: '#6B5A7A', shoes: '#EEE8E0', sleeves: 'long' };
  const NEIGH = { skin: Ch.SKIN_TONES[1], hair: '#E8E4DA', hairStyle: 'bun', outfit: 'dress', shirt: '#7A5C8E', glasses: 'round', shoes: '#3A2A2A' };
  globalThis.CAST = { mae: MOM, vizinha: NEIGH };
  const mom = L.person(MOM, 1.55, 340), neigh = L.person(NEIGH, 1.45, 360);

  function crib(ctx, x, y, s = 1, baby = true) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    G.rrect(ctx, -260, -330, 520, 300, 10, { fill: '#E8DCC8', lw: 5, seed: 500 });
    if (baby) { G.ellipse(ctx, -40, -95, 120, 55, { fill: '#F2C4CE', lw: 4, seed: 501 }); G.ellipse(ctx, -170, -110, 48, 44, { fill: '#F3D2B3', lw: 4, seed: 502 }); G.line(ctx, [[-185, -112], [-170, -106], [-155, -112]], { lw: 3, seed: 503 }); }
    for (let k = 0; k <= 10; k++) G.line(ctx, [[-260 + k * 52, -330], [-260 + k * 52, -30]], { lw: 6, color: '#C9A87C', seed: 504 + k });
    G.rrect(ctx, -280, -350, 560, 30, 8, { fill: '#C9A87C', lw: 5, seed: 520 });
    G.rrect(ctx, -280, -40, 560, 30, 8, { fill: '#C9A87C', lw: 5, seed: 521 });
    for (const sd of [-1, 1]) G.rrect(ctx, sd * 280 - 14, -380, 28, 380, 6, { fill: '#B8956A', lw: 5, seed: 522 + sd });
    ctx.restore();
  }
  function mobile(ctx, x, y, t) {
    G.line(ctx, [[x, 0], [x, y]], { lw: 3, seed: 530 });
    for (let k = 0; k < 4; k++) { const a = t * 0.8 + (k * Math.PI) / 2; const px = x + Math.cos(a) * 110; G.line(ctx, [[x, y], [px, y + 40]], { lw: 2, seed: 531 + k }); G.star(ctx, px, y + 70, 22, { fill: ['#F2B84B', '#9CC1FF', '#F2C4CE', '#BDE0B0'][k], seed: 535 + k }); }
  }
  function monitor(ctx, x, y, s, on, t, screen) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    G.line(ctx, [[60, -120], [90, -200]], { lw: 6, seed: 540 });
    G.rrect(ctx, -110, -130, 220, 260, 30, { fill: '#F4F1EA', lw: 5, seed: 541 });
    G.rrect(ctx, -80, -100, 160, 120, 10, { fill: on ? '#1F4A35' : '#1A1A1E', lw: 4, seed: 542 });
    if (on && screen) { ctx.save(); ctx.beginPath(); ctx.rect(-80, -100, 160, 120); ctx.clip(); screen(ctx); ctx.restore(); }
    for (let k = 0; k < 5; k++) { const h = on ? 8 + 26 * Math.abs(Math.sin(t * 7 + k * 1.3)) : 6; G.rrect(ctx, -60 + k * 26, 90 - h, 16, h, 3, { fill: on ? '#57D68D' : '#888', lw: 0, seed: 543 + k }); }
    ctx.restore();
    if (on) L.glow(ctx, x, y, 260 * s, 'rgba(90,230,150,0.45)');
  }
  function notes(ctx, t, x, y, alpha = 1, n = 5) {
    if (alpha <= 0) return;
    for (let k = 0; k < n; k++) { const p = (t * 0.35 + k / n) % 1; const nx = x + Math.sin(t * 1.3 + k * 2) * 120 + (k - n / 2) * 40, ny = y - p * 520;
      G.text(ctx, k % 2 ? '♪' : '♫', nx, ny, { size: 70, fam: 'Bungee', color: `rgba(200,255,220,${alpha * Math.sin(Math.PI * p)})`, align: 'center' }); }
  }
  function babyRoom(ctx, t, o = {}) {
    L.wall(ctx, o.top || '#3A3456', o.bot || '#262240', o.floor || '#3A3040');
    G.rrect(ctx, 120, 420, 300, 260, 6, { fill: '#2A2F55', lw: 5, seed: 550 }); G.ellipse(ctx, 330, 500, 34, 34, { fill: '#F2EBD0', lw: 3, seed: 551 });
    crib(ctx, 560, FLOOR - 20, 1.05, o.baby !== false); mobile(ctx, 560, 700, t);
    G.rrect(ctx, 840, 820, 200, 24, 4, { fill: '#B8956A', lw: 4, seed: 552 });
    G.rrect(ctx, 905, 770, 70, 50, 10, { fill: '#F4F1EA', lw: 4, seed: 553 }); G.ellipse(ctx, 940, 795, 16, 16, { fill: '#222', lw: 3, seed: 554 });
    if (Math.floor(t * 1.5) % 2 === 0) G.ellipse(ctx, 965, 782, 5, 5, { fill: '#FF3030', lw: 0, seed: 555 });
  }
  function bedroom(ctx, t, o = {}) {
    L.wall(ctx, '#232846', '#151931', '#211C2A');
    L.bed(ctx, 560, FLOOR);
    G.rrect(ctx, 30, FLOOR - 240, 200, 240, 8, { fill: '#4A3A30', lw: 5, seed: 560 });
  }
  const babyScreen = (c) => { c.fillStyle = '#2E5A42'; c.fillRect(-80, -100, 160, 120); c.save(); c.translate(0, 10); c.scale(0.22, 0.22); crib(c, 0, 0, 1, true); c.restore(); };

  const SCENES = [
    (ctx, t, u) => { // 0 the baby room
      babyRoom(ctx, t);
      L.light(ctx, 560, 700, 1500, '#F2E4DA', '#3C3450');
      const ti = prog(t, t - u, 0.4) * (1 - clamp((u - 3.6) / 0.5));
      if (ti > 0) G.decor(() => { G.text(ctx, 'A BABÁ', W / 2 - 50, SAFE.y + 120, { size: 120, fam: 'Bungee', color: '#F4EEE0', align: 'center', alpha: ti, stroke: '#000', strokeW: 10 }); G.text(ctx, 'ELETRÔNICA', W / 2 - 50, SAFE.y + 240, { size: 100, fam: 'Bungee', color: '#57D68D', align: 'center', alpha: ti, stroke: '#000', strokeW: 10 }); });
    },
    (ctx, t, u) => { // 1 alone in bed
      bedroom(ctx, t);
      mom(ctx, { x: 420, y: FLOOR - 120, pose: 'sit', s: 1.2, blanket: true, gesture: 'phone', lookY: 0.5, mouth: 'flat' });
      G.rrect(ctx, 560, FLOOR - 175, 160, 60, 26, { fill: '#D9D3C4', lw: 4, seed: 561 });
      G.rrect(ctx, 260, FLOOR - 150, 640, 150, 18, { fill: '#5A4A6E', lw: 5, seed: 562, hatch: { color: 'rgba(0,0,0,0.2)', gap: 9 } });
      monitor(ctx, 130, FLOOR - 330, 0.6, false, t);
      L.light(ctx, 420, 900, 1300, '#D8D4F0', '#2A2848');
    },
    (ctx, t, u) => { // 2 2 a.m.: the monitor lights up
      bedroom(ctx, t);
      const on = t >= ev.lightUp;
      mom(ctx, { x: 560, y: FLOOR - 120, pose: 'sit', s: 1.25, blanket: true, eyes: on ? 'wide' : 'sleep', mouth: on ? 'o' : 'sleep', look: -0.8, blink: 0 });
      G.rrect(ctx, 260, FLOOR - 150, 640, 150, 18, { fill: '#5A4A6E', lw: 5, seed: 562, hatch: { color: 'rgba(0,0,0,0.2)', gap: 9 } });
      monitor(ctx, 130, FLOOR - 330, 0.75, on, t);
      notes(ctx, t, 140, FLOOR - 420, on ? prog(t, t - (t - ev.singing), 0.6) : 0, 4);
      L.clock(ctx, W / 2, SAFE.y + 120, 0.5, '2:00');
      L.light(ctx, 130, FLOOR - 330, on ? 1300 : 600, '#C8F0D8', '#0C141A');
    },
    (ctx, t, u) => { // 3 close-up: a woman singing
      ctx.fillStyle = '#0D1412'; ctx.fillRect(0, 0, W, H);
      monitor(ctx, W / 2, 1050, 2.6, true, t);
      notes(ctx, t, W / 2, 700, 1, 6);
    },
    (ctx, t, u) => { // 4 the screen: only the baby
      ctx.fillStyle = '#0D1412'; ctx.fillRect(0, 0, W, H);
      const z = lerp(2.6, 4.2, ease.inOutQuad(prog(t, t - u, 2.5)));
      monitor(ctx, W / 2, 1050 + (z - 2.6) * 90, z, true, t, babyScreen);
      L.cctv(ctx, t, L.stampAt(u, 2).replace('03:17', '02:00'));
    },
    (ctx, t, u) => { // 5 but the music goes on
      bedroom(ctx, t);
      mom(ctx, { x: 560, y: FLOOR - 120, pose: 'sit', s: 1.25, blanket: true, eyes: 'wide', brows: 'worried', mouth: 'wavy', sweat: 0.8, look: -0.8 });
      G.rrect(ctx, 260, FLOOR - 150, 640, 150, 18, { fill: '#5A4A6E', lw: 5, seed: 562 });
      monitor(ctx, 130, FLOOR - 330, 0.75, true, t); notes(ctx, t, 300, 1100, 1, 7);
      L.light(ctx, 130, FLOOR - 330, 1300, '#C8F0D8', '#0C141A');
    },
    (ctx, t, u) => { // 6 down the dark hallway, monitor in hand
      L.hallway(ctx, t, false);
      const wk = Ch.walk(u, { x0: 0, speed: 50, s: 1.45 });
      mom(ctx, { x: W / 2 - 40, y: FLOOR + 80 - u * 30, s: 1.45, pose: 'walk', walk: wk.walk * 0.5, gesture: 'phone', eyes: 'wide', brows: 'worried', mouth: 'flat' });
      L.glow(ctx, W / 2, 1050, 300, 'rgba(90,230,150,0.4)');
      notes(ctx, t, W / 2, 900, 0.7, 3);
    },
    (ctx, t, u) => { // 7 at her door: the singing stops
      L.wall(ctx, '#232846', '#151931', '#211C2A');
      L.door(ctx, 480, 520, 500, 980);
      ctx.fillStyle = 'rgba(160,255,200,0.6)'; ctx.fillRect(480, FLOOR - 8, 500, 10);
      mom(ctx, { x: 270, y: FLOOR + 60, gesture: 'phone', look: 0.8, eyes: 'wide', brows: 'worried', mouth: 'flat' });
      notes(ctx, t, 730, 1300, 1 - clamp((t - ev.stop) / 0.4), 4);
      L.light(ctx, 730, FLOOR, 1500, '#D8F0E0', '#141828');
    },
    (ctx, t, u) => { // 8 the monitor in her hand
      ctx.fillStyle = '#0B0E14'; ctx.fillRect(0, 0, W, H);
      const [sx, sy] = L.shake(t, 5, 12);
      G.limb(ctx, [[1200, 1900], [820 + sx, 1500], [640 + sx, 1250 + sy]], { color: MOM.shirt, lw: 110 });
      monitor(ctx, W / 2 + sx, 1000 + sy, 2.4, true, t);
      G.ellipse(ctx, 650 + sx, 1220 + sy, 80, 60, { fill: MOM.skin, lw: 5, seed: 570 });
      if (t >= ev.whisper) for (let k = 0; k < 4; k++) { const p = (u * 0.9 + k / 4) % 1; ctx.save(); ctx.strokeStyle = `rgba(160,255,200,${0.6 * (1 - p)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(W / 2, 900, 160 + p * 300, -2.6, -0.5); ctx.stroke(); ctx.restore(); }
    },
    (ctx, t, u) => { // 9 "Shhh. Mommy is awake."
      ctx.fillStyle = '#05070A'; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(W / 2, 0); ctx.scale(2.4, 2.4); ctx.translate(-W / 2, -560);
      mom(ctx, { x: W / 2, y: 1300, s: 1.1, eyes: 'wide', brows: 'worried', mouth: 'o', sweat: 1, shadow: false, blink: 0 });
      ctx.restore();
      L.glow(ctx, W / 2, 1300, 700, 'rgba(90,230,150,0.35)');
      G.text(ctx, 'shhh...', W / 2 - 40, SAFE.y + 160, { size: 110, fam: 'Gochi Hand', weight: 400, color: 'rgba(190,255,215,0.85)', align: 'center', alpha: prog(t, t - u, 0.5) });
      L.flash(ctx, t, ev.awake, 8, 0.85);
    },
    (ctx, t, u) => { // 10 the room is empty, only the baby
      babyRoom(ctx, t);
      const sw = ease.outCubic(prog(t, t - (t - ev.open), 0.4));
      mom(ctx, { x: lerp(1200, 880, sw), y: FLOOR + 60, eyes: 'wide', brows: 'worried', mouth: 'o', look: -0.8, gesture: 'phone' });
      L.light(ctx, 880, 700, 1500, '#E8E4F4', '#262240');
      L.flash(ctx, t, ev.open, 9, 0.5);
    },
    (ctx, t, u) => { // 11 living room, every light on
      L.wall(ctx, '#E9DCC0', '#CDBB9A', '#9C8466');
      L.lamp(ctx, 220, 520, 1); L.lamp(ctx, 860, 520, 1);
      G.rrect(ctx, 150, 1180, 780, 200, 40, { fill: '#7A4E3A', lw: 5, seed: 580 });
      mom(ctx, { x: W / 2, y: 1300, pose: 'sit', s: 1.35, handL: [-40, -120], handR: [40, -120], look: -0.3, lookY: 0.5, brows: 'worried', mouth: 'flat' });
      G.ellipse(ctx, W / 2, 1300 - 1.35 * 120, 110, 60, { fill: '#F2C4CE', lw: 4, seed: 581 }); G.ellipse(ctx, W / 2 - 80, 1300 - 1.35 * 130, 40, 36, { fill: '#F3D2B3', lw: 4, seed: 582 });
      G.rrect(ctx, 100, 1300, 880, 200, 40, { fill: '#8A5A44', lw: 5, seed: 583 });
      L.light(ctx, W / 2, 600, 1900, '#FFF6E0', '#B8A888');
    },
    (ctx, t, u) => { // 12 next day: a knock, the neighbor
      L.wall(ctx, '#E9DCC0', '#CDBB9A', '#9C8466');
      const op = ease.inOutQuad(prog(t, t - (t - ev.knock - 1.4), 0.8));
      G.rrect(ctx, 440, 520, 500, 980, 4, { fill: '#F4F1E6', lw: 5, seed: 590 });
      if (op > 0) neigh(ctx, { x: 690, y: FLOOR, s: 1.35, mouth: 'flat', look: -0.5, alpha: op });
      G.rrect(ctx, 440, 520, 500 * (1 - op * 0.85), 980, 4, { fill: '#5B4632', lw: 5, seed: 591, hatch: { color: 'rgba(0,0,0,0.25)', gap: 9, angle: 1.5 } });
      mom(ctx, { x: 230, y: FLOOR + 60, look: 0.8, mouth: 'flat', brows: 'worried' });
      L.light(ctx, W / 2, 500, 1900, '#FFF6E0', '#B8A888');
    },
    (ctx, t, u) => { // 13 she heard someone singing all night
      L.wall(ctx, '#E9DCC0', '#CDBB9A', '#9C8466');
      ctx.save(); ctx.translate(W / 2, 0); ctx.scale(1.8, 1.8); ctx.translate(-W / 2, -560);
      neigh(ctx, { x: W / 2, y: 1300, s: 1.2, mouth: Math.sin(t * 12) > 0 ? 'o' : 'wavy', brows: 'worried', eyes: 'wide', look: -0.3 });
      ctx.restore();
      G.ellipse(ctx, 800, 520, 200, 140, { fill: '#F4F1E6', lw: 5, seed: 592 }); for (const [x, y] of [[700, 650], [670, 700]]) G.ellipse(ctx, x, y, 20, 16, { fill: '#F4F1E6', lw: 4, seed: x });
      G.text(ctx, '♪ ♫ ♪', 800, 550, { size: 70, fam: 'Bungee', color: '#3A3456', align: 'center' });
      L.light(ctx, W / 2, 500, 1900, '#FFF6E0', '#B8A888');
    },
    (ctx, t, u) => { // 14 an old photo: the former tenant and her son
      ctx.fillStyle = '#2A2420'; ctx.fillRect(0, 0, W, H);
      const z = lerp(1, 1.12, prog(t, t - u, 4));
      ctx.save(); ctx.translate(W / 2, 900); ctx.rotate(-0.04); ctx.scale(z, z);
      G.rrect(ctx, -380, -480, 760, 900, 8, { fill: '#E8DCC0', lw: 5, seed: 600 });
      G.rrect(ctx, -320, -420, 640, 640, 4, { fill: '#9C8A6C', lw: 4, seed: 601 });
      ctx.save(); ctx.translate(0, 200); ctx.scale(0.9, 0.9);
      neigh(ctx, { x: -60, y: 0, s: 1.1, style: { ...NEIGH, hair: '#3A2A20', glasses: 'none' }, mouth: 'smile', shadow: false });
      Ch.person(ctx, { x: 140, y: 0, s: 0.62, pose: 'stand', style: { skin: Ch.SKIN_TONES[0], hair: '#3A2A20', hairStyle: 'short', outfit: 'tee', shirt: '#6A8CAF', bottoms: 'shorts' }, mouth: 'smile', shadow: false, seed: 380 });
      ctx.restore();
      G.text(ctx, '1987', 0, 330, { size: 60, fam: 'Gochi Hand', weight: 400, color: '#3A2A20', align: 'center' });
      ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = '#888'; ctx.globalAlpha = 0.7; ctx.fillRect(0, 0, W, H); ctx.restore();
      L.light(ctx, W / 2, 800, 1500, '#F2E4C8', '#2A2018');
    },
    (ctx, t, u) => { // 15 the son who died in that room
      babyRoom(ctx, t, { baby: false, top: '#2A2838', bot: '#1A1826', floor: '#2A2430' });
      G.ellipse(ctx, 560, FLOOR - 140, 60, 55, { fill: '#A87E52', lw: 4, seed: 610 }); G.ellipse(ctx, 560, FLOOR - 220, 45, 42, { fill: '#A87E52', lw: 4, seed: 611 });
      for (const sd of [-1, 1]) G.ellipse(ctx, 560 + sd * 35, FLOOR - 255, 16, 16, { fill: '#A87E52', lw: 3, seed: 612 + sd });
      ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = '#888'; ctx.globalAlpha = 0.8; ctx.fillRect(0, 0, W, H); ctx.restore();
      L.light(ctx, 560, 900, 1300, '#D8D4E0', '#0E0C14');
    },
    (ctx, t, u) => { // 16 unplugged... and it lights up by itself
      ctx.fillStyle = '#0B0D14'; ctx.fillRect(0, 0, W, H);
      G.rrect(ctx, 0, 1250, W, 400, 10, { fill: '#3A2E26', lw: 5, seed: 620, hatch: { color: 'rgba(0,0,0,0.25)', gap: 9 } });
      const on = t >= ev.alone;
      monitor(ctx, W / 2, 1060, 2.0, on, t, babyScreen);
      G.line(ctx, [[W / 2 + 120, 1240], [W / 2 + 260, 1300], [W / 2 + 400, 1280], [W / 2 + 430, 1330]], { lw: 10, color: '#222', seed: 621 });
      G.rrect(ctx, W / 2 + 410, 1320, 60, 40, 6, { fill: '#DDD', lw: 4, seed: 622 });
      notes(ctx, t, W / 2, 700, on ? prog(t, t - (t - ev.alone), 0.8) : 0, 6);
      L.clock(ctx, W / 2 - 40, SAFE.y + 120, 0.5, '2:00');
      if (on) L.flash(ctx, t, ev.alone, 8, 0.8);
    },
  ];
  L.run(SCENES);
})();
