// Generic sound: narration + drone + the story's fx list + hits + heartbeats.
const path = require('path');
const { SR, Bus, reverb } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const MU = require('./engine/music');
const sc = require('./score');
const { DURATION, END } = sc;
const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const pad = bus(), keys = bus(), fx = bus(), hits = bus(), verb = bus();
const voice = MIX.loadAudio(path.join(__dirname, 'assets/narration.wav'), { length: DURATION });

for (const c of sc.drone) {
  const d = c.t1 - c.t + 1.5;
  const b = I.padNote(c.bass, d, { cutoff: 260, attack: 2.5, release: 2.5 }); pad.addStereo(b.L, b.R, c.t, 0.32);
  for (const n of c.notes) { const p = I.padNote(n, d, { cutoff: c.dark ? 900 : 600, attack: 3, release: 2.5, detune: c.dark ? 0.35 : 0.15 }); pad.addStereo(p.L, p.R, c.t, 0.07); }
}
for (const n of sc.motif) { const mb = I.musicBox(n.midi, { decay: 1.6 }); keys.addMono(mb, n.t, n.gain || 0.14, 0.2); verb.addMono(mb, n.t, 0.22); }

const FX = {
  paper: (e) => I.paperFwip(e.p || 0.8, Math.round(e.t * 10)),
  tick: (e) => I.woodTick(e.p || 0.35),
  click: () => I.tvClick(),
  scribble: (e) => I.scribble(e.len || 0.8, Math.round(e.t * 10)),
  thud: (e) => I.thud(e.p || 80, 0.1),
  rewind: () => I.noiseSweep(1.6, 2500, 200, { q: 1.2, pink: true }),
  whisper: (e) => I.noiseSweep(e.len || 3.5, 3500, 5200, { q: 3, shape: (x) => Math.sin(Math.PI * x) ** 2 }),
  wind: (e) => I.noiseSweep(e.len || 4, 400, 900, { q: 0.6, shape: (x) => Math.sin(Math.PI * x), pink: true }),
  rain: (e) => I.noiseSweep(e.len || 6, 2600, 2400, { q: 0.3, shape: (x) => Math.min(1, x * 8, (1 - x) * 8), pink: true }),
  hum: (e) => I.noiseSweep(e.len || 3, 110, 160, { q: 2, shape: (x) => Math.min(1, x * 6, (1 - x) * 6), pink: true }),
  ding: () => I.bell(1318.5, 1.4, 1.2, 2),
  air: (e) => I.noiseSweep(e.len || 1.4, 300, 120, { q: 0.7, pink: true }),
  boom: (e) => I.subBoom(e.len || 2.2),
  mb: (e) => I.musicBox(e.p, { decay: 1.8 }),
};
for (const e of sc.fx) {
  if (e.type === 'ring') { for (let k = 0; k < 12; k++) { const tone = I.bell(k % 2 ? 1180 : 1480, 0.07, 0.6, 1); fx.addMono(tone, e.t + k * 0.055, 0.09, 0.25); fx.addMono(tone, e.t + 0.9 + k * 0.055, 0.09, 0.25); } continue; }
  if (e.type === 'knock') { for (let k = 0; k < (e.n || 3); k++) { fx.addMono(I.thud(120, 0.07), e.t + k * (e.gap || 0.45), e.gain || 0.8); fx.addMono(I.woodTick(0.22), e.t + k * (e.gap || 0.45), 0.5); verb.addMono(I.thud(120, 0.07), e.t + k * (e.gap || 0.45), 0.3); } continue; }
  if (e.type === 'buzz') { for (let k = 0; k < 6; k++) fx.addMono(I.thud(170, 0.03), e.t + k * 0.07, 0.35); continue; }
  const f = FX[e.type]; if (!f) throw new Error('unknown fx ' + e.type);
  const buf = f(e); fx.addMono(buf, e.t, e.gain == null ? 0.4 : e.gain, e.pan || 0);
  if (e.verb) verb.addMono(buf, e.t, e.verb);
}
function hit(t, big = 1) {
  hits.addMono(I.thud(70, 0.12), t, 0.9 * big); hits.addMono(I.tvClick(), t, 0.5 * big);
  hits.addMono(I.subBoom(2.4), t, 0.75 * big); hits.addMono(I.noiseSweep(0.35, 6000, 1500, { q: 0.5 }), t, 0.25 * big);
  verb.addMono(I.thud(70, 0.12), t, 0.4 * big);
}
for (const t of sc.hits) hit(t, 1);
hit(END, 1.2);
for (const t of sc.heartbeats) fx.addMono(I.heartbeat(), t, 0.65);

const stems = { pad, keys, fx, hits, verb: reverb(verb, { room: 0.9, damp: 0.4 }) };
const music = MIX.mixdown(stems, { pad: 2.2, keys: 0.9, fx: 1, hits: 1, verb: 1 });
MIX.duck([music], voice, { depth: 0.45, attack: 0.03, release: 0.5 });
for (const t of sc.hits) MIX.gate(music, t - 0.4, t - 0.005);
MIX.gate(music, END - 0.35, END - 0.005);
const mix = MIX.mixdown({ music, voice }, { music: 1, voice: 1.0 });
MIX.highpass(mix, 25);
MIX.fadeOut(mix, DURATION - 1.5, DURATION);
const M = MIX.master(mix, 0.8, undefined, { lufs: parseFloat(process.env.LUFS || '-14') });
MIX.writeWav(path.join(__dirname, 'out', 'music.wav'), mix);
console.log(`wrote out/music.wav (${DURATION.toFixed(2)}s, ${M.lufs.toFixed(1)} LUFS)`);
