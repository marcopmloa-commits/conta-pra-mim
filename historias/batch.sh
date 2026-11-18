#!/bin/bash
# usage: batch.sh <wait-for-pattern> <folders...>
pat=$1; shift
while pgrep -f "$pat" >/dev/null; do sleep 20; done
for n in "$@"; do
  cd /home/user/historias/$n && node engine/render.js video >/dev/null 2>&1 && node engine/render.js mux "$n" 2>&1 | tail -1
done
