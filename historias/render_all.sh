#!/bin/bash
for n in o-13-andar a-baba-eletronica a-corrida-das-4h a-ligacao-da-vo; do
  cd /home/user/historias/$n && node engine/render.js video >/dev/null 2>&1 && node engine/render.js mux "$n-preview" 2>&1 | tail -1
done
