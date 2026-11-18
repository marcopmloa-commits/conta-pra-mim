"""Suno narration -> tighten pauses -> align to the script -> assets/narration.wav + timing.js"""
import json, subprocess, difflib, re, unicodedata, numpy as np
SR = 48000
SRC, WORDS, SCRIPT = "/home/user/suno/suno.mp3", "/home/user/suno/words.json", "/home/user/teste-video/roteiro.json"
raw = subprocess.run(["ffmpeg","-v","error","-i",SRC,"-ac","2","-ar",str(SR),"-f","f32le","-"],capture_output=True,check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
tw = json.load(open(WORDS))
norm = lambda s: re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFD", s.lower()).encode("ascii","ignore").decode())

# original script words, with sentence ends and dramatic beats
R = json.load(open(SCRIPT)); ow = []
for si, c in enumerate(R["cenas"]):
    toks = c["fala"].split()
    for k, tok in enumerate(toks):
        ow.append({"w": tok, "scene": si, "end_sent": bool(re.search(r"[.!?]$", tok)), "last_in_scene": k == len(toks)-1})
DRAMA = {"porta.", "gelar.", "apartamento.", "fechados.", "dormindo.", "segundo.", "dele."}

# align transcript -> script
sm = difflib.SequenceMatcher(None, [norm(w["w"]) for w in tw], [norm(w["w"]) for w in ow], autojunk=False)
t2o = {}
for a, b, n in sm.get_matching_blocks():
    for k in range(n): t2o[a+k] = b+k
print("aligned", len(t2o), "of", len(ow), "script words")

# speech energy to find true silence inside each gap
hop = int(0.01*SR); rms = np.sqrt(np.mean(x[: len(x)//hop*hop].reshape(-1, hop, 2)**2, axis=(1,2)))
thr = max(1e-4, np.percentile(rms, 20) * 3)
def silent_span(a, b):
    i0, i1 = int(a*100), int(b*100); seg = rms[i0:i1] < thr
    if not seg.any(): return None
    best, cur, st = (0, 0, 0), 0, 0
    for k, v in enumerate(list(seg) + [False]):
        if v:
            if cur == 0: st = k
            cur += 1
        else:
            if cur > best[0]: best = (cur, st, k)
            cur = 0
    if best[0] < 25: return None
    return (i0 + best[1]) / 100, (i0 + best[2]) / 100

cuts = []  # (start, end) of audio to remove
quiet = rms < 10 ** (-38 / 20)
runs, st = [], None
for k, v in enumerate(list(quiet) + [False]):
    if v and st is None: st = k
    if not v and st is not None:
        if k - st >= 45: runs.append((st / 100, k / 100))
        st = None
for s0, s1 in runs:
    if s0 < 0.3: continue
    prev = [i for i, w in enumerate(tw) if w["end"] <= s0 + 0.35]
    i = prev[-1] if prev else None
    o = ow[t2o[i]] if i is not None and i in t2o else None
    wtxt = tw[i]["w"] if i is not None else ""
    if o and o["w"].lower() in DRAMA: target = 0.85
    elif o and o["end_sent"]: target = 0.45
    elif o is None and re.search(r"[.!?]$", wtxt): target = 0.4
    else: target = 0.2
    if s1 - s0 > target + 0.05: cuts.append((s0 + target / 2, s1 - target / 2))

# build tightened audio with 15ms crossfades, and a time map
keep, pos = [], 0.0
for a, b in cuts: keep.append((pos, a)); pos = b
keep.append((pos, len(x)/SR))
fade = int(0.015*SR); out = []; tmap = []; acc = 0.0
for a, b in keep:
    seg = x[int(a*SR):int(b*SR)].copy()
    if len(seg) > 2*fade:
        ramp = np.linspace(0, 1, fade)[:, None]; seg[:fade] *= ramp; seg[-fade:] *= ramp[::-1]
    tmap.append((a, b, acc)); acc += len(seg)/SR; out.append(seg)
y = np.concatenate(out)
def remap(t):
    for a, b, o in tmap:
        if t <= b: return o + max(0, t - a)
    return acc
LEAD = 0.6
y = np.concatenate([np.zeros((int(LEAD*SR), 2), np.float32), y, np.zeros((int(1.5*SR), 2), np.float32)])
subprocess.run(["ffmpeg","-v","error","-y","-f","f32le","-ar",str(SR),"-ac","2","-i","-","assets/narration.wav"], input=y.tobytes(), check=True)

# script word times: aligned ones from the transcript, the rest interpolated
times = [None]*len(ow)
for ti, oi in t2o.items(): times[oi] = (LEAD + remap(tw[ti]["t"]), LEAD + remap(tw[ti]["end"]))
known = [i for i, v in enumerate(times) if v]
for i in range(len(ow)):
    if times[i]: continue
    p = max([k for k in known if k < i], default=None); n = min([k for k in known if k > i], default=None)
    t0 = times[p][1] if p is not None else LEAD; t1 = times[n][0] if n is not None else t0 + 0.4*(len(ow)-i)
    gapw = [j for j in range(p+1 if p is not None else 0, n if n is not None else len(ow))]
    L = sum(len(ow[j]["w"]) for j in gapw); c = sum(len(ow[j]["w"]) for j in gapw if j < i)
    a = t0 + (t1 - t0) * c / L; b = t0 + (t1 - t0) * (c + len(ow[i]["w"])) / L
    times[i] = (a, b)
scenes = []
for si, c in enumerate(R["cenas"]):
    idx = [i for i, o in enumerate(ow) if o["scene"] == si]
    scenes.append({"i": si, "t0": round(times[idx[0]][0], 3), "t1": round(times[idx[-1]][1], 3), "text": c["fala"],
                   "words": [{"w": ow[i]["w"].strip('.,:;!?"'), "t": round(times[i][0], 3), "end": round(times[i][1], 3)} for i in idx]})
total = len(y)/SR
open("timing.js", "w").write("(function(){const TIMING=" + json.dumps({"total": round(total, 3), "scenes": scenes}, ensure_ascii=False) +
    ";if(typeof module!=='undefined'&&module.exports)module.exports=TIMING;else globalThis.TIMING=TIMING;})();\n")
print(f"original {len(x)/SR:.1f}s -> {total:.1f}s, {len(cuts)} pauses tightened")
for s in scenes: print(s["i"], s["t0"], s["t1"], s["text"][:50])
