#!/bin/bash
# usage: render_one.sh <folder> — renders queued one at a time via flock
n=$1
exec 9>/home/user/historias/.queue.lock
flock 9
cd /home/user/historias/$n && node engine/render.js video >out/render.log 2>&1 && node engine/render.js mux "$n" 2>&1 | tail -1
ls -la out/$n.mp4
