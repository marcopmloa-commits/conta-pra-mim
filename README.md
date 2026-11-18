# Conta Pra Mim — canal de histórias animadas (TikTok)

Backup do projeto: histórias, roteiros, sistema de animação e prévias.

- `historias/_shared/` — kit de cenas (lib.js, kit.js, score.js, song.js) e scripts de voz (prep_voice.py, prep_suno.py, transcribe.py)
- `historias/<nn-nome>/story.js` — cada história (falas + cenas). `new_story.sh`, `render_one.sh` para criar/renderizar
- `historias/*/out/*-preview.mp4` — prévias comprimidas (voz provisória)
- `bilhetes-317-animado/out/bilhetes-317-tiktok.mp4` — vídeo final com voz do Suno
- `TEXTOS_SUNO_14.md` — letras + estilos para gerar no Suno
- `perfil/` — fotos de perfil

Renderizar: `node engine/render.js video && node engine/render.js mux <nome>` dentro da pasta da história.
Trocar pela voz do Suno: transcribe.py → prep_suno.py <mp3> <words.json> → node song.js → render.
