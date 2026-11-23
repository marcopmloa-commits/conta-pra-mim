#!/usr/bin/env python3
"""Post the channel's videos to TikTok through the Zernio REST API.

The key is read from the ZERNIO_API_KEY environment variable (or a local .env file,
which is git-ignored). Never put the key in this file.

  python3 tools/zernio_post.py accounts
  python3 tools/zernio_post.py post VIDEO.mp4 --account ACCOUNT_ID --caption "texto" --at 2026-11-24T22:00:00Z
  python3 tools/zernio_post.py post VIDEO.mp4 --account ACCOUNT_ID --caption "texto" --now
  python3 tools/zernio_post.py queue fila.json --account ACCOUNT_ID      # schedules every item in the file
"""
import argparse, json, os, sys, urllib.request, urllib.error

BASE = "https://zernio.com/api/v1"


def key():
    k = os.environ.get("ZERNIO_API_KEY")
    if not k and os.path.exists(".env"):
        for line in open(".env"):
            if line.startswith("ZERNIO_API_KEY="):
                k = line.split("=", 1)[1].strip().strip('"')
    if not k:
        sys.exit("ZERNIO_API_KEY não definido (exporte a variável ou coloque no .env)")
    return k


def api(method, path, body=None):
    req = urllib.request.Request(BASE + path, method=method, headers={"Authorization": f"Bearer {key()}", "Content-Type": "application/json"},
                                 data=json.dumps(body).encode() if body is not None else None)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        sys.exit(f"Zernio {e.code}: {e.read().decode(errors='replace')[:600]}")


def upload(path):
    """Presigned upload: returns the public URL Zernio will publish from."""
    p = api("POST", "/media/presign", {"filename": os.path.basename(path), "contentType": "video/mp4"})
    with open(path, "rb") as f:
        req = urllib.request.Request(p["uploadUrl"], method="PUT", data=f.read(), headers={"Content-Type": "video/mp4"})
        urllib.request.urlopen(req, timeout=600).read()
    return p["publicUrl"]


def post(video, account, caption, at=None, now=False):
    body = {
        "content": caption,
        "mediaItems": [{"type": "video", "url": upload(video)}],
        "platforms": [{"platform": "tiktok", "accountId": account}],
        "tiktokSettings": {"privacy_level": "PUBLIC_TO_EVERYONE", "allow_comment": True, "allow_duet": True, "allow_stitch": True,
                           "commercial_content_type": "none", "content_preview_confirmed": True, "express_consent_given": True,
                           "media_type": "video", "auto_add_music": False, "video_made_with_ai": False},
    }
    if now: body["publishNow"] = True
    elif at: body["scheduledFor"] = at
    else: sys.exit("use --at <data ISO> para agendar ou --now para publicar agora")
    r = api("POST", "/posts", body)
    p = r.get("post", r)
    print(f"{os.path.basename(video)} -> post {p.get('_id')} ({p.get('status')}) {at or 'agora'}")


def main():
    ap = argparse.ArgumentParser(); sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("accounts")
    a = sub.add_parser("post"); a.add_argument("video"); a.add_argument("--account", required=True); a.add_argument("--caption", required=True); a.add_argument("--at"); a.add_argument("--now", action="store_true")
    q = sub.add_parser("queue"); q.add_argument("file"); q.add_argument("--account", required=True)
    o = ap.parse_args()
    if o.cmd == "accounts":
        for acc in api("GET", "/accounts").get("accounts", []):
            print(acc.get("_id"), acc.get("platform"), acc.get("username"), "-", acc.get("displayName"))
    elif o.cmd == "post":
        post(o.video, o.account, o.caption, o.at, o.now)
    else:
        for item in json.load(open(o.file)):
            post(item["video"], o.account, item["caption"], item["at"])


if __name__ == "__main__":
    main()
