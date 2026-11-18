// Shared drawing kit for the dark-story films (extracted from "Os bilhetes das 3h17").
(function () {
  const U = globalThis.U, G = globalThis.G, Ch = globalThis.Ch, S = globalThis.SCORE;
  const { clamp, lerp, ease, pulse, noise1 } = U;
  const SC = S.SC;
  const W = G.W, H = G.H, SAFE = S.SAFE;
  const FLOOR = 1500;
  const blinkAt = (t, seed) => { const k = Math.floor(t / 2.7); const ph = t - k * 2.7 - U.hash(k, seed) * 2; return ph > 0 && ph < 0.12 ? 1 : 0; };
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

  // a character drawer for any style: const him = L.person(STYLE, 1.55, 310); him(ctx, {x, y, ...})
  const person = (style, s = 1.55, seed = 300) => (ctx, o) => Ch.person(ctx, Object.assign({ pose: 'stand', s, style, mouth: 'flat', blink: blinkAt(G.t, seed), seed }, o));
  // cut to white flash after time t0
  const flash = (ctx, t, t0, k = 7, a = 0.8) => { if (t >= t0) { ctx.fillStyle = `rgba(255,255,255,${a * Math.exp(-(t - t0) * k)})`; ctx.fillRect(0, 0, W, H); } };
  function endCard(ctx, t) {
    const u = t - S.END;
    if (S.mood && S.mood !== 'dark' && S.mood !== 'tense') {
      const g = ctx.createRadialGradient(W / 2, 900, 50, W / 2, 900, 900); g.addColorStop(0, '#F2B84B'); g.addColorStop(1, '#D97757'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const a = ease.outBack(clamp((u - 0.3) / 0.35), 2), b = clamp((u - 1.0) / 0.5);
      if (a > 0) { const f = Math.min(1, (W - 200) / G.measure(ctx, S.endText, 130, 'Bungee', 400)); ctx.save(); ctx.translate(W / 2 - 40, 860); ctx.scale(a * f, a * f); G.text(ctx, S.endText, 0, 0, { size: 130, fam: 'Bungee', color: '#FFFFFF', align: 'center', stroke: '#2A2320', strokeW: 12 }); ctx.restore(); }
      if (b > 0) { G.text(ctx, 'segue pra mais', W / 2 - 40, 1010, { size: 66, fam: 'Bungee', color: '#2A2320', align: 'center', alpha: b }); G.text(ctx, 'histórias 📖', W / 2 - 40, 1090, { size: 66, fam: 'Bungee', color: '#2A2320', align: 'center', alpha: b }); }
      return;
    }
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    const e = clamp((u - 0.8) / 0.25) * (u > 2.6 && u < 2.75 ? 0 : 1);
    if (e > 0) for (const sd of [-1, 1]) { G.ellipse(ctx, W / 2 - 40 + sd * 70, 820, 26, 4 + 12 * e, { fill: '#F4F1E6', stroke: '#F4F1E6', lw: 1, seed: 300 + sd }); glow(ctx, W / 2 - 40 + sd * 70, 820, 120, 'rgba(255,255,240,0.5)'); }
    const a = clamp((u - 1.6) / 0.5);
    if (a > 0) G.text(ctx, S.endText, W / 2 - 40, 1120, { size: 120, fam: 'Bungee', color: '#FF3B3B', align: 'center', alpha: a });
    const b = clamp((u - 2.2) / 0.5);
    if (b > 0) G.text(ctx, 'comenta "SIM" 👇', W / 2 - 40, 1230, { size: 60, fam: 'Bungee', color: '#F4EEE0', align: 'center', alpha: b });
  }
  // the standard film wrapper: scenes[i](ctx, t, u, d), a dip at each cut, optional captions, end card
  function run(SCENES) {
    globalThis.Studio.film({
      draw(ctx, t) {
        if (t >= S.END) { endCard(ctx, t); return; }
        const i = S.sceneAt(t), u = t - S.cuts[i], d = (S.cuts[i + 1] || S.END) - S.cuts[i];
        ctx.save(); SCENES[i](ctx, t, u, d); ctx.restore();
        const k = Math.max(clamp(1 - u / 0.18), clamp(1 - (d - u) / 0.12));
        if (k > 0 && i > 0) { ctx.fillStyle = `rgba(0,0,0,${0.7 * k})`; ctx.fillRect(0, 0, W, H); }
        if (S.CAPTIONS) captions(ctx, t);
      },
      post: { paper: 0.25, vignette: 0.55, grain: 0.09 },
      fadeOut: 1.2,
    });
  }
  const prog = (t, t0, dur, hold = 0.4) => {
    const i = S.sceneAt(t), s0 = S.cuts[i], end = (S.cuts[i + 1] || S.END) - hold;
    const d = Math.max(0.2, Math.min(dur, end - s0));
    const a = Math.max(s0, Math.min(t0, end - d));
    return clamp((t - a) / d);
  };
  globalThis.L = { prog, endCard, run, FLOOR, W, H, SAFE, blinkAt, person, shake, wall, light, glow, door, note, clock, phone, figure, cctv, stampAt, glitch, apartment, box, bed, table, lamp, hallway, captions, flash };
})();
