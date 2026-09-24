"""Simulate the final audio mix offline and report how far the narration sits
above the music and sound effects (the same volumes, fades and ducking as
src/components/AudioTracks.tsx). Aim for a margin of about 12 dB or more.

  npm run export:cues && python3 scripts/check-mix.py
"""
import json, os, re, subprocess, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
SR = 8000
FF = "node_modules/.bin/remotion"
t = json.load(open("out/timeline.json"))
man = open("src/data/audio-manifest.ts").read()
j = man.index("AUDIO_MANIFEST: AudioManifest = ") + len("AUDIO_MANIFEST: AudioManifest = ")
M = json.loads(man[j:man.rindex("}") + 1])


def load(p):
    subprocess.run([FF, "ffmpeg", "-y", "-loglevel", "error", "-i", "public/" + p, "-ac", "1", "-ar", str(SR), "/tmp/mix-check.wav"], check=True)
    w = wave.open("/tmp/mix-check.wav")
    return np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(float) / 32768


N = int(t["totalSeconds"] * SR) + SR
vo, bg, speak = np.zeros(N), np.zeros(N), np.zeros(N)
for s in t["scenes"]:
    for c in s["cues"]:
        x = load(M["lines"][f"{s['id']}/{c['id']}"]["src"])
        i = int(c["start"] * SR)
        vo[i:i + len(x)] += x[:N - i]
        speak[int(c["start"] * SR):int(c["end"] * SR)] = 1
k = int(0.4 * SR)
sp = np.clip(np.convolve(speak, np.ones(2 * k + 1) / (2 * k + 1), "same") * 1.5, 0, 1)
assets = open("src/data/assets.ts").read()
duck = float(re.search(r"duck: ([\d.]+),", assets).group(1))
vols = {m.group(1): tuple(map(float, m.groups()[1:])) for m in re.finditer(r'id: "(\w+)".*?volume: ([\d.]+), fadeIn: ([\d.]+), fadeOut: ([\d.]+)', assets)}
for m in t["music"]:
    x = load(M["music"][m["id"]]["src"])
    a, b = int(m["start"] * SR), int(m["end"] * SR)
    L = b - a
    v, fi, fo = vols[m["id"]]
    e = np.ones(L)
    fi, fo = int(fi * SR), int(fo * SR)
    e[:fi] = np.linspace(0, 1, fi)
    e[L - fo:] = np.linspace(1, 0, fo)
    bg[a:b] += np.pad(x[:L], (0, max(0, L - len(x)))) * e * v * (1 - sp[a:b] * (1 - duck))
for (snd, v), cue in zip(re.findall(r'sound: "([\w-]+)", at: \{[^}]*\}, volume: ([\d.]+)', assets), t["sfx"]):
    x = load(M["sfx"][snd]["src"])
    i = int(cue["start"] * SR)
    n = min(len(x), N - i)
    bg[i:i + n] += x[:n] * float(v)
db = lambda x: 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9)
spk = speak > 0
print(f"narration {db(vo[spk]):.1f} dB | background under it {db(bg[spk]):.1f} dB | margin {db(vo[spk]) - db(bg[spk]):.1f} dB | mix peak {20 * np.log10(np.abs(vo + bg).max()):.1f} dB")
for s in t["scenes"]:
    a, b = int(s["start"] * SR), int(s["end"] * SR)
    m = spk[a:b]
    print(f"  {s['id']:14s} margin {db(vo[a:b][m]) - db(bg[a:b][m]):5.1f} dB")
