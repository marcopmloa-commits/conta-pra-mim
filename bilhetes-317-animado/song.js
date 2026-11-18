// THE SOUND: narration + dark drone + every effect tied to an event in score.js.
const path = require('path');
const { SR, Bus, reverb } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const sc = require('./score');
const { DURATION, END, ev, cuts } = sc;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const pad = bus(), keys = bus(), fx = bus(), hits = bus(), verb = bus();
const voice = MIX.loadAudio(path.join(__dirname, 'assets/narration.wav'), { length: DURATION });

// ---------- drone ----------
for (const c of sc.drone) {
  const dark = c.t >= cuts[11];
  const d = c.t1 - c.t + 1.5;
  const b = I.padNote(c.bass, d, { cutoff: 260, attack: 2.5, release: 2.5 });
  pad.addStereo(b.L, b.R, c.t, 0.32);
  for (const n of c.notes) {
    const p = I.padNote(n, d, { cutoff: dark ? 900 : 600, attack: 3, release: 2.5, detune: dark ? 0.35 : 0.15 });
    pad.addStereo(p.L, p.R, c.t, 0.07);
  }
}
for (const n of sc.motif) { const mb = I.musicBox(n.midi, { decay: 1.6 }); keys.addMono(mb, n.t, 0.14, 0.2); verb.addMono(mb, n.t, 0.22); }

// ---------- fx ----------
fx.addMono(I.noiseSweep(1.4, 300, 120, { q: 0.7, pink: true }), 0.4, 0.25); // night air
for (const t of [1.2, 1.75, 2.3]) fx.addMono(I.woodTick(0.35), t, 0.35, -0.2); // footsteps behind the door
fx.addMono(I.paperFwip(0.7, 1), ev.noteUnderDoor, 0.55);
fx.addMono(I.paperFwip(1.0, 2), cuts[2] + 0.1, 0.35);
fx.addMono(I.noiseSweep(cuts[4] - cuts[3], 400, 900, { q: 0.6, shape: (x) => Math.sin(Math.PI * x), pink: true }), cuts[3], 0.35); // wind at the window
ev.notes3.forEach((t, k) => fx.addMono(I.paperFwip(0.8 + k * 0.1, 10 + k), t - 0.25, 0.5, (k - 1) * 0.4));
// phone: a trill of two tones
for (const t of sc.rings) for (let k = 0; k < 12; k++) {
  const tone = I.bell(k % 2 ? 1180 : 1480, 0.07, 0.6, 1);
  fx.addMono(tone, t + k * 0.055, 0.09, 0.25);
  fx.addMono(tone, t + 0.9 + k * 0.055, 0.09, 0.25);
}
fx.addMono(I.tvClick(), cuts[9] + 0.5, 0.4); // camera switched on
fx.addMono(I.paperFwip(0.75, 30), ev.clockFlip + 1.2, 0.4);
fx.addMono(I.noiseSweep(1.6, 2500, 200, { q: 1.2, pink: true }), cuts[14] + 0.2, 0.3); // rewind
for (const t of sc.scribbles) fx.addMono(I.scribble(0.8, Math.round(t * 10)), t, 0.28);
fx.addMono(I.noiseSweep(3.5, 3500, 5200, { q: 3, shape: (x) => Math.sin(Math.PI * x) ** 2 }), ev.whisper - 0.3, 0.22, 0.6); // whisper
for (const t of sc.heartbeats) fx.addMono(I.heartbeat(), t, 0.65);

// ---------- hits (each a sharp transient + a long sub) ----------
function hit(t, big = 1) {
  hits.addMono(I.thud(70, 0.12), t, 0.9 * big);
  hits.addMono(I.tvClick(), t, 0.5 * big);
  hits.addMono(I.subBoom(2.4), t, 0.75 * big);
  hits.addMono(I.noiseSweep(0.35, 6000, 1500, { q: 0.5 }), t, 0.25 * big);
  verb.addMono(I.thud(70, 0.12), t, 0.4 * big);
}
hits.addMono(I.thud(90, 0.06), ev.clockFlip, 0.7);
hits.addMono(I.tvClick(), ev.clockFlip, 0.6);
hit(ev.inside, 0.9);
hit(ev.someone, 1.1);
hit(ev.black, 1.2);

// ---------- mix ----------
const stems = { pad, keys, fx, hits, verb: reverb(verb, { room: 0.9, damp: 0.4 }) };
const GAIN = { pad: 2.2, keys: 0.9, fx: 1, hits: 1, verb: 1 };
const music = MIX.mixdown(stems, GAIN);
MIX.duck([music], voice, { depth: 0.45, attack: 0.03, release: 0.5 });
MIX.gate(music, ev.someone - 0.45, ev.someone - 0.005); // a held breath before the reveal
MIX.gate(music, END - 0.35, END - 0.005); // and before the cut to black
const mix = MIX.mixdown({ music, voice }, { music: 1, voice: 1.0 }, { stemDir: process.env.STEMS ? path.join(__dirname, 'out') : null });
MIX.highpass(mix, 25);
MIX.fadeOut(mix, DURATION - 1.5, DURATION);
const M = MIX.master(mix, 0.8, undefined, { lufs: parseFloat(process.env.LUFS || '-14') });
MIX.writeWav(path.join(__dirname, 'out', 'music.wav'), mix);
console.log(`wrote out/music.wav (${DURATION.toFixed(2)}s, ${M.lufs.toFixed(1)} LUFS)`);
