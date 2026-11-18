// "O 13º andar"
(function () {
  const U = globalThis.U, G = globalThis.G, Ch = globalThis.Ch, S = globalThis.SCORE, L = globalThis.L;
  const prog = L.prog;
  const { clamp, lerp, ease, pulse, noise1 } = U;
  const { ev, cuts, SC } = S;
  const W = G.W, H = G.H, SAFE = S.SAFE, FLOOR = L.FLOOR;
  const HIM = { skin: Ch.SKIN_TONES[2], hair: '#1E1A18', hairStyle: 'short', facialHair: 'stubble', outfit: 'shirt', shirt: '#E8E4DA', bottoms: 'pants', pants: '#2C2F3A', shoes: '#2A2320', sleeves: 'long' };
  const PORTER = { skin: Ch.SKIN_TONES[3], hair: '#9A9A9A', hairStyle: 'short', facialHair: 'mustache', outfit: 'suit', robe: '#27305C', trim: '#8B1E2E', bottoms: 'pants', glasses: 'square', headwear: 'cap', headwearColor: '#27305C' };
  globalThis.CAST = { ele: HIM, porteiro: PORTER };
  const him = L.person(HIM, 1.55, 310), porter = L.person(PORTER, 1.5, 330);

  // elevator interior seen from the back wall: doors in the middle, panel on the right
  function elevator(ctx, t, open, display, outside) {
    ctx.fillStyle = '#3C3A3F'; ctx.fillRect(0, 0, W, H);
    G.poly(ctx, [[0, 0], [W, 0], [W - 120, 240], [120, 240]], { fill: '#2A282E', lw: 5, seed: 400 });
    G.poly(ctx, [[0, H], [W, H], [W - 120, 1560], [120, 1560]], { fill: '#2F2B2A', lw: 5, seed: 401, hatch: { color: 'rgba(0,0,0,0.3)', gap: 10 } });
    for (const sd of [-1, 1]) G.poly(ctx, sd < 0 ? [[0, 0], [120, 240], [120, 1560], [0, H]] : [[W, 0], [W - 120, 240], [W - 120, 1560], [W, H]], { fill: '#56535A', lw: 5, seed: 402 + sd, hatch: { color: 'rgba(255,255,255,0.06)', gap: 8, angle: 1.57 } });
    const dx = 230, dy = 380, dw = 620, dh = 1180;
    ctx.save(); ctx.beginPath(); ctx.rect(dx, dy, dw, dh); ctx.clip();
    if (open > 0.01 && outside) { ctx.save(); ctx.translate(dx, dy); ctx.scale(dw / W, dh / H); outside(ctx, t); ctx.restore(); }
    const half = (dw / 2) * (1 - ease.inOutQuad(open));
    G.rrect(ctx, dx, dy, half, dh, 2, { fill: '#9A9CA3', lw: 5, seed: 410, hatch: { color: 'rgba(255,255,255,0.12)', gap: 9, angle: 1.57 } });
    G.rrect(ctx, dx + dw - half, dy, half, dh, 2, { fill: '#9A9CA3', lw: 5, seed: 411, hatch: { color: 'rgba(255,255,255,0.12)', gap: 9, angle: 1.57 } });
    ctx.restore();
    G.rrect(ctx, dx - 20, dy - 20, dw + 40, dh + 20, 4, { fill: 'rgba(0,0,0,0)', lw: 8, seed: 412 });
    // floor display above the doors
    G.rrect(ctx, W / 2 - 150, 250, 300, 110, 14, { fill: '#0E0C10', lw: 5, seed: 413 });
    const red = display === '13';
    G.text(ctx, display, W / 2, 337, { size: 84, fam: 'Bungee', color: red ? '#FF2A2A' : '#FFB347', align: 'center' });
    L.glow(ctx, W / 2, 305, 220, red ? 'rgba(255,40,40,0.6)' : 'rgba(255,170,70,0.35)');
    // panel
    G.rrect(ctx, 900, 760, 110, 380, 12, { fill: '#B9BBC2', lw: 5, seed: 414 });
    for (let k = 0; k < 6; k++) G.ellipse(ctx, 955, 820 + k * 55, 18, 18, { fill: k === 5 ? '#FFB347' : '#E7E7EA', lw: 3, seed: 415 + k });
  }
  const floorAt = (t) => { // the display climbing from T up to 12, then 13
    if (t >= ev.thirteen) return '13';
    for (let k = 2; k >= 0; k--) if (t >= ev.floors[k]) return String(10 + k);
    const a = cuts[2] + 1.6, b = ev.floors[0];
    if (t < a) return 'T';
    return String(1 + Math.floor(clamp((t - a) / (b - a)) * 8.99));
  };
  function darkCorridor(ctx, t, figAlpha, figEyes, figS = 0.7) {
    L.hallway(ctx, t, true);
    L.figure(ctx, W / 2, 1010, figS, figAlpha, { eyes: figEyes });
    ctx.fillStyle = 'rgba(0,0,10,0.35)'; ctx.fillRect(0, 0, W, H);
  }
  function building(ctx, t, u) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#05071A'); g.addColorStop(1, '#1D2350');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let k = 0; k < 40; k++) G.ellipse(ctx, U.hash(k, 1) * W, U.hash(k, 2) * 600, 2.5, 2.5, { fill: '#DDE', lw: 0, seed: k });
    const bx = 260, bw = 520, top = 260, fh = 100;
    G.rrect(ctx, bx, top, bw, H - top, 4, { fill: '#2B3050', lw: 6, seed: 420, hatch: { color: 'rgba(0,0,0,0.2)', gap: 10 } });
    for (let f = 0; f < 12; f++) for (let c = 0; c < 5; c++) {
      const lit = U.hash(f, c, 7) > 0.78 || (f === 11 - 0 && c === 2);
      ctx.fillStyle = lit ? '#F2C66B' : '#141830';
      ctx.fillRect(bx + 30 + c * 98, top + 40 + f * fh, 66, 56);
    }
    // the hidden 13th floor: a dark band on the roof
    G.rrect(ctx, bx - 10, top - 90, bw + 20, 90, 4, { fill: '#121222', lw: 6, seed: 421 });
    const k = clamp((t - SC[0].words[9].t) / 0.4);
    if (k > 0) G.text(ctx, '12 ANDARES', W / 2, 1600, { size: 80, fam: 'Bungee', color: '#F4EEE0', align: 'center', alpha: k, stroke: '#000', strokeW: 10 });
  }

  const SCENES = [
    (ctx, t, u, d) => { // 0 building at night
      const z = lerp(1.08, 1, ease.outCubic(prog(t, t - u, 4)));
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); building(ctx, t, u); ctx.restore();
      const ti = prog(t, t - u, 0.4) * (1 - clamp((u - 3.4) / 0.5));
      if (ti > 0) G.decor(() => { G.text(ctx, 'O 13º', W / 2 - 50, SAFE.y + 130, { size: 130, fam: 'Bungee', color: '#FF3B3B', align: 'center', alpha: ti, stroke: '#000', strokeW: 10 }); G.text(ctx, 'ANDAR', W / 2 - 50, SAFE.y + 250, { size: 110, fam: 'Bungee', color: '#F4EEE0', align: 'center', alpha: ti, stroke: '#000', strokeW: 10 }); });
    },
    (ctx, t, u) => { // 1 he walks to the elevator at midnight
      L.wall(ctx, '#2A2E3E', '#1B1E2B', '#2B2730');
      G.rrect(ctx, 600, 560, 380, 940, 4, { fill: '#9A9CA3', lw: 5, seed: 430, hatch: { color: 'rgba(255,255,255,0.12)', gap: 9, angle: 1.57 } });
      G.line(ctx, [[790, 560], [790, 1500]], { lw: 4, seed: 431 });
      G.ellipse(ctx, 1010, 980, 16, 16, { fill: '#FFB347', lw: 3, seed: 432 }); L.glow(ctx, 1010, 980, 70, 'rgba(255,180,70,0.6)');
      L.clock(ctx, 300, SAFE.y + 200, 0.5, '23:58');
      const wk = Ch.walk(u, { x0: -150, speed: 200, s: 1.55 });
      const x = Math.min(wk.x, 470);
      him(ctx, { x, y: FLOOR + 40, pose: x < 470 ? 'walk' : 'stand', walk: wk.walk, look: 0.6, mouth: 'flat' });
      L.light(ctx, 700, 500, 1500, '#E2E0F0', '#3A3550');
    },
    (ctx, t, u) => { // 2 inside, doors close, going UP
      const open = 1 - clamp((u - 0.9) / 0.7);
      elevator(ctx, t, open, floorAt(t), (c, tt) => { L.wall(c, '#2A2E3E', '#1B1E2B', '#2B2730'); });
      him(ctx, { x: 520, y: 1700, s: 1.35, handR: u < 1 ? [250, -560] : undefined, look: u < 1 ? 0.9 : 0, lookY: u > 2 ? -1 : 0, mouth: 'flat' });
      if (u > 1.8) G.text(ctx, '▲', 300, 337, { size: 70, fam: 'Bungee', color: '#FFB347', align: 'center' });
      L.light(ctx, W / 2, 200, 1700, '#F0E6D0', '#4A4040');
    },
    (ctx, t, u) => { // 3 pressing again, nothing
      elevator(ctx, t, 0, floorAt(t));
      const jab = Math.abs(Math.sin(u * 7));
      him(ctx, { x: 560, y: 1700, s: 1.35, handR: [250 + jab * 20, -560 + jab * 10], look: 0.9, brows: 'worried', mouth: 'wavy', sweat: 0.5 });
      G.text(ctx, '▲', 300, 337, { size: 70, fam: 'Bungee', color: '#FFB347', align: 'center' });
      L.light(ctx, W / 2, 200, 1700, '#F0E6D0', '#4A4040');
    },
    (ctx, t, u) => { // 4 close-up display 10, 11, 12
      ctx.fillStyle = '#1C1A1E'; ctx.fillRect(0, 0, W, H);
      const f = floorAt(t), last = ev.floors.filter((x) => t >= x).pop() || cuts[4];
      const kick = 1 + 0.12 * pulse(t, last, 10);
      ctx.save(); ctx.translate(W / 2, 860); ctx.scale(kick, kick);
      G.rrect(ctx, -380, -230, 760, 420, 40, { fill: '#0E0C10', lw: 8, seed: 440 });
      G.text(ctx, f, 0, 120, { size: 330, fam: 'Bungee', color: '#FFB347', align: 'center' });
      ctx.restore(); L.glow(ctx, W / 2, 860, 700, 'rgba(255,170,70,0.35)');
      G.text(ctx, '▲', W / 2, 1260, { size: 120, fam: 'Bungee', color: '#FFB347', align: 'center' });
    },
    (ctx, t, u) => { // 5 THIRTEEN
      ctx.fillStyle = '#120808'; ctx.fillRect(0, 0, W, H);
      const on = t >= ev.thirteen;
      const [sx, sy] = on ? L.shake(t, 14 * Math.exp(-(t - ev.thirteen) * 2), 40) : [0, 0];
      ctx.save(); ctx.translate(W / 2 + sx, 860 + sy); ctx.scale(on ? 1.1 : 1, on ? 1.1 : 1);
      G.rrect(ctx, -380, -230, 760, 420, 40, { fill: '#0E0C10', lw: 8, seed: 440 });
      G.text(ctx, on ? '13' : '12', 0, 120, { size: 330, fam: 'Bungee', color: on ? '#FF2A2A' : '#FFB347', align: 'center' });
      ctx.restore(); L.glow(ctx, W / 2, 860, 800, on ? 'rgba(255,30,30,0.5)' : 'rgba(255,170,70,0.3)');
      L.flash(ctx, t, ev.thirteen, 8, 0.85);
    },
    (ctx, t, u) => { // 6 doors open on a dark corridor
      elevator(ctx, t, prog(t, t - (t - ev.open), 2.2), '13', (c, tt) => darkCorridor(c, tt, 0, 0));
      L.light(ctx, W / 2, 900, 1400, '#D0C8D8', '#2A2030');
    },
    (ctx, t, u) => { // 7 someone at the end of the corridor, back turned
      const z = lerp(1, 1.25, ease.inOutQuad(prog(t, t - u, 4)));
      ctx.save(); ctx.translate(W / 2, 1000); ctx.scale(z, z); ctx.translate(-W / 2, -1000);
      darkCorridor(ctx, t, 1, 0, 0.75);
      ctx.restore();
    },
    (ctx, t, u) => { // 8 jabbing the close button
      ctx.fillStyle = '#56535A'; ctx.fillRect(0, 0, W, H);
      G.hatch(ctx, [0, 0, W, H], { color: 'rgba(255,255,255,0.06)', gap: 8, angle: 1.57 });
      G.rrect(ctx, 290, 360, 500, 1100, 40, { fill: '#B9BBC2', lw: 8, seed: 450 });
      for (let k = 0; k < 4; k++) G.ellipse(ctx, 540, 520 + k * 200, 70, 70, { fill: '#E7E7EA', lw: 5, seed: 451 + k });
      G.text(ctx, '▶◀', 540, 1170, { size: 70, fam: 'Bungee', color: '#333', align: 'center' });
      const jab = Math.abs(Math.sin(u * Math.PI / 0.22));
      const [sx, sy] = L.shake(t, 6, 30);
      G.limb(ctx, [[1250, 1700], [900 + sx, 1400], [600 + jab * 50 + sx, 1180 + jab * 40 + sy]], { color: '#E8E4DA', lw: 90 });
      G.ellipse(ctx, 590 + jab * 50 + sx, 1170 + jab * 40 + sy, 60, 48, { fill: HIM.skin, lw: 5, seed: 455 });
      L.light(ctx, 540, 600, 1400, '#F0E6D0', '#4A4040');
    },
    (ctx, t, u) => { // 9 the head begins to turn
      const z = lerp(1.25, 1.7, ease.inOutQuad(prog(t, t - u, 4)));
      ctx.save(); ctx.translate(W / 2, 960); ctx.scale(z, z); ctx.translate(-W / 2, -960);
      darkCorridor(ctx, t, 1, prog(t, t - (t - ev.turn - 0.6), 1.5), 0.75);
      ctx.restore();
      if (t > ev.turn) L.glitch(ctx, 0.3 + 0.3 * Math.sin(t * 9), t);
    },
    (ctx, t, u) => { // 10 doors slam, going down
      const shut = prog(t, t - (t - ev.close + 0.6), 0.6);
      const down = t > ev.close + 0.2;
      const f = down ? ['13', '9', '6', '3', 'T'][Math.min(4, Math.floor((t - ev.close) * 2))] : '13';
      elevator(ctx, t, 1 - shut, f === '13' ? '13' : f, (c, tt) => darkCorridor(c, tt, 1, 1, 0.75));
      him(ctx, { x: 540, y: 1720, s: 1.35, eyes: 'wide', brows: 'worried', mouth: 'o', sweat: 1, look: 0.05 * Math.sin(t * 40) });
      if (down) G.text(ctx, '▼', 300, 337, { size: 70, fam: 'Bungee', color: '#FFB347', align: 'center' });
      L.light(ctx, W / 2, 200, 1700, '#F0E6D0', '#4A4040');
    },
    (ctx, t, u) => { // 11 next day: the porter
      L.wall(ctx, '#C9C1B0', '#A89F8E', '#8C7B66');
      G.rrect(ctx, 420, 1180, 640, 320, 10, { fill: '#5B4632', lw: 5, seed: 460, hatch: { color: 'rgba(0,0,0,0.2)', gap: 8 } });
      porter(ctx, { x: 760, y: 1500, s: 1.35, look: -0.7, mouth: 'flat' });
      G.rrect(ctx, 420, 1180, 640, 320, 10, { fill: '#5B4632', lw: 5, seed: 461, hatch: { color: 'rgba(0,0,0,0.2)', gap: 8 } });
      him(ctx, { x: 260, y: FLOOR + 60, look: 0.7, mouth: Math.sin(t * 14) > 0 ? 'open' : 'flat', gesture: 'point' });
      L.light(ctx, W / 2, 300, 1800, '#FFF6E0', '#9A8E78');
    },
    (ctx, t, u) => { // 12 porter turns pale: the fire
      L.wall(ctx, '#C9C1B0', '#A89F8E', '#8C7B66');
      ctx.save(); ctx.translate(W / 2, 0); ctx.scale(1.9, 1.9); ctx.translate(-W / 2, -560);
      porter(ctx, { x: W / 2, y: 1300, s: 1.2, eyes: 'wide', brows: 'worried', mouth: 'wavy', sweat: 1, style: { ...PORTER, skin: '#D9CFC4' } });
      ctx.restore();
      const k = ease.outBack(prog(t, t - (t - ev.fire + 0.2), 0.5));
      if (k > 0) L.note(ctx, W / 2 + 160, 1250, 560 * k, 330 * k, 0.06, 'INCÊNDIO NO\n13º ANDAR', 1, 62, 9);
      L.light(ctx, W / 2, 300, 1800, '#FFF6E0', '#9A8E78');
    },
    (ctx, t, u) => { // 13 the security room
      ctx.fillStyle = '#101218'; ctx.fillRect(0, 0, W, H);
      for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
        const x = 120 + c * 440, y = 380 + r * 360;
        G.rrect(ctx, x, y, 400, 300, 10, { fill: '#2A3A30', lw: 6, seed: 470 + r * 2 + c });
        ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (let yy = y + ((t * 40) % 6); yy < y + 300; yy += 6) ctx.fillRect(x, yy, 400, 2);
      }
      him(ctx, { x: 540, y: 1900, s: 1.5, lookY: -1, mouth: 'flat', shadow: false });
      L.glow(ctx, 540, 700, 800, 'rgba(120,220,150,0.25)');
    },
    (ctx, t, u) => { // 14 CCTV: doors open on 13, he is there
      elevator(ctx, t, 1, '13', (c, tt) => darkCorridor(c, tt, 0, 0));
      him(ctx, { x: 420, y: 1720, s: 1.35, look: 0, mouth: 'flat' });
      L.cctv(ctx, t, L.stampAt(u, 4).replace('03:', '23:'));
    },
    (ctx, t, u) => { // 15 CCTV: a burned woman beside him
      elevator(ctx, t, 1, '13', (c, tt) => darkCorridor(c, tt, 0, 0));
      const on = t >= ev.burned;
      if (on) { L.figure(ctx, 700, 1720, 1.15, 1, { eyes: 1 }); L.glow(ctx, 700, 1200, 500, 'rgba(255,90,30,0.35)'); }
      him(ctx, { x: 420, y: 1720, s: 1.35, look: 0, mouth: 'flat' });
      L.cctv(ctx, t, L.stampAt(u, 9).replace('03:', '23:'));
      if (on) { L.glitch(ctx, Math.exp(-(t - ev.burned) * 3) * 1.2, t); L.flash(ctx, t, ev.burned, 8, 0.85); }
    },
    (ctx, t, u) => { // 16 she whispers
      ctx.fillStyle = '#0A0808'; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(W / 2, 0); ctx.scale(1.7, 1.7); ctx.translate(-W / 2, -560);
      him(ctx, { x: 400, y: 1300, s: 1.2, eyes: 'wide', brows: 'worried', mouth: 'o', sweat: 1, shadow: false, look: 0.8 });
      ctx.restore();
      const lean = ease.inOutQuad(prog(t, t - u, 3));
      L.glow(ctx, lerp(1000, 800, lean), 1000, 650, 'rgba(255,100,30,0.55)');
      L.figure(ctx, lerp(1100, 860, lean), 1900, 1.6, 1, { lean: -0.35 * lean, eyes: 1, reach: true });
      if (t >= ev.whisper - 0.2) for (let k = 0; k < 4; k++) { const p = (u * 0.9 + k / 4) % 1; ctx.save(); ctx.strokeStyle = `rgba(220,200,200,${0.5 * (1 - p)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(640, 640, 40 + p * 160, 2.3, 3.6); ctx.stroke(); ctx.restore(); }
    },
  ];
  L.run(SCENES);
})();
