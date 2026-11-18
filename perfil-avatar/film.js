// Profile picture options for a multi-genre story channel (1080x1080).
// t=0: open book with genres rising from it, t=1: narrator character reading, t=2: speech bubble "Era uma vez..."
(function () {
  const U = globalThis.U, G = globalThis.G, Ch = globalThis.Ch, Studio = globalThis.Studio;
  const W = G.W, H = G.H;
  const glow = (ctx, x, y, r, col) => { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); };
  function book(ctx, cx, cy, s) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
    G.poly(ctx, [[-330, 40], [0, 90], [330, 40], [330, 120], [0, 170], [-330, 120]], { fill: '#7A3B2E', lw: 6, seed: 10 });
    G.poly(ctx, [[-310, -160], [-20, -110], [-20, 110], [-310, 60]], { fill: '#F6F0E2', lw: 6, seed: 11, hatch: { color: 'rgba(120,80,40,0.12)', gap: 9 } });
    G.poly(ctx, [[310, -160], [20, -110], [20, 110], [310, 60]], { fill: '#F6F0E2', lw: 6, seed: 12, hatch: { color: 'rgba(120,80,40,0.12)', gap: 9 } });
    for (let k = 0; k < 4; k++) { G.line(ctx, [[-270, -100 + k * 40], [-60, -62 + k * 40]], { lw: 3, color: 'rgba(60,40,30,0.35)', seed: 13 + k }); G.line(ctx, [[60, -62 + k * 40], [270, -100 + k * 40]], { lw: 3, color: 'rgba(60,40,30,0.35)', seed: 18 + k }); }
    ctx.restore();
  }
  function ghost(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); G.poly(ctx, [[-50, 60], [-55, -20], [-30, -70], [30, -70], [55, -20], [50, 60], [25, 40], [0, 62], [-25, 40]], { fill: '#F4F1F8', lw: 5, seed: 30 }); for (const sd of [-1, 1]) G.ellipse(ctx, sd * 18, -20, 8, 12, { fill: '#2A2320', lw: 0, seed: 31 + sd }); ctx.restore(); }
  function mask(ctx, x, y, s, happy) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); G.ellipse(ctx, 0, 0, 55, 65, { fill: happy ? '#F2B84B' : '#9CC1FF', lw: 5, seed: happy ? 40 : 41 }); for (const sd of [-1, 1]) G.ellipse(ctx, sd * 20, -12, 10, 8, { fill: '#2A2320', lw: 0, seed: 42 + sd }); G.line(ctx, happy ? [[-24, 18], [0, 34], [24, 18]] : [[-24, 32], [0, 18], [24, 32]], { lw: 5, seed: 44 }); ctx.restore(); }
  function heart(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); G.poly(ctx, [[0, 50], [-55, -5], [-50, -40], [-20, -50], [0, -25], [20, -50], [50, -40], [55, -5]], { fill: '#E8718D', lw: 5, seed: 46 }); ctx.restore(); }
  function icons(ctx, cx, cy, s) {
    heart(ctx, cx - 265 * s, cy - 225 * s, 1.1 * s);
    ghost(ctx, cx - 95 * s, cy - 330 * s, 1.1 * s);
    mask(ctx, cx + 95 * s, cy - 330 * s, 1.0 * s, true);
    G.star(ctx, cx + 265 * s, cy - 225 * s, 55 * s, { fill: '#F2B84B', seed: 50 });
    for (let k = 0; k < 14; k++) { const a = U.hash(k, 1) * Math.PI - Math.PI, r = 150 + U.hash(k, 2) * 300; G.ellipse(ctx, cx + Math.cos(a) * r * s, cy + Math.sin(a) * r * 0.9 * s - 40 * s, 5 * s, 5 * s, { fill: '#FFE7A6', lw: 0, seed: 60 + k }); }
  }
  const STYLE = { skin: Ch.SKIN_TONES[2], hair: '#2B211E', hairStyle: 'curly', outfit: 'hoodie', shirt: '#D97757', bottoms: 'pants', pants: '#27305C', glasses: 'round', sleeves: 'long' };
  Studio.film({
    duration: 3,
    draw(ctx, t) {
      const k = Math.floor(t + 0.001);
      if (k === 0) {
        const g = ctx.createRadialGradient(W / 2, 640, 50, W / 2, 600, 700); g.addColorStop(0, '#3A2F6A'); g.addColorStop(1, '#14112A');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        glow(ctx, W / 2, 620, 520, 'rgba(255,214,140,0.55)');
        icons(ctx, W / 2, 640, 1.05);
        book(ctx, W / 2, 700, 1.15);
      } else if (k === 1) {
        const g = ctx.createRadialGradient(W / 2, 500, 50, W / 2, 500, 700); g.addColorStop(0, '#F2B84B'); g.addColorStop(1, '#D97757');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        Ch.person(ctx, { x: W / 2, y: 1500, s: 2.2, pose: 'stand', style: STYLE, eyes: 'happy', mouth: 'grin', handL: [-70, -300], handR: [70, -300], shadow: false, seed: 300 });
        ctx.save(); ctx.translate(W / 2, 1500 - 2.2 * 290); ctx.scale(0.5, 0.5); book(ctx, 0, 0, 1); ctx.restore();
        icons(ctx, W / 2, 470, 0.75);
      } else {
        ctx.fillStyle = '#27305C'; ctx.fillRect(0, 0, W, H);
        G.poly(ctx, [[W / 2 - 160, 690], [W / 2 - 250, 880], [W / 2 - 20, 740]], { fill: '#F6F0E2', lw: 8, seed: 71 });
        G.ellipse(ctx, W / 2, 470, 420, 300, { fill: '#F6F0E2', lw: 8, seed: 70 });
        G.text(ctx, 'Era uma', W / 2, 440, { size: 120, fam: 'Gochi Hand', weight: 400, color: '#27305C', align: 'center' });
        G.text(ctx, 'vez...', W / 2, 570, { size: 120, fam: 'Gochi Hand', weight: 400, color: '#D97757', align: 'center' });
        heart(ctx, 200, 900, 1.0); ghost(ctx, 400, 960, 1.0); mask(ctx, 680, 960, 0.95, true); G.star(ctx, 880, 900, 55, { fill: '#F2B84B', seed: 51 });
      }
    },
    post: { paper: 0.35, vignette: 0.35, grain: 0.05 },
    fadeOut: 0,
  });
})();
