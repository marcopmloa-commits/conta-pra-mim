"""Gera a narração (edge-tts) por cena com o tempo de cada palavra -> assets/narration.wav + timing.js"""
import asyncio, json, ssl, subprocess, os
import edge_tts.communicate as etc
etc._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
R = json.load(open("roteiro.json"))
LEAD, GAP = 0.6, 0.45
os.makedirs("assets/vo", exist_ok=True)

def dur(p):
    return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]))

async def one(i, txt):
    c = etc.Communicate(txt, R.get("voz", "pt-BR-AntonioNeural"), rate="-8%", pitch="-6Hz", boundary="WordBoundary")
    audio, words = b"", []
    async for ch in c.stream():
        if ch["type"] == "audio": audio += ch["data"]
        elif ch["type"] == "WordBoundary":
            words.append({"w": ch["text"], "t": ch["offset"]/1e7, "end": (ch["offset"]+ch["duration"])/1e7})
    p = f"assets/vo/{i:02d}.mp3"; open(p, "wb").write(audio)
    return p, words

async def main():
    res = await asyncio.gather(*[one(i, c["fala"]) for i, c in enumerate(R["cenas"])])
    t, scenes, parts = LEAD, [], []
    for i, ((p, words), c) in enumerate(zip(res, R["cenas"])):
        d = dur(p)
        scenes.append({"i": i, "t0": round(t,3), "t1": round(t+d,3), "text": c["fala"],
                       "words": [{"w": w["w"], "t": round(t+w["t"],3), "end": round(t+w["end"],3)} for w in words]})
        parts.append((p, t)); t += d + GAP
    total = t + 2.0
    # mix all parts at their offsets
    inputs, filt = [], []
    for k, (p, at) in enumerate(parts):
        inputs += ["-i", p]; filt.append(f"[{k}:a]aresample=48000,adelay={int(at*1000)}|{int(at*1000)}[a{k}]")
    filt.append("".join(f"[a{k}]" for k in range(len(parts))) + f"amix=inputs={len(parts)}:normalize=0,apad=whole_dur={total}[o]")
    subprocess.run(["ffmpeg","-y","-v","error",*inputs,"-filter_complex",";".join(filt),"-map","[o]","-ac","1","-ar","48000","assets/narration.wav"], check=True)
    open("timing.js","w").write("(function(){const TIMING=" + json.dumps({"total": round(total,3), "scenes": scenes}, ensure_ascii=False) +
        ";if(typeof module!=='undefined'&&module.exports)module.exports=TIMING;else globalThis.TIMING=TIMING;})();\n")
    print("total", round(total,2), "scenes", len(scenes), "words", sum(len(s["words"]) for s in scenes))
asyncio.run(main())
