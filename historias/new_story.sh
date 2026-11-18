#!/bin/bash
# usage: new_story.sh <folder> scaffold   -> creates the project (before writing story.js)
#        new_story.sh <folder> prep       -> copies the shared kit, builds the script, voice and sound
set -e
SK=/root/.claude/plugins/synced/e3f184e2-e49e-4362-b071-77b9709db483_c59604fb-d71d-4634-91e0-51f3eef83335/82436e8d-b5bb-4da5-b372-0309f771299f/skills/animation-studio
cd /home/user/historias
n=$1
if [ "$2" = scaffold ]; then node $SK/scripts/new-project.js $n --format 9:16 >/dev/null; mkdir -p $n/assets $n/out; exit 0; fi
cp _shared/{score.js,song.js,lib.js,kit.js,index.html,prep_voice.py,prep_suno.py,transcribe.py} $n/
echo "L.runStory();" > $n/film.js
cd $n
node -e "const S=require('./story.js');require('fs').writeFileSync('roteiro.json',JSON.stringify({titulo:S.name,voz:S.voice,drama:S.drama||[],cenas:S.scenes.map(s=>({fala:s.fala}))},null,1))"
python3 prep_voice.py | head -1
node song.js
