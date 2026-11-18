#!/bin/bash
while pgrep -f render_all.sh >/dev/null; do sleep 20; done
cd /home/user/historias && cp _shared/lib.js o-13-andar/lib.js && python3 /tmp/claude-0/fitfix.py o-13-andar/film.js lib
cd /home/user/historias/o-13-andar && node engine/render.js video >/dev/null 2>&1 && node engine/render.js mux o-13-andar-preview 2>&1 | tail -1
cd /home/user/bilhetes-317-animado && node engine/render.js video >/dev/null 2>&1 && node engine/render.js mux bilhetes-317-suno-v2 2>&1 | tail -1
