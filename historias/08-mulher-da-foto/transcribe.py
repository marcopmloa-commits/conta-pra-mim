import json, sys
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8")
import numpy as np
audio = np.fromfile(sys.argv[1], dtype=np.float32)
segs, info = m.transcribe(audio, language="pt", word_timestamps=True, vad_filter=False, beam_size=5)
words = []
for s in segs:
    for w in s.words:
        words.append({"w": w.word.strip(), "t": round(w.start, 3), "end": round(w.end, 3)})
json.dump(words, open(sys.argv[2], "w"), ensure_ascii=False)
print(len(words)); print(" ".join(w["w"] for w in words))
