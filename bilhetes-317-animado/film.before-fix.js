// THE FILM: "Os bilhetes das 3h17". Every frame is a pure function of t.
(function () {
  const U = globalThis.U, G = globalThis.G, Ch = globalThis.Ch, S = globalThis.SCORE, Studio = globalThis.Studio;
  const { clamp, lerp, ease, pulse, noise1 } = U;
  const { ev, cuts, SC } = S;
  const W = G.W, H = G.H, SAFE = S.SAFE;
  const FLOOR = 1500;
  const INK = '#15131C';

  const HER = { skin: Ch.SKIN_TONES[1], hair: '#17141A', hairStyle: 'long', outfit: 'hoodie', shirt: '#8B909C', bottoms: 'pants', pants: '#2C3246', shoes: '#D8D4CC', sleeves: 'long' };
  globalThis.CAST = { ela: HER };

  // ---------------------------------------------------------------- helpers
  const blinkAt = (t, seed) => { const k = Math.floor(t / 2.7); const ph = t - k * 2.7 - U.hash(k, seed) * 2; return ph > 0 && ph < 0.12 ? 1 : 0; };
  const her = (ctx, o) => Ch.person(ctx, Object.assign({ pose: 'stand', s: 1.55, style: HER, mouth: 'flat', blink: blinkAt(G.t, 3), seed: 300 }, o));
  const shake = (t, amp, sp = 30) => [noise1(t * sp, 1) * amp, noise1(t * sp, 2) * amp];

  function wall(ctx, top = '#232A45', bot = '#161B30', floor = '#2A2230') {
    const g = ctx.createLinearGradient(0, 0, 0, FLOOR);
    g.addColorStop(0, top); g.addColorStop(1, bot);
    ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, FLOOR + 200);
    G.hatch(ctx, [-100, -100, -100 + W + 200, -100 + FLOOR + 100], { color: 'rgba(255,255,255,0.035)', gap: 14, angle: 0.9 });
    G.poly(ctx, [[-200, FLOOR], [W + 200, FLOOR], [W + 200, H + 200], [-200, H + 200]], { fill: floor, lw: 5, seed: 7, hatch: { color: 'rgba(0,0,0,0.25)', gap: 12, angle: 0.15 } });
    G.rrect(ctx, -200, FLOOR - 26, W + 400, 30, 4, { fill: '#2F3550', lw: 4, seed: 8 });
  }
  function light(ctx, cx, cy, r, inner = '#E4E7FA', outer = '#454A7C') {
    outer = G.tint(outer, 0.28);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, inner); g.addColorStop(0.55, G.tint(inner, -0.22)); g.addColorStop(1, outer);
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400); ctx.restore();
  }
  function glow(ctx, x, y, r, col, a = 1) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  }
  function door(ctx, x, y, w, h, o = {}) {
    G.rrect(ctx, x - 24, y - 24, w + 48, h + 24, 6, { fill: '#3A3048', lw: 5, seed: 20 });
    G.rrect(ctx, x, y, w, h, 4, { fill: o.fill || '#5B4632', lw: 5, seed: 21, hatch: { color: 'rgba(0,0,0,0.25)', gap: 9, angle: 1.5 } });
    G.rrect(ctx, x + w * 0.12, y + h * 0.07, w * 0.76, h * 0.36, 6, { fill: 'rgba(0,0,0,0.12)', lw: 3, seed: 22 });
    G.rrect(ctx, x + w * 0.12, y + h * 0.5, w * 0.76, h * 0.42, 6, { fill: 'rgba(0,0,0,0.12)', lw: 3, seed: 23 });
    G.ellipse(ctx, x + w * 0.86, y + h * 0.5, 16, 16, { fill: '#C9A24A', lw: 3, seed: 24 });
    if (o.number) G.text(ctx, o.number, x + w / 2, y + h * 0.05 + 60, { size: 54, fam: 'Bungee', color: '#C9A24A', align: 'center' });
  }
  function note(ctx, x, y, w, h, rot, text, reveal = 1, size = 52, seed = 1) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    G.tornPaper(ctx, -w / 2, -h / 2, w, h, { fill: '#EDE4CF', seed, shadow: true });
    if (text && reveal > 0) {
      const lines = text.split('\n');
      const total = lines.reduce((a, l) => a + l.length, 0);
      let used = 0;
      lines.forEach((l, k) => {
        const ly = -h / 2 + h * 0.3 + k * size * 1.15 - ((lines.length - 1) * size * 1.15) / 2 + h * 0.2;
        const p = clamp((reveal * total - used) / l.length);
        used += l.length;
        if (p <= 0) return;
        const lw = G.measure(ctx, l, size, 'Gochi Hand', 400);
        ctx.save(); ctx.beginPath(); ctx.rect(-lw / 2 - 10, ly - size, (lw + 20) * p, size * 1.5); ctx.clip();
        G.text(ctx, l, 0, ly, { size, fam: 'Gochi Hand', weight: 400, color: '#2A1E1E', align: 'center' });
        ctx.restore();
      });
    }
    ctx.restore();
  }
  function clock(ctx, x, y, s, str, colon = true) {
    G.rrect(ctx, x - 230 * s, y - 95 * s, 460 * s, 190 * s, 26 * s, { fill: '#121018', lw: 5, seed: 40 });
    glow(ctx, x, y, 300 * s, 'rgba(255,40,40,0.45)');
    const txt = colon ? str : str.replace(':', ' ');
    G.text(ctx, txt, x, y + 52 * s, { size: 150 * s, fam: 'Bungee', color: '#FF3B3B', align: 'center' });
  }
  function phone(ctx, x, y, s, rot, screen, ringing = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    G.rrect(ctx, -70, -130, 140, 260, 22, { fill: '#1B1B22', lw: 4, seed: 50 });
    ctx.fillStyle = screen || '#5D7BFF'; ctx.fillRect(-58, -112, 116, 222);
    if (ringing) {
      G.text(ctx, 'DESCONHECIDO', 0, -40, { size: 15, fam: 'Bungee', color: '#fff', align: 'center' });
      G.ellipse(ctx, -30, 70, 18, 18, { fill: '#E04848', lw: 2, seed: 51 });
      G.ellipse(ctx, 30, 70, 18, 18, { fill: '#3DBB6A', lw: 2, seed: 52 });
    }
    ctx.restore();
    if (screen) glow(ctx, x, y, 330 * s, 'rgba(120,150,255,0.55)');
  }
  // the thing: a tall, thin shadow with white eyes
  function figure(ctx, x, y, s, alpha, o = {}) {
    if (alpha <= 0) return;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.lean || 0);
    const col = '#06050A';
    const sway = Math.sin(G.t * 1.3) * 6;
    G.poly(ctx, [[-60, 0], [-48, -420], [-70, -560], [70, -560], [48, -420], [60, 0]], { fill: col, stroke: col, lw: 4, seed: 60, amp: 6 });
    G.limb(ctx, [[-62, -540], [-110 + sway, -330], [-100 + sway, -120]], { color: col, lw: 22, outline: col });
    G.limb(ctx, [[62, -540], [110 - sway, -330], [o.reach ? 180 : 100 - sway, o.reach ? -420 : -120]], { color: col, lw: 22, outline: col });
    G.ellipse(ctx, 0, -640, 62, 86, { fill: col, stroke: col, lw: 4, seed: 61, amp: 5 });
    const e = o.eyes == null ? 1 : o.eyes;
    if (e > 0) {
      for (const sd of [-1, 1]) {
        G.ellipse(ctx, sd * 24, -650, 13, 6 + 6 * e, { fill: '#F4F1E6', stroke: '#F4F1E6', lw: 1, seed: 62 + sd });
      }
      ctx.globalAlpha = alpha * 0.6;
      glow(ctx, 0, -650, 90, 'rgba(255,255,240,0.6)');
    }
    ctx.restore();
  }
  // security-camera look: desaturate, green tint, scanlines, REC + timestamp
  function cctv(ctx, t, stamp) {
    ctx.save();
    ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#A9D9B6'; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    for (let y = (t * 60) % 6; y < H; y += 6) ctx.fillRect(0, y, W, 2);
    const band = ((t * 0.35) % 1.3) * H;
    ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(0, band, W, 90);
    ctx.restore();
    G.decor(() => {
      if (Math.floor(t * 1.6) % 2 === 0) G.ellipse(ctx, SAFE.x + 30, SAFE.y + 40, 16, 16, { fill: '#FF3030', lw: 0, seed: 70 });
      G.text(ctx, 'REC', SAFE.x + 60, SAFE.y + 56, { size: 40, fam: 'Bungee', color: '#EDEDED' });
      G.text(ctx, stamp, SAFE.x + 20, SAFE.y + 112, { size: 34, fam: 'Bungee', color: '#EDEDED' });
      G.text(ctx, 'CAM 01', W - 180, SAFE.y + 56, { size: 34, fam: 'Bungee', color: '#EDEDED', align: 'right' });
    });
    // frame brackets
    ctx.save(); ctx.strokeStyle = 'rgba(240,240,240,0.7)'; ctx.lineWidth = 5;
    const m = 60, L = 70, y0 = SAFE.y - 30, y1 = SAFE.y + SAFE.h + 30;
    for (const [x, y, dx, dy] of [[m, y0, 1, 1], [W - m, y0, -1, 1], [m, y1, 1, -1], [W - m, y1, -1, -1]]) {
      ctx.beginPath(); ctx.moveTo(x, y + dy * L); ctx.lineTo(x, y); ctx.lineTo(x + dx * L, y); ctx.stroke();
    }
    ctx.restore();
  }
  const stampAt = (t, base) => { const s = Math.floor(base + t); return `03:${String(17 + Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
  function glitch(ctx, amount, t) {
    if (amount <= 0.01) return;
    const c = ctx.canvas;
    for (let k = 0; k < 7; k++) {
      const y = U.hash(Math.floor(t * 24), k, 5) * H, h = 20 + U.hash(Math.floor(t * 24), k, 6) * 120;
      const dx = (U.hash(Math.floor(t * 24), k, 7) - 0.5) * 160 * amount;
      ctx.drawImage(c, 0, y, W, h, dx, y, W, h);
    }
    ctx.fillStyle = `rgba(255,255,255,${0.08 * amount})`; ctx.fillRect(0, 0, W, H);
  }
  function apartment(ctx, o = {}) {
    wall(ctx, '#252C48', '#171C33', '#2B2433');
    // window with city
    const wx = o.wx == null ? 640 : o.wx, wy = 560, ww = 340, wh = 420;
    G.rrect(ctx, wx - 14, wy - 14, ww + 28, wh + 28, 6, { fill: '#3B344A', lw: 5, seed: 30 });
    const g = ctx.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#0B1030'); g.addColorStop(1, '#27305C');
    ctx.fillStyle = g; ctx.fillRect(wx, wy, ww, wh);
    G.ellipse(ctx, wx + ww * 0.72, wy + 90, 34, 34, { fill: '#F2EBD0', lw: 3, seed: 31 });
    for (let k = 0; k < 6; k++) {
      const bx = wx + k * 60, bh = 80 + U.hash(k, 3) * 140;
      ctx.fillStyle = '#0A0D22'; ctx.fillRect(bx, wy + wh - bh, 52, bh);
      ctx.fillStyle = '#F2C66B'; if (U.hash(k, 9) > 0.4) ctx.fillRect(bx + 14, wy + wh - bh + 22, 10, 14);
    }
    G.line(ctx, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], { lw: 8, color: '#3B344A', seed: 32 });
    G.line(ctx, [[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], { lw: 8, color: '#3B344A', seed: 33 });
  }
  function box(ctx, x, y, w, h, seed) {
    G.rrect(ctx, x - w / 2, y - h, w, h, 6, { fill: '#A87E52', lw: 4, seed, hatch: { color: 'rgba(0,0,0,0.18)', gap: 8 } });
    G.line(ctx, [[x - w / 2, y - h + 18], [x + w / 2, y - h + 18]], { lw: 3, seed: seed + 1 });
    G.rrect(ctx, x - 22, y - h - 2, 44, 24, 3, { fill: '#D9C38F', lw: 2, seed: seed + 2 });
  }
  function bed(ctx, x, y) {
    G.rrect(ctx, x - 330, y - 230, 50, 250, 10, { fill: '#4A3A30', lw: 5, seed: 80 });
    G.rrect(ctx, x - 300, y - 120, 640, 120, 18, { fill: '#33405E', lw: 5, seed: 81, hatch: { color: 'rgba(0,0,0,0.2)', gap: 9 } });
    G.rrect(ctx, x - 280, y - 170, 180, 70, 30, { fill: '#D9D3C4', lw: 4, seed: 82 });
  }
  function table(ctx, x, y, w) {
    G.rrect(ctx, x - w / 2, y, w, 34, 6, { fill: '#5B4632', lw: 5, seed: 90, hatch: { color: 'rgba(0,0,0,0.2)', gap: 8 } });
    for (const sd of [-1, 1]) G.rrect(ctx, x + sd * (w / 2 - 50) - 14, y + 34, 28, FLOOR - y - 34, 4, { fill: '#4A3A2A', lw: 4, seed: 91 + sd });
  }
  function lamp(ctx, x, y, on = 1) {
    G.line(ctx, [[x, 0], [x, y - 60]], { lw: 4, seed: 95 });
    G.poly(ctx, [[x - 70, y], [x - 34, y - 70], [x + 34, y - 70], [x + 70, y]], { fill: '#C9B37A', lw: 4, seed: 96 });
    if (on) glow(ctx, x, y + 120, 520, `rgba(255,214,140,${0.45 * on})`);
  }
  function hallway(ctx, t, flicker = true) {
    ctx.fillStyle = '#141829'; ctx.fillRect(0, 0, W, H);
    const vx = W / 2, vy = 820, bw = 230, bh = 300;
    const back = [[vx - bw / 2, vy - bh / 2], [vx + bw / 2, vy - bh / 2], [vx + bw / 2, vy + bh / 2], [vx - bw / 2, vy + bh / 2]];
    G.poly(ctx, [[0, 0], back[0], back[3], [0, H]], { fill: '#262D48', lw: 5, seed: 100, hatch: { color: 'rgba(0,0,0,0.2)', gap: 12 } });
    G.poly(ctx, [[W, 0], back[1], back[2], [W, H]], { fill: '#222844', lw: 5, seed: 101, hatch: { color: 'rgba(0,0,0,0.2)', gap: 12 } });
    G.poly(ctx, [[0, H], back[3], back[2], [W, H]], { fill: '#2C2533', lw: 5, seed: 102, hatch: { color: 'rgba(0,0,0,0.25)', gap: 10, angle: 0.2 } });
    G.poly(ctx, [[0, 0], back[0], back[1], [W, 0]], { fill: '#1B2035', lw: 5, seed: 103 });
    G.poly(ctx, back, { fill: '#1A1E33', lw: 5, seed: 104 });
    // doors on both walls (perspective)
    for (const [k, sd] of [[0, -1], [1, 1], [2, -1], [3, 1]]) {
      const d = k < 2 ? 0.3 : 0.62; // depth 0 (near) .. 1 (far)
      const xNear = sd < 0 ? lerp(0, back[0][0], d) : lerp(W, back[1][0], d);
      const xFar = sd < 0 ? lerp(0, back[0][0], d + 0.16) : lerp(W, back[1][0], d + 0.16);
      const yTop = (x) => lerp(0, vy - bh / 2, Math.abs(x - (sd < 0 ? 0 : W)) / Math.abs((sd < 0 ? back[0][0] : back[1][0]) - (sd < 0 ? 0 : W)));
      const yBot = (x) => lerp(H, vy + bh / 2, Math.abs(x - (sd < 0 ? 0 : W)) / Math.abs((sd < 0 ? back[0][0] : back[1][0]) - (sd < 0 ? 0 : W)));
      const top = (x) => lerp(yTop(x), yBot(x), 0.28);
      G.poly(ctx, [[xNear, top(xNear)], [xFar, top(xFar)], [xFar, yBot(xFar)], [xNear, yBot(xNear)]], { fill: '#4C3B2C', lw: 4, seed: 110 + k });
    }
    const on = flicker ? (noise1(t * 6, 4) > -0.55 ? 1 : 0.35) : 1;
    G.ellipse(ctx, vx, 330, 70, 18, { fill: on > 0.5 ? '#FFF3C4' : '#7A7560', lw: 3, seed: 120 });
    light(ctx, vx, 520, 1100 * on + 300, '#D8DAF0', '#0E1024');
  }

  // captions: the spoken words, 3-4 at a time, current word in yellow
  function captions(ctx, t) {
    if (t >= S.END) return;
    const i = S.sceneAt(t);
    const sc = SC[i];
    if (!sc || t < sc.t0 - 0.05 || t > sc.t1 + 0.35) return;
    const ws = sc.words;
    const groups = [];
    let cur = [];
    ws.forEach((w, k) => { cur.push(w); const brk = /[.,:!?]$/.test(SC[i].text.split(/\s+/)[k] || '') ; if (cur.length >= 3 || brk) { groups.push(cur); cur = []; } });
    if (cur.length) groups.push(cur);
    let g = groups[0];
    for (const gr of groups) if (t >= gr[0].t - 0.05) g = gr;
    const size = 74;
    const strs = g.map((w) => w.w.toUpperCase());
    const full = strs.join(' ');
    const total = G.measure(ctx, full, size, 'Bungee', 400);
    const scale = Math.min(1, (SAFE.w - 40) / total);
    const y = 1330;
    const pop = ease.outBack(clamp((t - g[0].t + 0.05) / 0.16), 2.4);
    ctx.save(); ctx.translate(W / 2 - 50, y); ctx.scale(scale * (0.85 + 0.15 * pop), scale * (0.85 + 0.15 * pop));
    let x = -total / 2;
    g.forEach((w, k) => {
      const str = strs[k] + (k < g.length - 1 ? ' ' : '');
      const active = t >= w.t && t < (g[k + 1] ? g[k + 1].t : w.end + 0.3);
      G.text(ctx, strs[k], x, 0, { size, fam: 'Bungee', weight: 400, color: active ? '#FFD84A' : '#FFFFFF', stroke: '#000000', strokeW: 14, boil: false });
      x += G.measure(ctx, str, size, 'Bungee', 400);
    });
    ctx.restore();
  }

  // ---------------------------------------------------------------- scenes (u = time since the cut)
  const SCENES = [
    // 0: the door at 3:17, a note slides in
    (ctx, t, u) => {
      const z = lerp(1, 1.12, clamp(u / 7.5));
      ctx.save(); ctx.translate(W / 2, 1100); ctx.scale(z, z); ctx.translate(-W / 2, -1100);
      wall(ctx, '#1F2540', '#121629', '#211B27');
      door(ctx, 250, 520, 580, 980, { number: '302' });
      // light under the door, feet passing
      ctx.fillStyle = '#FFE7A6'; ctx.fillRect(250, FLOOR - 6, 580, 10);
      glow(ctx, 540, FLOOR + 10, 420, 'rgba(255,220,140,0.35)');
      const fx = lerp(-150, 1000, clamp((u - 0.9) / 1.8));
      if (u > 0.9 && u < 2.8) { ctx.fillStyle = '#121018'; ctx.fillRect(fx, FLOOR - 6, 70, 10); ctx.fillRect(fx + 110, FLOOR - 6, 70, 10); }
      const p = ease.outCubic(clamp((u - ev.noteUnderDoor) / 1.0));
      if (u > ev.noteUnderDoor) note(ctx, 540, lerp(FLOOR - 4, FLOOR + 150, p), lerp(260, 380, p), lerp(30, 240, p), lerp(0, -0.12, p), '', 0, 40, 3);
      light(ctx, 540, FLOOR, 1400, '#C7CBEF', '#101226');
      ctx.restore();
      clock(ctx, W - 260, SAFE.y + 330, 0.55, '3:17', Math.floor(t * 2) % 2 === 0);
      const ti = clamp(u / 0.4) * (1 - clamp((u - 3.6) / 0.5));
      if (ti > 0) G.decor(() => {
        G.text(ctx, 'OS BILHETES', W / 2 - 70, SAFE.y + 120, { size: 92, fam: 'Bungee', color: '#F4EEE0', align: 'center', alpha: ti, stroke: '#000', strokeW: 10 });
        G.text(ctx, 'DAS 3H17', W / 2 - 70, SAFE.y + 230, { size: 110, fam: 'Bungee', color: '#FF3B3B', align: 'center', alpha: ti, stroke: '#000', strokeW: 10 });
      });
    },
    // 1: she moves in, carrying a box
    (ctx, t, u, d) => {
      apartment(ctx);
      box(ctx, 860, FLOOR, 170, 140, 140); box(ctx, 900, FLOOR - 140, 130, 100, 143);
      const wk = Ch.walk(u, { x0: -160, speed: 190, t0: 0, s: 1.55 });
      const stopX = 420, x = Math.min(wk.x, stopX), walking = wk.x < stopX;
      const sh = -322 * 1.55;
      her(ctx, { x, y: FLOOR + 30, pose: walking ? 'walk' : 'stand', walk: wk.walk, handL: [-70, -270], handR: [70, -270], look: walking ? 0.3 : Math.sin(u * 1.4) * 0.8, mouth: walking ? 'flat' : 'smile' });
      box(ctx, x, FLOOR + 30 - 1.55 * 230, 230, 170, 150);
      light(ctx, 810, 760, 1400);
    },
    // 2: the first note, close up, words written as they are spoken
    (ctx, t, u) => {
      ctx.fillStyle = '#1A1D2E'; ctx.fillRect(0, 0, W, H);
      G.hatch(ctx, [0, 0, 0 + W, 0 + H], { color: 'rgba(255,255,255,0.04)', gap: 12 });
      glow(ctx, W / 2, 860, 700, 'rgba(255,214,140,0.35)');
      const [sx, sy] = shake(t, 4, 8);
      const open = ease.outBack(clamp(u / 0.6), 1.5);
      const rev = clamp((t - ev.firstNoteText) / 2.4);
      note(ctx, W / 2 + sx, 880 + sy, 820 * open, 560, -0.04 + sx * 0.003, 'Você esqueceu\na janela aberta.', rev, 78, 5);
      for (const sd of [-1, 1]) G.ellipse(ctx, W / 2 + sd * 420 + sx, 1030 + sy, 70, 95, { fill: HER.skin, lw: 5, seed: 150 + sd });
      light(ctx, W / 2, 860, 1300, '#F2E2C6', '#14162A');
    },
    // 3: the window is open, curtains in the wind
    (ctx, t, u) => {
      wall(ctx);
      const wx = 260, wy = 380, ww = 560, wh = 700;
      G.rrect(ctx, wx - 18, wy - 18, ww + 36, wh + 36, 6, { fill: '#3B344A', lw: 5, seed: 30 });
      const g = ctx.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#080C26'); g.addColorStop(1, '#27305C');
      ctx.fillStyle = g; ctx.fillRect(wx, wy, ww, wh);
      G.ellipse(ctx, wx + 400, wy + 150, 60, 60, { fill: '#F2EBD0', lw: 3, seed: 31 });
      glow(ctx, wx + 400, wy + 150, 260, 'rgba(230,230,255,0.35)');
      // open pane swung in
      G.poly(ctx, [[wx + ww, wy], [wx + ww + 120, wy + 60], [wx + ww + 120, wy + wh - 60], [wx + ww, wy + wh]], { fill: 'rgba(160,190,230,0.25)', lw: 5, seed: 34 });
      for (const sd of [-1, 1]) {
        const base = sd < 0 ? wx - 30 : wx + ww + 30;
        const pts = [];
        for (let k = 0; k <= 12; k++) {
          const yy = wy - 40 + (k / 12) * (wh + 120);
          const wave = Math.sin(t * 3.2 + k * 0.6 + sd) * 40 * (k / 12) + (sd < 0 ? 90 : -90) * (k / 12) * (0.6 + 0.4 * Math.sin(t * 1.7));
          pts.push([base + wave, yy]);
        }
        const inner = pts.map(([x, y]) => [x + sd * -130, y]).reverse();
        G.poly(ctx, [...pts, ...inner], { fill: '#8A9BC4', lw: 4, seed: 160 + sd, step: 30, hatch: { color: 'rgba(0,0,0,0.15)', gap: 9, angle: 1.4 } });
      }
      for (let k = 0; k < 5; k++) { const p = ((t * 0.6 + k * 0.2) % 1); G.line(ctx, [[wx + ww * p, wy + 200 + k * 90], [wx + ww * p + 130, wy + 210 + k * 90]], { lw: 3, color: `rgba(220,230,255,${0.5 * Math.sin(Math.PI * p)})`, seed: 170 + k }); }
      const x = lerp(1250, 760, ease.outCubic(clamp(u / 2.4)));
      const wk = Ch.walk(u, { x0: 0, speed: 200, s: 1.55 });
      const shocked = t > SC[3].words[6].t;
      her(ctx, { x, y: FLOOR + 40, pose: u < 2.4 ? 'walk' : 'stand', walk: wk.walk, look: -0.7, eyes: shocked ? 'wide' : 'normal', brows: shocked ? 'worried' : 'neutral', mouth: shocked ? 'o' : 'flat', sweat: shocked ? 0.6 : 0 });
      light(ctx, wx + 400, wy + 150, 1500, '#D3DAF5', '#0F1228');
    },
    // 4: the hallway, looking for the prankster
    (ctx, t, u) => {
      hallway(ctx, t);
      const look = Math.sin(u * 1.6) * 0.9;
      her(ctx, { x: W / 2 - 30, y: FLOOR + 60, s: 1.45, look, headRot: look * 0.08, brows: u > 3.2 ? 'worried' : 'determined', mouth: 'flat' });
    },
    // 5: more notes, one per sentence
    (ctx, t, u) => {
      ctx.fillStyle = '#2A2230'; ctx.fillRect(0, 0, W, H);
      G.hatch(ctx, [0, 0, 0 + W, 0 + H], { color: 'rgba(0,0,0,0.25)', gap: 14, angle: 0.1 });
      for (let k = 0; k < 9; k++) G.line(ctx, [[0, 300 + k * 190], [W, 290 + k * 190]], { lw: 3, color: 'rgba(0,0,0,0.35)', seed: 180 + k });
      G.rrect(ctx, -40, 120, W + 80, 120, 8, { fill: '#5B4632', lw: 5, seed: 189 });
      ctx.fillStyle = '#FFE7A6'; ctx.fillRect(0, 236, W, 8);
      const texts = ['Não deixe o\ngás ligado.', 'Tranque a porta\ndos fundos.', 'Não atenda o\ntelefone hoje.'];
      const pos = [[380, 560, -0.12], [640, 880, 0.08], [420, 1200, -0.05]];
      ev.notes3.forEach((tn, k) => {
        const p = ease.outCubic(clamp((t - tn + 0.3) / 0.6));
        if (p <= 0) return;
        const [x, y, r] = pos[k];
        note(ctx, x, lerp(250, y, p), 520, 300, r * p, texts[k], clamp((t - tn) / 1.4), 50, 20 + k);
      });
      light(ctx, W / 2, 240, 1700, '#E9DDC2', '#141224');
    },
    // 6: the phone rings at night
    (ctx, t, u) => {
      wall(ctx, '#1C2240', '#111428', '#1F1A26');
      bed(ctx, 560, FLOOR);
      G.rrect(ctx, 30, FLOOR - 260, 200, 260, 8, { fill: '#4A3A30', lw: 5, seed: 200 });
      const ring = t >= ev.phoneRing;
      const [sx, sy] = ring ? shake(t, 5, 40) : [0, 0];
      her(ctx, { x: 560, y: FLOOR - 120, pose: 'sit', s: 1.25, blanket: true, look: -0.8, eyes: ring ? 'wide' : 'sleep', mouth: ring ? 'o' : 'sleep', brows: ring ? 'worried' : 'neutral', blink: 0 });
      G.rrect(ctx, 260, FLOOR - 150, 640, 150, 18, { fill: '#33405E', lw: 5, seed: 205, hatch: { color: 'rgba(0,0,0,0.2)', gap: 9 } });
      phone(ctx, 130 + sx, FLOOR - 310 + sy, 0.7, -0.3, ring ? '#5D7BFF' : '#222', ring);
      if (ring) for (let k = 0; k < 3; k++) { const p = ((t * 1.4 + k / 3) % 1); ctx.save(); ctx.strokeStyle = `rgba(150,180,255,${1 - p})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(130, FLOOR - 310, 90 + p * 260, -1.9, -0.5); ctx.stroke(); ctx.restore(); }
      light(ctx, 130, FLOOR - 310, ring ? 1300 : 700, '#C9D4FF', '#0B0D1E');
    },
    // 7: she hugs her knees while it keeps ringing
    (ctx, t, u, d) => {
      wall(ctx, '#1C2240', '#111428', '#1F1A26');
      her(ctx, { x: W / 2, y: FLOOR - 160, pose: 'sit', s: 1.6, knee: [1, 1], handL: [-40, 20], handR: [40, 20], look: 0.6, lookY: 0.4, eyes: 'wide', brows: 'worried', mouth: 'wavy', sweat: 1 });
      const [sx, sy] = shake(t, 7, 45);
      phone(ctx, 830 + sx, FLOOR + 60 + sy, 0.9, 0.25, '#5D7BFF', true);
      const mins = 17 + Math.min(10, Math.floor(u * 3.3));
      clock(ctx, W / 2 - 40, SAFE.y + 150, 0.5, `3:${mins}`);
      light(ctx, 830, FLOOR, 1500, '#C9D4FF', '#0B0D1E');
    },
    // 8: she decides to find out, holding a camera
    (ctx, t, u) => {
      apartment(ctx, { wx: 680 });
      const z = lerp(1, 1.18, ease.inOutQuad(clamp(u / 4)));
      ctx.save(); ctx.translate(W / 2, 900); ctx.scale(z, z); ctx.translate(-W / 2, -900);
      her(ctx, { x: 470, y: FLOOR + 60, handR: [110, -360], brows: 'determined', mouth: 'flat', look: 0.4 });
      const cx = 470 + 110 * 1.55, cy = FLOOR + 60 - 360 * 1.55;
      G.rrect(ctx, cx - 60, cy - 48, 130, 80, 14, { fill: '#E9E6DE', lw: 4, seed: 210 });
      G.ellipse(ctx, cx + 70, cy - 8, 30, 30, { fill: '#1D1D26', lw: 4, seed: 211 });
      G.ellipse(ctx, cx + 76, cy - 14, 8, 8, { fill: '#9CC1FF', lw: 0, seed: 212 });
      ctx.restore();
      light(ctx, 780, 700, 1500);
    },
    // 9: the camera on the wall, aimed at the door
    (ctx, t, u) => {
      wall(ctx, '#1F2540', '#121629', '#211B27');
      door(ctx, 330, 700, 480, 800);
      const on = u > 0.5;
      ctx.save(); ctx.globalAlpha = on ? 0.18 + 0.05 * Math.sin(t * 3) : 0; ctx.fillStyle = '#FF6060';
      ctx.beginPath(); ctx.moveTo(210, 440); ctx.lineTo(300, FLOOR); ctx.lineTo(860, FLOOR); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.save(); ctx.translate(200, 420); ctx.rotate(0.55 + Math.sin(u * 0.8) * 0.06);
      G.rrect(ctx, -60, -50, 200, 100, 18, { fill: '#E9E6DE', lw: 5, seed: 220 });
      G.ellipse(ctx, 140, 0, 38, 38, { fill: '#1D1D26', lw: 4, seed: 221 });
      ctx.restore();
      G.rrect(ctx, 120, 330, 60, 120, 6, { fill: '#BEBAB0', lw: 4, seed: 222 });
      if (on && Math.floor(t * 2) % 2 === 0) { G.ellipse(ctx, 215, 395, 12, 12, { fill: '#FF2A2A', lw: 0, seed: 223 }); glow(ctx, 215, 395, 80, 'rgba(255,40,40,0.8)'); }
      light(ctx, 300, 500, 1600);
    },
    // 10: the clock flips to 3:17, the note comes again
    (ctx, t, u) => {
      ctx.fillStyle = '#0B0A12'; ctx.fillRect(0, 0, W, H);
      const flipped = t >= ev.clockFlip;
      const kick = flipped ? 1 + 0.08 * pulse(t, ev.clockFlip, 9) : 1;
      clock(ctx, W / 2, 760, 1.6 * kick, flipped ? '3:17' : '3:16');
      if (flipped) {
        const p = ease.outCubic(clamp((t - ev.clockFlip - 1.2) / 0.8));
        ctx.fillStyle = '#FFE7A6'; ctx.fillRect(140, 1250, 800, 8);
        if (p > 0) note(ctx, 540, lerp(1254, 1380, p), lerp(200, 320, p), lerp(24, 170, p), -0.1 * p, '', 0, 40, 33);
      }
    },
    // 11: she checks the recording, her face lit by the phone
    (ctx, t, u) => {
      ctx.fillStyle = '#0C0D18'; ctx.fillRect(0, 0, W, H);
      const frozen = t >= ev.freeze;
      const [sx, sy] = frozen ? shake(t, 6 * Math.exp(-(t - ev.freeze) * 1.5), 40) : [0, 0];
      ctx.save(); ctx.translate(W / 2 + sx, 0 + sy); ctx.scale(2.6, 2.6); ctx.translate(-W / 2, -620);
      her(ctx, { x: W / 2, y: 1260, s: 1.2, gesture: 'phone', lookY: 0.6, eyes: frozen ? 'wide' : 'normal', brows: frozen ? 'worried' : 'neutral', mouth: frozen ? 'o' : 'flat', sweat: frozen ? 1 : 0, shadow: false });
      ctx.restore();
      glow(ctx, W / 2, 1180, 700, 'rgba(110,140,255,0.5)');
      light(ctx, W / 2, 1150, 1100, '#BFD0FF', '#05060E');
    },
    // 12: CCTV: the corridor is empty
    (ctx, t, u) => { hallway(ctx, t, false); cctv(ctx, t, stampAt(u, 4)); },
    // 13: CCTV inside: the note comes FROM INSIDE
    (ctx, t, u) => {
      wall(ctx, '#2A3050', '#1A1F36', '#2B2433');
      door(ctx, 560, 640, 420, 860);
      table(ctx, 230, 1150, 360);
      const p = ease.inOutQuad(clamp((t - ev.inside + 2.2) / 2.4));
      note(ctx, lerp(200, 770, p), lerp(1600, 1520, p), 200, 120, p * 0.4, '', 0, 30, 40);
      light(ctx, W / 2, 400, 1700);
      cctv(ctx, t, stampAt(u, 21));
      if (t >= ev.inside) { const f = Math.exp(-(t - ev.inside) * 7); ctx.fillStyle = `rgba(255,255,255,${0.8 * f})`; ctx.fillRect(0, 0, W, H); }
      if (t >= ev.inside) G.decor(() => { ctx.save(); ctx.strokeStyle = '#FF3030'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(lerp(200, 770, p), 1530, 170, 110, 0, 0, Math.PI * 2 * clamp((t - ev.inside) / 0.5)); ctx.stroke(); ctx.restore(); });
    },
    // 14: rewinding the recording on the phone
    (ctx, t, u, d) => {
      ctx.fillStyle = '#0C0D18'; ctx.fillRect(0, 0, W, H);
      const pw = 760, ph = 1240, px = W / 2 - pw / 2 - 30, py = 300;
      G.rrect(ctx, px - 24, py - 24, pw + 48, ph + 48, 60, { fill: '#18181F', lw: 5, seed: 230 });
      ctx.save(); ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip();
      ctx.translate(px, py); ctx.scale(pw / W, ph / H);
      hallway(ctx, t, false); cctv(ctx, t, stampAt(30 - u * 6, 0));
      ctx.restore();
      const prog = lerp(0.8, 0.35, ease.inOutQuad(clamp(u / (d - 0.4))));
      G.rrect(ctx, px + 40, py + ph - 90, pw - 80, 14, 7, { fill: '#555', lw: 0, seed: 231 });
      G.rrect(ctx, px + 40, py + ph - 90, (pw - 80) * prog, 14, 7, { fill: '#FF3B3B', lw: 0, seed: 232 });
      G.ellipse(ctx, px + 40 + (pw - 80) * prog, py + ph - 83, 20, 20, { fill: '#fff', lw: 3, seed: 233 });
      G.decor(() => G.text(ctx, '◀◀', px + pw / 2, py + ph / 2 + 40, { size: 130, fam: 'Bungee', color: 'rgba(255,255,255,0.85)', align: 'center' }));
      glitch(ctx, 0.5, t);
    },
    // 15: CCTV: herself, sleepwalking
    (ctx, t, u) => {
      apartment(ctx, { wx: 680 });
      table(ctx, 830, 1150, 300);
      const wk = Ch.walk(u, { x0: -120, speed: 70, s: 1.55 });
      const x = Math.min(wk.x, 560);
      her(ctx, { x, y: FLOOR + 40, pose: x < 560 ? 'walk' : 'stand', walk: wk.walk * 0.6, handL: [-60, -420], handR: [60, -430], eyes: 'closed', mouth: 'flat', blink: 0, headRot: 0.08 + Math.sin(t) * 0.03 });
      light(ctx, 820, 700, 1500);
      cctv(ctx, t, stampAt(u, 2));
      if (t >= ev.self && t < ev.self + 0.25) glitch(ctx, 1, t);
    },
    // 16: she writes the notes in her sleep
    (ctx, t, u) => {
      wall(ctx, '#2A2433', '#1A1622', '#2B2433');
      lamp(ctx, W / 2 + 140, 520, 1);
      her(ctx, { x: W / 2, y: 1240, pose: 'sit', s: 1.5, eyes: 'closed', mouth: 'flat', blink: 0, handR: [70 + Math.sin(t * 9) * 25, 10 + Math.cos(t * 13) * 6], handL: [-70, 20], headRot: 0.1, lookY: 0.8 });
      table(ctx, W / 2, 1270, 760);
      note(ctx, W / 2 + 90, 1240, 300, 140, 0.05, 'não olhe...', clamp(((u % 3.2) - 0.2) / 2.5), 34, 50);
      for (let k = 0; k < Math.min(5, Math.floor(u / 1.1)); k++) note(ctx, 260 - k * 6, 1250 - k * 8, 200, 110, -0.2 + k * 0.07, '', 0, 20, 60 + k);
      light(ctx, W / 2 + 140, 760, 1300, '#F2DDB4', '#100C18');
    },
    // 17: relief... for one second
    (ctx, t, u) => {
      apartment(ctx);
      const after = t >= ev.onlyASecond;
      ctx.save(); ctx.translate(W / 2, 0); ctx.scale(1.9, 1.9); ctx.translate(-W / 2, -520);
      her(ctx, { x: W / 2, y: 1300, s: 1.3, eyes: after ? 'normal' : 'happy', mouth: after ? 'flat' : 'smile', brows: after ? 'worried' : 'up', gesture: 'phone', lookY: 0.2, look: after ? Math.sin(t * 5) * 0.6 : 0 });
      ctx.restore();
      if (!after) for (let k = 0; k < 3; k++) { const p = (u * 0.7 + k / 3) % 1; G.ellipse(ctx, W / 2 + 80 + p * 120, 800 - p * 160, 18 + p * 30, 12 + p * 20, { fill: `rgba(230,236,255,${0.5 * (1 - p)})`, lw: 0, seed: 240 + k }); }
      light(ctx, 810, 760, 1400);
    },
    // 18: CCTV: someone else is in the room
    (ctx, t, u) => {
      wall(ctx, '#2A2433', '#1A1622', '#2B2433');
      lamp(ctx, W / 2 + 140, 520, 1);
      const there = t >= ev.someone;
      figure(ctx, W / 2 + 250, 1290, 1.45, there ? 1 : 0, { eyes: 0.6 });
      her(ctx, { x: W / 2 - 60, y: 1240, pose: 'sit', s: 1.4, eyes: 'closed', mouth: 'flat', blink: 0, handR: [70 + Math.sin(t * 9) * 25, 10], handL: [-70, 20], headRot: 0.1 });
      table(ctx, W / 2 - 60, 1270, 760);
      light(ctx, W / 2 + 140, 760, 1300, '#F2DDB4', '#100C18');
      cctv(ctx, t, stampAt(u, 47));
      if (there) glitch(ctx, Math.exp(-(t - ev.someone) * 4) * 1.2, t);
      if (there) { const f = Math.exp(-(t - ev.someone) * 8); ctx.fillStyle = `rgba(255,255,255,${0.85 * f})`; ctx.fillRect(0, 0, W, H); }
    },
    // 19: it leans to her ear and whispers
    (ctx, t, u, d) => {
      ctx.fillStyle = '#0A0910'; ctx.fillRect(0, 0, W, H);
      glow(ctx, 360, 900, 650, 'rgba(255,214,140,0.25)');
      ctx.save(); ctx.translate(W / 2, 0); ctx.scale(1.7, 1.7); ctx.translate(-W / 2, -560);
      her(ctx, { x: 420, y: 1300, pose: 'sit', s: 1.2, eyes: 'closed', mouth: 'flat', blink: 0, headRot: 0.12, shadow: false });
      ctx.restore();
      const lean = ease.inOutQuad(clamp(u / 4));
      figure(ctx, lerp(1150, 900, lean), 1900, 1.6, 1, { lean: -0.35 * lean, eyes: 1, reach: true });
      if (t >= ev.whisper - 0.3) for (let k = 0; k < 4; k++) {
        const p = (u * 0.9 + k / 4) % 1;
        ctx.save(); ctx.strokeStyle = `rgba(200,200,220,${0.5 * (1 - p)})`; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(640, 640, 40 + p * 160, 2.3, 3.6); ctx.stroke(); ctx.restore();
      }
    },
    // 20: the notes were his
    (ctx, t, u) => {
      ctx.fillStyle = '#2A2230'; ctx.fillRect(0, 0, W, H);
      G.hatch(ctx, [0, 0, 0 + W, 0 + H], { color: 'rgba(0,0,0,0.25)', gap: 14, angle: 0.1 });
      note(ctx, W / 2, 900, 640, 380, -0.06, 'Eu estou\naqui.', clamp((u - 0.4) / 2), 80, 70);
      // his shadow grows over the note
      const p = ease.inOutQuad(clamp((t - ev.his + 2.2) / 2.6));
      ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = '#050408';
      ctx.beginPath(); ctx.ellipse(W / 2, lerp(-500, 380, p), 210, 300, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(W / 2 - 260, lerp(-300, 600, p) - 2000, 520, 2000 + 0);
      ctx.restore();
      light(ctx, W / 2, 1100, 1300, '#E9DDC2', '#0C0A14');
    },
    // 21: don't look back
    (ctx, t, u, d) => {
      wall(ctx, '#1D2238', '#10131F', '#1F1A26');
      door(ctx, 600, 520, 380, 980, { fill: '#0A0910' });
      const appear = ease.inOutQuad(clamp((t - ev.dontLook + 0.5) / 2.5));
      figure(ctx, 790, 1490, 1.3, appear, { eyes: clamp((t - ev.dontLook - 1.2) / 0.4) });
      her(ctx, { x: 360, y: FLOOR + 70, s: 1.6, handL: [-40, -235], handR: [40, -235], eyes: 'wide', brows: 'worried', mouth: 'o', sweat: 1, blink: 0, look: 0.05 * Math.sin(t * 30) });
      note(ctx, 360, FLOOR + 70 - 1.6 * 240, 330, 190, -0.04, 'NÃO OLHE\nPRA TRÁS', clamp((t - ev.dontLook) / 1.2), 46, 80);
      light(ctx, 360, 1000, 1200, '#C9CFF2', '#07080F');
    },
  ];

  function endCard(ctx, t) {
    const u = t - S.END;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    // two eyes open in the dark
    const e = clamp((u - 0.8) / 0.25) * (u > 2.6 && u < 2.75 ? 0 : 1);
    if (e > 0) for (const sd of [-1, 1]) { G.ellipse(ctx, W / 2 - 40 + sd * 70, 820, 26, 4 + 12 * e, { fill: '#F4F1E6', stroke: '#F4F1E6', lw: 1, seed: 300 + sd }); glow(ctx, W / 2 - 40 + sd * 70, 820, 120, 'rgba(255,255,240,0.5)'); }
    const a = clamp((u - 1.6) / 0.5);
    if (a > 0) G.text(ctx, 'PARTE 2?', W / 2 - 40, 1120, { size: 120, fam: 'Bungee', color: '#FF3B3B', align: 'center', alpha: a });
    const b = clamp((u - 2.2) / 0.5);
    if (b > 0) G.text(ctx, 'comenta "SIM" 👇', W / 2 - 40, 1230, { size: 60, fam: 'Bungee', color: '#F4EEE0', align: 'center', alpha: b });
  }

  Studio.film({
    draw(ctx, t) {
      if (t >= S.END) { endCard(ctx, t); return; }
      const i = S.sceneAt(t);
      const u = t - S.cuts[i];
      const d = (S.cuts[i + 1] || S.END) - S.cuts[i];
      ctx.save();
      SCENES[i](ctx, t, u, d);
      ctx.restore();
      // a quick dip at every cut so scenes breathe
      const k = Math.max(clamp(1 - u / 0.18), clamp(1 - (d - u) / 0.12));
      if (k > 0 && i > 0) { ctx.fillStyle = `rgba(0,0,0,${0.7 * k})`; ctx.fillRect(0, 0, W, H); }
      if (S.CAPTIONS) captions(ctx, t);
    },
    post: { paper: 0.25, vignette: 0.55, grain: 0.09 },
    fadeOut: 1.2,
  });
})();
