// Scene kit: builds whole films from data (story.js -> STORY.scenes). Needs lib.js (L) loaded first.
// Scene spec: { tpl: 'room'|'close'|'phone'|'note'|'big'|'photo'|'icon'|'clock', ...params }
// Times: `at` is a spoken word of that scene ('telefone', or ['nao', 2] for the 2nd one) or a number of seconds after the cut.
(function () {
  const U = globalThis.U, G = globalThis.G, Ch = globalThis.Ch, S = globalThis.SCORE, L = globalThis.L, ST = globalThis.STORY;
  const { clamp, lerp, ease, pulse, noise1 } = U;
  const W = G.W, H = G.H, SAFE = S.SAFE, FLOOR = L.FLOOR;
  const DARK = S.mood === 'dark' || S.mood === 'tense';

  const at = (i, a) => (a == null ? S.cuts[i] : typeof a === 'number' ? S.cuts[i] + a : Array.isArray(a) ? S.word(i, a[0], a[1]) : S.word(i, a));
  const past = (t, i, a) => a != null && t >= at(i, a);

  // ---------------------------------------------------------------- expressions
  const EXPR = {
    neutral: {}, happy: { eyes: 'happy', mouth: 'smile' }, laugh: { eyes: 'happy', mouth: 'grin' }, love: { eyes: 'happy', mouth: 'smile', blush: 1 },
    smile: { mouth: 'smile' }, sad: { brows: 'worried', mouth: 'wavy', lookY: 0.4 }, cry: { eyes: 'closed', brows: 'worried', mouth: 'wavy', blink: 0 },
    shocked: { eyes: 'wide', brows: 'up', mouth: 'o', blink: 0 }, scared: { eyes: 'wide', brows: 'worried', mouth: 'o', sweat: 1, blink: 0 },
    angry: { brows: 'determined', mouth: 'flat' }, worried: { brows: 'worried', mouth: 'flat' }, sleep: { eyes: 'sleep', mouth: 'sleep', blink: 0 },
    smirk: { mouth: 'smirk' }, determined: { brows: 'determined', mouth: 'flat' }, embarrassed: { blush: 1, mouth: 'wavy', brows: 'worried', sweat: 0.6 },
    talk: { talk: true }, closed: { eyes: 'closed', mouth: 'flat', blink: 0 },
  };
  const exprOpts = (name, t) => { const e = Object.assign({}, EXPR[name] || {}); if (e.talk) { delete e.talk; e.mouth = Math.sin(t * 14) > 0 ? 'open' : 'flat'; } return e; };

  // ---------------------------------------------------------------- settings
  const PAL = {
    night: { top: '#262C48', bot: '#171C33', floor: '#2A2433', inner: '#E4E7FA', outer: '#454A7C' },
    day: { top: '#EAE0CC', bot: '#D4C6AA', floor: '#9C8466', inner: '#FFFFFF', outer: '#C9BCA4' },
    warm: { top: '#E7C9A0', bot: '#C9A27A', floor: '#7A5A44', inner: '#FFF4E0', outer: '#A8805E' },
    dim: { top: '#3A3446', bot: '#262230', floor: '#2E2630', inner: '#F2E0C8', outer: '#4A4050' },
    sunset: { top: '#E8A07A', bot: '#C9786A', floor: '#7A5050', inner: '#FFE8D0', outer: '#9A5A5A' },
  };
  function windowPane(ctx, x, y, w, h, light, t) {
    G.rrect(ctx, x - 14, y - 14, w + 28, h + 28, 6, { fill: '#4A4050', lw: 5, seed: 2001 });
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    const sky = light === 'day' ? ['#8EC5F0', '#D8EEFF'] : light === 'sunset' ? ['#F2A65A', '#F7D9A8'] : light === 'warm' ? ['#2A2F55', '#4A4A7A'] : ['#0A0E24', '#27305C'];
    g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    if (light === 'day') { G.ellipse(ctx, x + w * 0.7, y + 80, 40, 40, { fill: '#FFF2B0', lw: 3, seed: 2002 }); G.ellipse(ctx, x + w * 0.3, y + 140 + Math.sin(t * 0.5) * 4, 60, 22, { fill: '#FFFFFF', lw: 3, seed: 2003 }); }
    else if (light !== 'sunset') G.ellipse(ctx, x + w * 0.72, y + 80, 30, 30, { fill: '#F2EBD0', lw: 3, seed: 2004 });
    G.line(ctx, [[x + w / 2, y], [x + w / 2, y + h]], { lw: 8, color: '#4A4050', seed: 2005 });
    G.line(ctx, [[x, y + h / 2], [x + w, y + h / 2]], { lw: 8, color: '#4A4050', seed: 2006 });
  }
  function couch(ctx, x, y, col = '#5A3E5E') {
    G.rrect(ctx, x - 380, y - 300, 760, 200, 40, { fill: col, lw: 5, seed: 2010 });
    G.rrect(ctx, x - 420, y - 140, 840, 160, 40, { fill: G.tint(col, 0.12), lw: 5, seed: 2011 });
    for (const sd of [-1, 1]) G.rrect(ctx, x + sd * 400 - 50, y - 220, 100, 240, 30, { fill: col, lw: 5, seed: 2012 + sd });
  }
  function counter(ctx, y) {
    G.rrect(ctx, -40, y, W + 80, 60, 6, { fill: '#C9B8A0', lw: 5, seed: 2020 });
    G.rrect(ctx, -40, y + 60, W + 80, FLOOR - y - 60 + 40, 6, { fill: '#7A5A44', lw: 5, seed: 2021, hatch: { color: 'rgba(0,0,0,0.2)', gap: 10 } });
  }
  function desk(ctx, x, y, w = 600) {
    G.rrect(ctx, x - w / 2, y, w, 30, 6, { fill: '#8A6A4E', lw: 5, seed: 2030 });
    for (const sd of [-1, 1]) G.rrect(ctx, x + sd * (w / 2 - 40) - 12, y + 30, 24, FLOOR - y - 30, 4, { fill: '#6A4E38', lw: 4, seed: 2031 + sd });
  }
  function laptop(ctx, x, y, on = true) {
    G.poly(ctx, [[x - 110, y], [x - 90, y - 150], [x + 90, y - 150], [x + 110, y]], { fill: '#3A3A44', lw: 4, seed: 2035 });
    ctx.fillStyle = on ? '#9CC1FF' : '#222'; ctx.fillRect(x - 80, y - 140, 160, 120);
    G.rrect(ctx, x - 130, y - 6, 260, 14, 4, { fill: '#5A5A66', lw: 3, seed: 2036 });
  }
  function tree(ctx, x, y, s, seed) {
    G.rrect(ctx, x - 22 * s, y - 260 * s, 44 * s, 260 * s, 8, { fill: '#6A4A32', lw: 5, seed });
    for (const [dx, dy, r] of [[0, -360, 150], [-110, -290, 110], [110, -290, 110]]) G.ellipse(ctx, x + dx * s, y + dy * s, r * s, r * 0.85 * s, { fill: '#4E8A4E', lw: 5, seed: seed + dx, hatch: { color: 'rgba(0,0,0,0.12)', gap: 9 } });
  }
  function street(ctx, t, light) {
    const day = light === 'day';
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, day ? '#8EC5F0' : light === 'sunset' ? '#E8906A' : '#05071A'); g.addColorStop(1, day ? '#D8EEFF' : light === 'sunset' ? '#F7D0A0' : '#1B1F3A');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let k = 0; k < 4; k++) { const bx = -100 + k * 320, bh = 600 + U.hash(k, 5) * 500; G.rrect(ctx, bx, 1300 - bh, 300, bh, 4, { fill: day ? '#B8B0C8' : '#151A30', lw: 5, seed: 2040 + k });
      for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) { ctx.fillStyle = day ? '#DDEEFF' : U.hash(k, r, c) > 0.75 ? '#F2C66B' : '#0E1124'; ctx.fillRect(bx + 30 + c * 90, 1300 - bh + 40 + r * 110, 50, 60); } }
    G.rrect(ctx, -50, 1300, W + 100, 100, 0, { fill: '#8A8A96', lw: 5, seed: 2050 });
    G.rrect(ctx, -50, 1400, W + 100, 600, 0, { fill: day ? '#55555E' : '#26262E', lw: 5, seed: 2051 });
    for (let k = 0; k < 5; k++) { ctx.fillStyle = '#E8E0B0'; ctx.fillRect(k * 260, 1640, 140, 14); }
  }
  function setBg(ctx, t, set, light) {
    const P = PAL[light] || PAL.night;
    switch (set) {
      case 'street': street(ctx, t, light); break;
      case 'bus': street(ctx, t, light); G.rrect(ctx, 520, 760, 440, 30, 6, { fill: '#3D7A74', lw: 5, seed: 2060 }); for (const x of [540, 940]) G.rrect(ctx, x - 10, 790, 20, 520, 4, { fill: '#5A5A66', lw: 4, seed: 2061 + x });
        G.rrect(ctx, 820, 600, 120, 120, 10, { fill: '#2A4FA8', lw: 5, seed: 2063 }); G.text(ctx, 'ÔNIBUS', 880, 675, { size: 26, fam: 'Bungee', color: '#fff', align: 'center' }); G.rrect(ctx, 580, 1180, 320, 30, 6, { fill: '#8A6A4E', lw: 4, seed: 2064 }); break;
      case 'park': { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, light === 'sunset' ? '#E8906A' : light === 'night' ? '#0A0E24' : '#8EC5F0'); g.addColorStop(1, light === 'sunset' ? '#F7D0A0' : light === 'night' ? '#27305C' : '#D8EEFF');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); tree(ctx, 160, 1350, 1.3, 2070); tree(ctx, 930, 1300, 1.1, 2075);
        G.poly(ctx, [[-50, 1300], [W + 50, 1260], [W + 50, H + 50], [-50, H + 50]], { fill: '#6FA25A', lw: 5, seed: 2080, hatch: { color: 'rgba(0,0,0,0.1)', gap: 10 } });
        G.rrect(ctx, 330, 1300, 420, 30, 6, { fill: '#8A6A4E', lw: 4, seed: 2081 }); G.rrect(ctx, 330, 1220, 420, 24, 6, { fill: '#8A6A4E', lw: 4, seed: 2082 }); break; }
      case 'hallway': L.hallway(ctx, t, light === 'night'); break;
      case 'black': ctx.fillStyle = '#07070C'; ctx.fillRect(0, 0, W, H); break;
      default: {
        L.wall(ctx, P.top, P.bot, P.floor);
        if (set === 'bedroom') { windowPane(ctx, 640, 520, 320, 380, light, t); L.bed(ctx, 560, FLOOR); }
        else if (set === 'living') { windowPane(ctx, 620, 480, 360, 420, light, t); couch(ctx, 540, FLOOR - 10); }
        else if (set === 'kitchen') { for (let r = 0; r < 6; r++) for (let c = 0; c < 9; c++) { ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.strokeRect(c * 120, 700 + r * 90, 120, 90); } G.rrect(ctx, 820, 480, 220, 760, 20, { fill: '#E8E8EE', lw: 5, seed: 2090 }); counter(ctx, 1240); }
        else if (set === 'office') { windowPane(ctx, 600, 440, 380, 400, light, t); desk(ctx, 540, 1180, 700); laptop(ctx, 640, 1180, true); }
        else if (set === 'cafe') { windowPane(ctx, 80, 420, 480, 560, light, t); G.rrect(ctx, 640, 520, 380, 120, 10, { fill: '#3A2A20', lw: 5, seed: 2095 }); G.text(ctx, 'CAFÉ', 830, 605, { size: 64, fam: 'Bungee', color: '#F2C66B', align: 'center' }); counter(ctx, 1240); G.rrect(ctx, 760, 1120, 140, 120, 14, { fill: '#B8BCC6', lw: 5, seed: 2096 }); }
        else if (set === 'door') L.door(ctx, 280, 480, 520, 1020);
        else if (set === 'attic') { ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (let k = 0; k < 4; k++) G.poly(ctx, [[k * 300 - 100, 0], [k * 300 - 40, 0], [k * 300 + 200, 700], [k * 300 + 140, 700]], { fill: '#5A4030', lw: 4, seed: 2100 + k }); G.ellipse(ctx, W / 2, 560, 120, 120, { fill: light === 'day' ? '#FFF2C0' : '#27305C', lw: 6, seed: 2105 }); L.box(ctx, 200, FLOOR, 220, 180, 2106); L.box(ctx, 880, FLOOR, 200, 240, 2110); }
        else if (set === 'school') { G.rrect(ctx, 120, 480, 840, 480, 8, { fill: '#2E4A3A', lw: 8, seed: 2115 }); desk(ctx, 540, 1250, 500); }
        else if (set === 'hospital') { G.rrect(ctx, 760, 560, 240, 180, 10, { fill: '#1A1A20', lw: 5, seed: 2120 }); const k = (t * 1.2) % 1; ctx.strokeStyle = '#57D68D'; ctx.lineWidth = 4; ctx.beginPath(); for (let x = 0; x < 220; x += 4) { const p = (x / 220 + k) % 1; const yy = p > 0.45 && p < 0.55 ? -60 * Math.sin((p - 0.45) * 31) : 0; ctx.lineTo(770 + x, 650 + yy); } ctx.stroke(); L.bed(ctx, 480, FLOOR); }
      }
    }
  }
  function lightFor(ctx, light, x = W / 2, y = 600) {
    const P = PAL[light] || PAL.night;
    L.light(ctx, x, y, light === 'day' ? 2000 : 1500, P.inner, P.outer);
  }

  // ---------------------------------------------------------------- characters
  const castOf = (id) => (ST.cast || {})[id] || {};
  function drawChar(ctx, t, i, c) {
    const st = castOf(c.id);
    let x = c.x == null ? W / 2 : c.x, pose = c.pose || 'stand', walkPh = 0;
    const s = c.s || (pose === 'sit' ? 1.35 : 1.55);
    let y = c.y == null ? (pose === 'sit' ? FLOOR - 140 : pose === 'floor' ? FLOOR - 10 : FLOOR + 40) : c.y;
    let o = { expr: c.expr || 'neutral', gesture: c.gesture, look: c.look || 0, lookY: c.lookY || 0, alpha: 1, hold: c.hold };
    for (const ch of c.then || []) if (past(t, i, ch.at)) Object.assign(o, ch);
    if (c.walk) { const [x0, x1, dur = Math.abs(c.walk[1] - c.walk[0]) / 220] = c.walk; const t0 = at(i, c.walkAt == null ? 0 : c.walkAt); const p = clamp((t - t0) / dur);
      x = lerp(x0, x1, p); if (p > 0 && p < 1) { pose = 'walk'; walkPh = ((t - t0) * 1.6) % 1; } }
    if (c.appear != null) o.alpha *= clamp((t - at(i, c.appear)) / 0.5);
    if (o.alpha <= 0) return null;
    ctx.save(); ctx.globalAlpha *= o.alpha;
    if (st.kind === 'figure') { L.figure(ctx, x, y, c.s || 1.3, 1, { eyes: c.eyes == null ? 1 : c.eyes, lean: c.lean || 0, reach: c.reach }); ctx.restore(); return null; }
    if (st.kind === 'dog') { Ch.dog(ctx, { x, y: y - 10, s: c.s || 1.3, color: st.color, t, happy: o.expr === 'happy', look: o.look, pose: c.pose === 'sit' ? 'sit' : 'stand', bark: o.bark }); ctx.restore(); return null; }
    const e = exprOpts(o.expr, t);
    const p = Object.assign({ mouth: 'flat', x, y, s, pose: pose === 'floor' ? 'floor' : pose, walk: walkPh, style: st, look: o.look, lookY: o.lookY, gesture: o.gesture, blink: L.blinkAt(t, (c.id || 'a').length * 7), seed: 300 + (c.id || 'a').length * 40, shadow: pose !== 'sit' }, e);
    if (c.blanket) p.blanket = true;
    if (o.hold) { p.handR = [70, pose === 'sit' ? -120 : -230]; p.handL = [-40, pose === 'sit' ? -110 : -220]; }
    Ch.person(ctx, p);
    const headY = y - s * (pose === 'sit' ? 254 : pose === 'floor' ? 254 : 404);
    if (o.hold) prop(ctx, o.hold, x + 40 * s, y + (pose === 'sit' ? -130 : -235) * s, s * 0.75, t);
    ctx.restore();
    return { x, y, s, headY, o };
  }
  function overlay(ctx, t, kind, h) {
    if (!h) return;
    const { x, headY, s } = h;
    if (kind === 'tears') for (const sd of [-1, 1]) for (let k = 0; k < 2; k++) { const p = (t * 0.9 + k * 0.5 + (sd > 0 ? 0.25 : 0)) % 1; G.ellipse(ctx, x + sd * 30 * s, headY + 20 * s + p * 90 * s, 7 * s, 10 * s, { fill: `rgba(120,190,255,${1 - p})`, lw: 0, seed: 2200 + k }); }
    if (kind === 'hearts') for (let k = 0; k < 4; k++) { const p = (t * 0.4 + k / 4) % 1; heartShape(ctx, x + Math.sin(t * 2 + k * 2) * 80 + (k - 1.5) * 50, headY - 120 * s - p * 350, 0.6 + 0.3 * Math.sin(Math.PI * p), Math.sin(Math.PI * p)); }
    if (kind === 'zzz') for (let k = 0; k < 3; k++) { const p = (t * 0.4 + k / 3) % 1; G.text(ctx, 'z', x + 80 * s + p * 80, headY - 60 * s - p * 200, { size: 50 + p * 40, fam: 'Bungee', color: `rgba(230,230,255,${Math.sin(Math.PI * p)})` }); }
    if (kind === 'question') G.text(ctx, '?', x + 100 * s, headY - 90 * s + Math.sin(t * 3) * 10, { size: 120, fam: 'Bungee', color: '#F2B84B', stroke: '#000', strokeW: 8 });
    if (kind === 'music') for (let k = 0; k < 4; k++) { const p = (t * 0.35 + k / 4) % 1; G.text(ctx, k % 2 ? '♪' : '♫', x + Math.sin(t + k * 2) * 120, headY - p * 400, { size: 70, fam: 'Bungee', color: `rgba(255,240,200,${Math.sin(Math.PI * p)})`, align: 'center' }); }
    if (kind === 'anger') { G.text(ctx, '#', x + 90 * s, headY - 90 * s, { size: 90, fam: 'Bungee', color: '#E53935' }); }
  }
  function heartShape(ctx, x, y, s, a = 1) { ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); G.poly(ctx, [[0, 50], [-55, -5], [-50, -40], [-20, -50], [0, -25], [20, -50], [50, -40], [55, -5]], { fill: '#E8718D', lw: 5, seed: 2210 }); ctx.restore(); }

  // ---------------------------------------------------------------- props and icons
  function prop(ctx, kind, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (kind === 'cup') { G.rrect(ctx, -45, -60, 90, 110, 12, { fill: '#F4F1EA', lw: 5, seed: 2300 }); G.rrect(ctx, -45, -20, 90, 30, 4, { fill: '#7A4A2E', lw: 0, seed: 2301 }); }
    else if (kind === 'letter') { G.rrect(ctx, -80, -55, 160, 110, 6, { fill: '#F4EEDC', lw: 5, seed: 2305 }); G.line(ctx, [[-80, -55], [0, 5], [80, -55]], { lw: 4, seed: 2306 }); }
    else if (kind === 'flower') { G.line(ctx, [[0, 60], [0, -40]], { lw: 6, color: '#3D7A4A', seed: 2310 }); for (let k = 0; k < 5; k++) { const a = k * 1.256; G.ellipse(ctx, Math.cos(a) * 26, -60 + Math.sin(a) * 26, 22, 22, { fill: '#E8718D', lw: 3, seed: 2311 + k }); } G.ellipse(ctx, 0, -60, 16, 16, { fill: '#F2B84B', lw: 3, seed: 2318 }); }
    else if (kind === 'box') { G.rrect(ctx, -80, -70, 160, 130, 6, { fill: '#A87E52', lw: 5, seed: 2320 }); }
    else if (kind === 'phone') { G.rrect(ctx, -40, -70, 80, 140, 12, { fill: '#1B1B22', lw: 4, seed: 2325 }); ctx.fillStyle = '#5D7BFF'; ctx.fillRect(-32, -60, 64, 118); }
    else if (kind === 'ring') { G.rrect(ctx, -70, -40, 140, 90, 14, { fill: '#8B1E2E', lw: 5, seed: 2330 }); G.ellipse(ctx, 0, -40, 34, 34, { fill: 'rgba(0,0,0,0)', lw: 9, seed: 2331 }); G.star(ctx, 0, -78, 16, { fill: '#BFE6FF', seed: 2332 }); }
    else if (kind === 'book') { G.rrect(ctx, -80, -60, 160, 120, 6, { fill: '#7A3B2E', lw: 5, seed: 2335 }); }
    ctx.restore();
  }
  function icon(ctx, kind, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    switch (kind) {
      case 'ring': G.rrect(ctx, -220, -40, 440, 260, 40, { fill: '#8B1E2E', lw: 8, seed: 2400 }); G.rrect(ctx, -220, -260, 440, 220, 40, { fill: '#A8283A', lw: 8, seed: 2401 }); G.ellipse(ctx, 0, -60, 110, 110, { fill: 'rgba(0,0,0,0)', lw: 26, seed: 2402 }); G.star(ctx, 0, -180, 50, { fill: '#BFE6FF', seed: 2403 }); L.glow(ctx, 0, -180, 260, 'rgba(200,230,255,0.6)'); break;
      case 'envelope': G.rrect(ctx, -300, -200, 600, 400, 14, { fill: '#F4EEDC', lw: 8, seed: 2410 }); G.line(ctx, [[-300, -200], [0, 40], [300, -200]], { lw: 7, seed: 2411 }); G.ellipse(ctx, 0, 40, 46, 46, { fill: '#B01E1E', lw: 5, seed: 2412 }); break;
      case 'heart': heartShape(ctx, 0, 0, 5); break;
      case 'brokenheart': heartShape(ctx, 0, 0, 5); G.line(ctx, [[0, -140], [-40, -40], [30, 40], [-20, 140], [0, 250]], { lw: 14, color: '#2A1E1E', seed: 2415 }); break;
      case 'gift': G.rrect(ctx, -240, -150, 480, 380, 14, { fill: '#3D7A74', lw: 8, seed: 2420 }); G.rrect(ctx, -270, -230, 540, 110, 14, { fill: '#4E9A92', lw: 8, seed: 2421 }); G.rrect(ctx, -40, -230, 80, 460, 4, { fill: '#F2B84B', lw: 6, seed: 2422 }); break;
      case 'cup': G.rrect(ctx, -170, -230, 340, 420, 40, { fill: '#F4F1EA', lw: 8, seed: 2425 }); G.rrect(ctx, -170, -60, 340, 120, 4, { fill: '#C9A27A', lw: 0, seed: 2426 }); G.ellipse(ctx, 210, -20, 70, 90, { fill: 'rgba(0,0,0,0)', lw: 16, seed: 2427 }); for (let k = 0; k < 3; k++) G.line(ctx, [[-80 + k * 80, -260], [-60 + k * 80 + Math.sin(t * 3 + k) * 20, -360], [-80 + k * 80, -460]], { lw: 6, color: 'rgba(255,255,255,0.6)', seed: 2428 + k }); break;
      case 'key': G.ellipse(ctx, -160, 0, 110, 110, { fill: '#C9A24A', lw: 8, seed: 2435 }); G.ellipse(ctx, -160, 0, 45, 45, { fill: '#14112A', lw: 6, seed: 2436 }); G.rrect(ctx, -60, -26, 340, 52, 8, { fill: '#C9A24A', lw: 8, seed: 2437 }); for (const dx of [180, 250]) G.rrect(ctx, dx, 20, 34, 70, 4, { fill: '#C9A24A', lw: 6, seed: 2438 + dx }); break;
      case 'cake': G.rrect(ctx, -260, -60, 520, 260, 30, { fill: '#F2C4CE', lw: 8, seed: 2445 }); G.rrect(ctx, -260, -60, 520, 60, 30, { fill: '#FFFFFF', lw: 6, seed: 2446 }); for (let k = 0; k < 3; k++) { G.rrect(ctx, -110 + k * 100, -170, 26, 110, 6, { fill: '#9CC1FF', lw: 4, seed: 2447 + k }); G.ellipse(ctx, -97 + k * 100, -195, 14, 24 * (1 + 0.15 * Math.sin(t * 13 + k)), { fill: '#FFB347', lw: 0, seed: 2450 + k }); } L.glow(ctx, 0, -195, 300, 'rgba(255,180,70,0.5)'); break;
      case 'trophy': G.poly(ctx, [[-180, -260], [180, -260], [130, 20], [-130, 20]], { fill: '#F2B84B', lw: 8, seed: 2455 }); G.rrect(ctx, -40, 20, 80, 120, 6, { fill: '#C9A24A', lw: 6, seed: 2456 }); G.rrect(ctx, -160, 140, 320, 70, 10, { fill: '#7A3B2E', lw: 6, seed: 2457 }); break;
      case 'mic': G.rrect(ctx, -90, -300, 180, 260, 90, { fill: '#5A5A66', lw: 8, seed: 2460 }); G.line(ctx, [[0, -40], [0, 200]], { lw: 20, color: '#2A2A30', seed: 2461 }); break;
      case 'bone': for (const sd of [-1, 1]) { G.ellipse(ctx, sd * 220, -50, 70, 70, { fill: '#F4EEDC', lw: 8, seed: 2470 + sd }); G.ellipse(ctx, sd * 220, 50, 70, 70, { fill: '#F4EEDC', lw: 8, seed: 2472 + sd }); } G.rrect(ctx, -220, -50, 440, 100, 20, { fill: '#F4EEDC', lw: 8, seed: 2474 }); break;
      case 'camera': G.rrect(ctx, -260, -170, 520, 340, 40, { fill: '#2A2A30', lw: 8, seed: 2480 }); G.ellipse(ctx, 0, 0, 130, 130, { fill: '#14141A', lw: 8, seed: 2481 }); G.ellipse(ctx, 0, 0, 70, 70, { fill: '#3D5A8A', lw: 6, seed: 2482 }); G.rrect(ctx, -200, -230, 140, 60, 10, { fill: '#2A2A30', lw: 6, seed: 2483 }); break;
      case 'clock': G.ellipse(ctx, 0, 0, 260, 260, { fill: '#F4EEDC', lw: 10, seed: 2490 }); G.line(ctx, [[0, 0], [0, -180]], { lw: 12, seed: 2491 }); G.line(ctx, [[0, 0], [Math.cos(t) * 140, Math.sin(t) * 140]], { lw: 8, seed: 2492 }); break;
      case 'money': for (let k = 0; k < 3; k++) G.rrect(ctx, -260 + k * 30, -120 + k * 30, 440, 220, 14, { fill: '#7BB37A', lw: 7, seed: 2495 + k }); G.text(ctx, 'R$', -50, 50, { size: 110, fam: 'Bungee', color: '#2E5A2E', align: 'center' }); break;
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- phone screens
  function phoneFrame(ctx, t, draw, shakeAmt = 0) {
    const [sx, sy] = L.shake(t, shakeAmt, 40);
    const pw = 680, ph = 1240, px = W / 2 - pw / 2 - 30 + sx, py = 330 + sy;
    G.rrect(ctx, px - 24, py - 24, pw + 48, ph + 48, 70, { fill: '#18181F', lw: 6, seed: 2500 });
    ctx.save(); ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip(); ctx.translate(px, py); draw(ctx, pw, ph); ctx.restore();
    L.glow(ctx, W / 2, 950, 900, 'rgba(160,180,255,0.22)');
  }
  function wrap(ctx, text, maxW, size, fam = 'Inter', weight = 400) {
    const words = text.split(' '), lines = []; let cur = '';
    for (const w of words) { const tryS = cur ? cur + ' ' + w : w; if (G.measure(ctx, tryS, size, fam, weight) > maxW && cur) { lines.push(cur); cur = w; } else cur = tryS; }
    if (cur) lines.push(cur); return lines;
  }
  function chat(ctx, t, i, sp, w, h) {
    ctx.fillStyle = '#ECE5DD'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#075E54'; ctx.fillRect(0, 0, w, 140);
    G.text(ctx, sp.title || '', 40, 95, { size: 48, fam: 'Inter', weight: 800, color: '#fff' });
    let y = 190;
    for (const m of sp.msgs || []) {
      const t0 = at(i, m.at); if (t < t0 - 0.6) break;
      const typing = t < t0;
      const size = 40, lines = typing ? ['• • •'] : wrap(ctx, m.text, w - 220, size);
      const bw = Math.max(...lines.map((l) => G.measure(ctx, l, size, 'Inter', 400))) + 60, bh = lines.length * 54 + 34;
      const p = typing ? 1 : ease.outBack(clamp((t - t0) / 0.3), 2);
      const bx = m.me ? w - 40 - bw : 40;
      ctx.save(); ctx.translate(bx + (m.me ? bw : 0), y); ctx.scale(p, p); ctx.translate(-(m.me ? bw : 0), 0);
      G.rrect(ctx, 0, 0, bw, bh, 24, { fill: m.me ? '#DCF8C6' : '#FFFFFF', lw: 3, seed: 2510 + y });
      lines.forEach((l, k) => G.text(ctx, l, 30, 60 + k * 54, { size, fam: 'Inter', weight: 400, color: '#111' }));
      ctx.restore();
      y += bh + 26;
    }
  }
  function callScreen(ctx, t, i, sp, w, h) {
    const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#2A3A6A'); g.addColorStop(1, '#0E1430'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    G.ellipse(ctx, w / 2, 380, 160, 160, { fill: '#9C8A6C', lw: 5, seed: 2520 });
    if (sp.who) { ctx.save(); ctx.beginPath(); ctx.arc(w / 2, 380, 155, 0, Math.PI * 2); ctx.clip(); Ch.person(ctx, { x: w / 2, y: 840, s: 1.4, pose: 'stand', style: castOf(sp.who), mouth: 'smile', shadow: false, seed: 2521 }); ctx.restore(); }
    G.text(ctx, sp.caller || '', w / 2, 650, { size: 76, fam: 'Inter', weight: 800, color: '#fff', align: 'center' });
    const st = sp.statusAfter && past(t, i, sp.statusAfter.at) ? sp.statusAfter : sp;
    G.text(ctx, st.status || 'chamando...', w / 2, 730, { size: 40, fam: 'Inter', weight: 400, color: st.statusColor || '#C8D0F0', align: 'center' });
    if (!sp.statusAfter || !past(t, i, sp.statusAfter.at)) { G.ellipse(ctx, 170, h - 200, 70, 70, { fill: '#E04848', lw: 3, seed: 2522 }); G.ellipse(ctx, w - 170, h - 200 - 10 * Math.abs(Math.sin(t * 6)), 70, 70, { fill: '#3DBB6A', lw: 3, seed: 2523 }); }
  }
  function lockScreen(ctx, t, i, sp, w, h) {
    const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#3A2F6A'); g.addColorStop(1, '#14112A'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    G.text(ctx, sp.time || '03:33', w / 2, 300, { size: 150, fam: 'Inter', weight: 800, color: '#fff', align: 'center' });
    const t0 = at(i, sp.at), p = ease.outBack(clamp((t - t0) / 0.35), 2);
    if (t >= t0) { ctx.save(); ctx.translate(w / 2, 520); ctx.scale(p, p); G.rrect(ctx, -(w - 80) / 2, -90, w - 80, 200, 30, { fill: 'rgba(255,255,255,0.92)', lw: 3, seed: 2530 });
      G.text(ctx, sp.app || 'Mensagem', -(w - 80) / 2 + 30, -30, { size: 32, fam: 'Inter', weight: 700, color: '#555' });
      wrap(ctx, sp.text || '', w - 160, 38).slice(0, 2).forEach((l, k) => G.text(ctx, l, -(w - 80) / 2 + 30, 30 + k * 48, { size: 38, fam: 'Inter', weight: 400, color: '#111' })); ctx.restore(); }
  }

  // ---------------------------------------------------------------- scene templates
  function camera(ctx, sp, t, u, d, draw) {
    const [z0, z1] = sp.zoom || [1, 1.06];
    const z = lerp(z0, z1, ease.inOutQuad(clamp(u / Math.max(1, d))));
    const [fx, fy] = sp.focus || [W / 2, 1000];
    ctx.save(); ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx, -fy); draw(); ctx.restore();
  }
  function hitFx(ctx, t, i, sp) {
    if (sp.hit == null) return;
    const th = at(i, sp.hit);
    if (t < th) return;
    if (DARK) L.glitch(ctx, Math.exp(-(t - th) * 3) * 1.1, t);
    L.flash(ctx, t, th, 8, DARK ? 0.85 : 0.5);
  }
  function room(sp, i) {
    return (ctx, t, u, d) => {
      const [sx, sy] = sp.shake ? L.shake(t, sp.shake, 30) : [0, 0];
      ctx.save(); ctx.translate(sx, sy);
      camera(ctx, sp, t, u, d, () => {
        setBg(ctx, t, sp.set || 'living', sp.light || 'night');
        for (const pr of sp.props || []) prop(ctx, pr.kind, pr.x, pr.y, pr.s || 1, t);
        const behind = (sp.chars || []).filter((c) => c.behind);
        for (const c of behind) { const h = drawChar(ctx, t, i, c); const ov = (c.then || []).filter((x) => past(t, i, x.at) && x.fx).pop(); overlay(ctx, t, ov ? ov.fx : c.fx, h); }
        if (behind.length) { counter(ctx, 1240); if (sp.set === 'cafe') G.rrect(ctx, 760, 1120, 140, 120, 14, { fill: '#B8BCC6', lw: 5, seed: 2096 }); }
        for (const c of (sp.chars || []).filter((c) => !c.behind)) { const h = drawChar(ctx, t, i, c); const ov = (c.then || []).filter((x) => past(t, i, x.at) && x.fx).pop(); overlay(ctx, t, ov ? ov.fx : c.fx, h); }
        if (sp.rain) { ctx.strokeStyle = 'rgba(180,200,255,0.35)'; ctx.lineWidth = 2; for (let k = 0; k < 60; k++) { const rx = U.hash(k, 1) * W, ry = (U.hash(k, 2) * H + t * 1400) % H; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 10, ry + 50); ctx.stroke(); } }
        if (sp.confetti != null && past(t, i, sp.confetti)) G.confetti(ctx, t, at(i, sp.confetti), { n: 120, seed: 7 + i, spawn: 2 });
      });
      ctx.restore();
      lightFor(ctx, sp.light || 'night', sp.lightAt ? sp.lightAt[0] : W / 2, sp.lightAt ? sp.lightAt[1] : 600);
      if (sp.cctv) L.cctv(ctx, t, L.stampAt(u, 3 + i * 7));
      if (sp.label) G.text(ctx, sp.label, W / 2 - 40, SAFE.y + 150, { size: sp.labelSize || 110, fam: 'Bungee', color: sp.labelColor || '#FF3B3B', align: 'center', stroke: '#000', strokeW: 10, alpha: L.prog(t, S.cuts[i] + 0.2, 0.3) });
      if (sp.sepia) { ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = '#888'; ctx.globalAlpha = 0.75; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      hitFx(ctx, t, i, sp);
    };
  }
  function close(sp, i) { // a big close-up of one character
    const c = Object.assign({ x: W / 2, y: 1300, s: 1.2 }, sp.char);
    return room(Object.assign({}, sp, { zoom: sp.zoom || [2.3, 2.45], focus: [W / 2, 860], chars: [c].concat(sp.extra || []) }), i);
  }
  function phone(sp, i) {
    return (ctx, t, u) => {
      ctx.fillStyle = sp.bg || '#0B0D16'; ctx.fillRect(0, 0, W, H);
      const sh = sp.buzz != null && past(t, i, sp.buzz) ? 6 : 0;
      phoneFrame(ctx, t, (c, w, h) => (sp.mode === 'call' ? callScreen : sp.mode === 'lock' ? lockScreen : chat)(c, t, i, sp, w, h), sh);
      hitFx(ctx, t, i, sp);
    };
  }
  function note(sp, i) {
    return (ctx, t, u) => {
      if (sp.bg === 'wood' || !sp.bg) { ctx.fillStyle = '#5B4632'; ctx.fillRect(0, 0, W, H); G.hatch(ctx, [0, 0, W, H], { color: 'rgba(0,0,0,0.25)', gap: 12, angle: 0.1 }); }
      else { ctx.fillStyle = sp.bg; ctx.fillRect(0, 0, W, H); }
      const t0 = at(i, sp.at == null ? 0.3 : sp.at);
      const lines = sp.text.split('\n');
      const size = Math.round((sp.size || (lines.length > 3 ? 56 : 70)) * 1.2);
      const p = ease.outBack(L.prog(t, S.cuts[i], 0.5), 1.4);
      L.note(ctx, W / 2 - 30, 920, 940 * p, Math.max(380, lines.length * size * 1.3 + 180), sp.rot || -0.03, sp.text, L.prog(t, t0, sp.dur || 2.4), size, 30 + i);
      if (sp.figure != null && past(t, i, sp.figure)) { ctx.save(); ctx.globalAlpha = 0.85 * L.prog(t, at(i, sp.figure), 2); ctx.fillStyle = '#050408'; ctx.beginPath(); ctx.ellipse(W / 2, 300, 210, 300, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      L.light(ctx, W / 2, 900, 1500, '#FFF0D8', DARK ? '#120E14' : '#5A4632');
      hitFx(ctx, t, i, sp);
    };
  }
  function big(sp, i) {
    return (ctx, t, u) => {
      ctx.fillStyle = sp.bg || '#0B0A12'; ctx.fillRect(0, 0, W, H);
      const t0 = at(i, sp.at == null ? 0.2 : sp.at);
      sp.lines.forEach((l, k) => {
        const tk = t0 + k * (sp.stagger == null ? 0.35 : sp.stagger);
        const p = ease.outBack(clamp((t - tk) / 0.25), 2.2);
        if (p <= 0) return;
        const fit = Math.min(1, (W - 200) / G.measure(ctx, l, sp.size || 150, 'Bungee', 400));
        ctx.save(); ctx.translate(W / 2 - 40, 820 + k * (sp.size || 150) * 1.05); ctx.scale(p * fit, p * fit);
        G.text(ctx, l, 0, 0, { size: sp.size || 150, fam: 'Bungee', color: (sp.colors || [])[k] || sp.color || '#F4EEE0', align: 'center', stroke: '#000', strokeW: 12 });
        ctx.restore();
      });
      hitFx(ctx, t, i, sp);
    };
  }
  function photo(sp, i) {
    return (ctx, t, u) => {
      ctx.fillStyle = sp.bg || '#2A2420'; ctx.fillRect(0, 0, W, H);
      const z = lerp(1, 1.12, clamp(u / 4));
      ctx.save(); ctx.translate(W / 2, 900); ctx.rotate(sp.rot || -0.04); ctx.scale(z, z);
      G.rrect(ctx, -380, -480, 760, 900, 8, { fill: '#E8DCC0', lw: 5, seed: 2600 });
      G.rrect(ctx, -320, -420, 640, 640, 4, { fill: sp.photoBg || '#9C8A6C', lw: 4, seed: 2601 });
      ctx.save(); ctx.beginPath(); ctx.rect(-320, -420, 640, 640); ctx.clip(); ctx.translate(0, 200);
      for (const c of sp.chars || []) { const st = castOf(c.id); if (st.kind === 'figure') L.figure(ctx, c.x || 0, 20, c.s || 0.7, past(t, i, c.appear) || c.appear == null ? 1 : 0, { eyes: 1 }); else if (st.kind === 'dog') Ch.dog(ctx, { x: c.x || 0, y: 0, s: c.s || 0.6, color: st.color, t, happy: true }); else Ch.person(ctx, Object.assign({ x: c.x || 0, y: 0, s: c.s || 0.8, pose: 'stand', style: st, shadow: false, seed: 2610 + (c.x || 0) }, exprOpts(c.expr || 'smile', t))); }
      ctx.restore();
      if (sp.caption) G.text(ctx, sp.caption, 0, 330, { size: 60, fam: 'Gochi Hand', weight: 400, color: '#3A2A20', align: 'center' });
      ctx.restore();
      if (sp.sepia !== false) { ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = '#888'; ctx.globalAlpha = 0.7; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      L.light(ctx, W / 2, 800, 1500, '#F2E4C8', '#2A2018');
      hitFx(ctx, t, i, sp);
    };
  }
  function iconScene(sp, i) {
    return (ctx, t, u) => {
      const g = ctx.createRadialGradient(W / 2, 900, 50, W / 2, 900, 900); g.addColorStop(0, sp.bg || (DARK ? '#2A2440' : '#F2B84B')); g.addColorStop(1, sp.bg2 || (DARK ? '#0A0910' : '#D97757'));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const t0 = at(i, sp.at == null ? 0.2 : sp.at), p = ease.outBack(clamp((t - t0) / 0.4), 2);
      if (p > 0) icon(ctx, sp.icon, W / 2 - 30, 900 + Math.sin(t * 2) * 10, (sp.s || 1) * p, t);
      if (sp.label) G.text(ctx, sp.label, W / 2 - 40, SAFE.y + 160, { size: Math.min(sp.labelSize || 90, 90 * (W - 200) / G.measure(ctx, sp.label, 90, 'Bungee', 400)), fam: 'Bungee', color: sp.labelColor || '#F4EEE0', align: 'center', alpha: clamp((t - t0 - 0.3) / 0.3), stroke: '#000', strokeW: 10 });
      if (sp.fx === 'confetti' && t >= t0) G.confetti(ctx, t, t0, { n: 120, seed: 9 + i, spawn: 2 });
      if (sp.fx === 'hearts') for (let k = 0; k < 6; k++) { const q = (t * 0.35 + k / 6) % 1; heartShape(ctx, 200 + k * 140 + Math.sin(t + k) * 30, 1500 - q * 1100, 0.8, Math.sin(Math.PI * q)); }
      hitFx(ctx, t, i, sp);
    };
  }
  function clockScene(sp, i) {
    return (ctx, t) => { ctx.fillStyle = '#0B0A12'; ctx.fillRect(0, 0, W, H); const on = past(t, i, sp.at); const kick = on ? 1 + 0.08 * pulse(t, at(i, sp.at), 9) : 1; L.clock(ctx, W / 2, 860, 1.6 * kick, on ? sp.to : sp.from); hitFx(ctx, t, i, sp); };
  }
  const TPL = { room, close, phone, note, big, photo, icon: iconScene, clock: clockScene };

  // the title over the first scene
  function withTitle(fn) {
    return (ctx, t, u, d) => {
      fn(ctx, t, u, d);
      const ti = clamp(u / 0.4) * (1 - clamp((u - 3.4) / 0.5));
      if (ti > 0 && ST.title) G.decor(() => ST.title.forEach((l, k) => G.text(ctx, l, W / 2 - 50, SAFE.y + 40 + k * 125, { size: 112, fam: 'Bungee', color: k === ST.title.length - 1 ? (ST.titleColor || '#FF3B3B') : '#F4EEE0', align: 'center', alpha: ti, stroke: '#000', strokeW: 10 })));
    };
  }
  L.kit = { TPL, EXPR, setBg, drawChar, prop, icon, heartShape };
  L.runStory = () => { const scenes = ST.scenes.map((sp, i) => TPL[sp.tpl || 'room'](sp, i)); scenes[0] = withTitle(scenes[0]); L.run(scenes); };
})();
