"""Synthesise the music score and sound effects from scratch (no samples).

Everything here is procedural: additive strings with ensemble detune and
vibrato, Karplus-Strong pizzicato, pitched timpani, glass harmonics, shaped
noise for footsteps, paper, carriage and crowds, and a convolution reverb.
Section lengths come from out/timeline.json, so cues land on the picture.

  npm run export:cues && python3 scripts/synthesize-score.py
Writes public/audio/music/<slot>.mp3 and public/audio/sfx/<sound>.mp3.
"""
import json, os, subprocess
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FFMPEG = [os.path.join(ROOT, "node_modules/.bin/remotion"), "ffmpeg", "-y", "-loglevel", "error"]
SR = 44100
rng = np.random.default_rng(1874)
T = json.load(open(os.path.join(ROOT, "out/timeline.json")))


# ---------------------------------------------------------------- helpers

def secs(n):
    return int(round(n * SR))


def note(name):
    """'D2' -> Hz (equal temperament, A4 = 440)."""
    names = {"C": -9, "C#": -8, "Db": -8, "D": -7, "D#": -6, "Eb": -6, "E": -5, "F": -4, "F#": -3,
             "Gb": -3, "G": -2, "G#": -1, "Ab": -1, "A": 0, "A#": 1, "Bb": 1, "B": 2}
    pitch, octave = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((names[pitch] + 12 * (octave - 4)) / 12)


def env(n, attack, release, curve=2.0):
    """Attack/sustain/release envelope over n samples (attack/release in seconds)."""
    e = np.ones(n)
    a, r = min(secs(attack), n // 2), min(secs(release), n // 2)
    if a:
        e[:a] = np.linspace(0, 1, a) ** curve
    if r:
        e[-r:] *= np.linspace(1, 0, r) ** curve
    return e


def spectral_filter(x, lo=None, hi=None, slope=4):
    """Zero-phase band filter in the frequency domain with soft edges."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo:
        g *= 1 / (1 + (lo / np.maximum(f, 1e-3)) ** slope)
    if hi:
        g *= 1 / (1 + (f / hi) ** slope)
    return np.fft.irfft(X * g, len(x))


def noise(seconds, lo=None, hi=None, color=0.0):
    """Noise with optional band limits; color>0 tilts towards the low end (1 = pink, 2 = brown)."""
    n = secs(seconds)
    X = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    if color:
        X *= 1 / np.maximum(f, 20) ** (color / 2)
    x = np.fft.irfft(X, n)
    if lo or hi:
        x = spectral_filter(x, lo, hi)
    return x / (np.abs(x).max() + 1e-9)


def slow_random(seconds, rate=0.5, depth=1.0):
    """Smooth random control signal around 1.0."""
    pts = max(4, int(seconds * rate) + 3)
    y = rng.uniform(1 - depth, 1 + depth, pts)
    return np.interp(np.linspace(0, pts - 3, secs(seconds)), np.arange(pts), y)


def fft_convolve(x, h):
    n = len(x) + len(h) - 1
    size = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(h, size), size)[:n]


def reverb(stereo, seconds=2.8, wet=0.3, bright=6000, predelay=0.02):
    """Stereo convolution reverb with a decaying noise impulse response."""
    out = []
    for ch in range(2):
        n = secs(seconds)
        ir = rng.standard_normal(n) * np.exp(-6.9 * np.arange(n) / n)
        ir = spectral_filter(ir, 120, bright)
        ir = np.concatenate([np.zeros(secs(predelay)), ir])
        ir /= np.sqrt((ir ** 2).sum())
        wetsig = fft_convolve(stereo[ch], ir)[: len(stereo[ch])]
        out.append(stereo[ch] * (1 - wet) + wetsig * wet * 1.6)
    return np.array(out)


def place(track, sig, at, pan=0.0, gain=1.0):
    """Mix a mono (or stereo) signal into a stereo track at `at` seconds."""
    i = secs(at)
    if i >= track.shape[1]:
        return
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.array([sig * l, sig * r]) * np.sqrt(2)
    j = min(track.shape[1], i + sig.shape[1])
    track[:, i:j] += sig[:, : j - i] * gain


def normalise(x, peak=0.89):
    return x * (peak / (np.abs(x).max() + 1e-9))


def write(stereo, rel, peak=0.89):
    path = os.path.join(ROOT, "public/audio", rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".wav"
    data = (np.clip(normalise(stereo, peak), -1, 1).T * 32767).astype("<i2")
    import wave
    with wave.open(tmp, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(data.tobytes())
    subprocess.run(FFMPEG + ["-i", tmp, "-b:a", "160k", path], check=True)
    os.remove(tmp)
    print(f"  {rel}: {stereo.shape[1] / SR:.1f}s")


# ---------------------------------------------------------------- instruments

def string_voice(freq, seconds, attack=1.5, release=2.0, bright=10, vibrato=0.004, voices=3, detune=0.004):
    """Bowed-string ensemble: detuned sawtooth-like partials with vibrato."""
    n = secs(seconds)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for v in range(voices):
        d = 1 + detune * (v - (voices - 1) / 2)
        rate = 4.6 + 0.7 * v
        vib = 1 + vibrato * np.sin(2 * np.pi * rate * t + rng.uniform(0, 6)) * np.minimum(1, t / 1.2)
        phase = 2 * np.pi * freq * d * np.cumsum(vib) / SR
        for k in range(1, 14):
            if freq * k > 9000:
                break
            out += np.sin(k * phase + rng.uniform(0, 6)) * np.exp(-k / bright) / k
    bow = noise(seconds, freq, freq * 6) * 0.015
    return (out / voices + bow) * env(n, attack, release)


def chord(names, seconds, **kw):
    return sum(string_voice(note(nm), seconds, **kw) for nm in names) / len(names)


def timpani(freq, seconds=3.0, hit=1.0):
    n = secs(seconds)
    t = np.arange(n) / SR
    glide = freq * (1 + 0.08 * np.exp(-t * 18))
    phase = 2 * np.pi * np.cumsum(glide) / SR
    body = (np.sin(phase) + 0.5 * np.sin(1.5 * phase) + 0.25 * np.sin(2.0 * phase)) * np.exp(-t * 1.6)
    attack = noise(0.08, 60, 900) * np.exp(-np.arange(secs(0.08)) / SR * 50)
    body[: len(attack)] += attack * 0.6
    return body * hit


def pluck(freq, seconds=1.6, damp=0.996):
    """Karplus-Strong plucked string (pizzicato)."""
    n = secs(seconds)
    period = int(SR / freq)
    buf = rng.uniform(-1, 1, period)
    buf = spectral_filter(np.tile(buf, 4), None, 2500)[:period]
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % period]
        buf[i % period] = damp * 0.5 * (buf[i % period] + buf[(i + 1) % period])
    return out * np.exp(-np.arange(n) / SR * 2.2)


def glass_harmonic(freq, seconds, tremolo=0.35):
    n = secs(seconds)
    t = np.arange(n) / SR
    tone = sum(np.sin(2 * np.pi * freq * m * t) * a for m, a in ((1, 1), (2.76, 0.25), (5.4, 0.08)))
    return tone * (1 - tremolo + tremolo * np.sin(2 * np.pi * 0.23 * t + rng.uniform(0, 6))) * env(n, 3, 3)


def low_drone(freq, seconds):
    n = secs(seconds)
    t = np.arange(n) / SR
    x = string_voice(freq, seconds, attack=4, release=4, bright=5, vibrato=0.0015, voices=4, detune=0.003)
    x += 0.5 * np.sin(2 * np.pi * freq / 2 * t) * env(n, 5, 5)
    return x * slow_random(seconds, 0.2, 0.25)


def track(seconds):
    return np.zeros((2, secs(seconds)))


# ---------------------------------------------------------------- music

def cue_time(scene, cue, edge="start"):
    s = next(s for s in T["scenes"] if s["id"] == scene)
    c = next(c for c in s["cues"] if c["id"] == cue)
    return c[edge]


def scene_span(scene):
    s = next(s for s in T["scenes"] if s["id"] == scene)
    return s["start"], s["end"]


def slot(id_):
    m = next(m for m in T["music"] if m["id"] == id_)
    return m["start"], m["end"]


def music_opening():
    a, b = slot("opening")
    L = b - a + 0.5
    out = track(L)
    place(out, low_drone(note("D2"), L), 0, -0.2, 0.9)
    place(out, low_drone(note("A2"), L) * 0.5, 0, 0.25, 0.7)
    place(out, glass_harmonic(note("A5"), L * 0.8), L * 0.15, 0.4, 0.05)
    place(out, glass_harmonic(note("D6"), L * 0.6), L * 0.35, -0.4, 0.035)
    write(reverb(out, 3.5, 0.4), "music/opening.mp3")


def music_title():
    a, b = slot("title")
    L = b - a
    out = track(L)
    reveal = cue_time("coldOpen", "name", "end") - a + 0.3
    place(out, low_drone(note("D2"), L), 0, 0, 0.8)
    swell = chord(["D3", "F3", "A3", "D4"], L - 2, attack=reveal, release=4, bright=7)
    place(out, swell, 0.5, 0, 0.6)
    place(out, timpani(note("D2"), 5, 1.0), reveal, 0, 0.9)
    place(out, chord(["D4", "A4", "D5"], L - reveal, attack=2, release=4, bright=9) * 0.5, reveal, 0, 0.5)
    write(reverb(out, 4, 0.4), "music/title.mp3")


def music_investigation():
    """Scenes 2-6: strings over a slow heartbeat pulse; tension builds scene by scene."""
    a, b = slot("investigation")
    L = b - a
    out = track(L)
    prog = [["D3", "F3", "A3"], ["Bb2", "D3", "F3"], ["G2", "Bb2", "D3"], ["A2", "C#3", "E3"]]
    bass = ["D2", "Bb1", "G1", "A1"]
    bar = 8.0
    scenes = ["phayre", "barodaConflict", "poisoning", "investigation", "accusation"]
    bounds = [scene_span(s)[0] - a for s in scenes] + [L]
    intensity = lambda t: 0.45 + 0.55 * min(1, max(0, t / L)) ** 1.2
    t, i = 0.0, 0
    while t < L:
        seg = min(bar + 2, L - t + 1)
        g = intensity(t)
        place(out, chord(prog[i % 4], seg, attack=2.5, release=3, bright=6 + 3 * g), t, -0.15 + 0.3 * (i % 2), 0.55 * g)
        place(out, string_voice(note(bass[i % 4]), seg, attack=2, release=3, bright=4), t, 0, 0.45)
        t += bar
        i += 1
    # Heartbeat pulse ("lub-dub") at ~44 bpm, entering in scene 3 and firming up in scenes 5-6.
    beat = 60 / 44
    t = bounds[1]
    while t < L - 1:
        g = 0.35 + 0.65 * min(1, (t - bounds[1]) / max(1, L - bounds[1]))
        place(out, timpani(note("D2"), 1.6, 0.7), t, 0, 0.5 * g)
        place(out, timpani(note("D2"), 1.4, 0.45), t + 0.28, 0, 0.4 * g)
        t += beat * 2
    # Pizzicato ostinato in the investigation and accusation scenes.
    pizz = ["D3", "A2", "F3", "A2", "D3", "A2", "E3", "A2"]
    t, k = bounds[3], 0
    while t < L - 2:
        place(out, pluck(note(pizz[k % 8]), 1.2), t, 0.35 if k % 2 else -0.35, 0.28)
        t += beat / 2
        k += 1
    # High string tension in the accusation scene.
    place(out, string_voice(note("A5"), L - bounds[4], attack=6, release=4, bright=3, vibrato=0.002) * 0.25, bounds[4], 0.3, 0.6)
    write(reverb(out, 3.2, 0.33), "music/investigation.mp3")


def music_courtroom():
    a, b = slot("courtroom")
    L = b - a
    out = track(L)
    place(out, low_drone(note("D2"), L), 0, 0, 0.55)
    place(out, string_voice(note("A5"), L, attack=6, release=5, bright=2.5, vibrato=0.0015) * 0.35, 0, 0.3, 0.7)
    notes = ["D3", "F3", "E3", "A2", "D3", "C3", "Bb2", "A2"]
    t, k = 3.0, 0
    while t < L - 3:
        place(out, pluck(note(notes[k % len(notes)]), 1.8), t, -0.3 if k % 2 else 0.3, 0.3)
        t += 3.3 if k % 3 else 4.4
        k += 1
    write(reverb(out, 3.5, 0.4), "music/courtroom.mp3")


def music_verdict():
    a, b = slot("verdict")
    L = b - a
    out = track(L)
    place(out, glass_harmonic(note("E6"), L, 0.2), 0, 0.2, 0.04)
    place(out, low_drone(note("D1") * 2, L) * 0.35, 0, 0, 0.35)
    write(reverb(out, 5, 0.5), "music/verdict.mp3", peak=0.5)


def music_ending():
    """Deposition (somber) -> assessment (reflective) -> ending (build and resolve to D major)."""
    a, b = slot("ending")
    L = b - a
    out = track(L)
    dep_end = scene_span("deposition")[1] - a
    ass_end = scene_span("assessment")[1] - a
    final_text = cue_time("ending", "intervene", "end") - a
    # Somber: low strings, one chord per ~9 s.
    somber = [["D3", "F3", "A3"], ["Bb2", "D3", "F3"], ["G2", "Bb2", "D3"], ["A2", "C#3", "E3"], ["D3", "F3", "A3"], ["Bb2", "D3", "G3"], ["A2", "C#3", "E3"]]
    t, i = 0.0, 0
    while t < dep_end:
        seg = min(11, dep_end - t + 3)
        place(out, chord(somber[i % len(somber)], seg, attack=3, release=3.5, bright=5), t, 0, 0.5)
        place(out, string_voice(note(somber[i % len(somber)][0].replace("3", "2").replace("2", "2")), seg, attack=3, release=3, bright=3), t, 0, 0.35)
        t += 9
        i += 1
    # Reflective: sparse high pads and glass harmonics.
    reflect = [["F3", "A3", "D4"], ["D3", "G3", "Bb3"], ["E3", "A3", "C#4"], ["F3", "A3", "D4"], ["D3", "F3", "Bb3"], ["E3", "G3", "C4"], ["F3", "A3", "C4"], ["E3", "A3", "C#4"]]
    t, i = dep_end, 0
    while t < ass_end:
        seg = min(10, ass_end - t + 3)
        place(out, chord(reflect[i % len(reflect)], seg, attack=3.5, release=4, bright=6) * 0.8, t, 0, 0.42)
        t += 8
        i += 1
    place(out, glass_harmonic(note("A5"), ass_end - dep_end), dep_end, 0.3, 0.03)
    # Build and resolve: melody on a solo line over fuller strings; D major on the end card.
    build = [["D3", "F3", "A3", "D4"], ["Bb2", "F3", "Bb3", "D4"], ["F3", "A3", "C4", "F4"], ["C3", "G3", "C4", "E4"],
             ["D3", "A3", "D4", "F4"], ["G2", "D3", "G3", "Bb3"], ["A2", "E3", "A3", "C#4"]]
    bar = (final_text - ass_end) / len(build)
    t = ass_end
    for i, ch in enumerate(build):
        g = 0.45 + 0.35 * i / len(build)
        place(out, chord(ch, bar + 3, attack=2.2, release=3, bright=8), t, 0, g)
        place(out, string_voice(note(ch[0]) / 2, bar + 3, attack=2, release=3, bright=3), t, 0, 0.4)
        t += bar
    melody = [("A4", 1.5), ("F4", 1), ("E4", 1), ("D4", 2), ("C4", 1), ("D4", 1), ("F4", 1.5), ("E4", 2.5), ("D4", 1.5), ("F4", 1), ("A4", 1.5), ("G4", 1), ("F4", 1), ("E4", 3)]
    beats = sum(d for _, d in melody)
    step = (final_text - ass_end) / beats
    t = ass_end + 0.5
    for nm, d in melody:
        place(out, string_voice(note(nm), d * step + 0.6, attack=0.5, release=0.9, bright=9, vibrato=0.006, voices=2), t, 0.1, 0.34)
        t += d * step
    # Resolution: D major, long swell under the closing cards and end card.
    res = L - final_text
    place(out, chord(["D3", "F#3", "A3", "D4", "F#4", "A4"], res, attack=2.5, release=min(8, res / 2), bright=9), final_text, 0, 0.8)
    place(out, string_voice(note("D2"), res, attack=2, release=min(8, res / 2), bright=3), final_text, 0, 0.5)
    place(out, timpani(note("D2"), 5, 0.8), final_text, 0, 0.55)
    write(reverb(out, 4, 0.38), "music/ending.mp3")


# ---------------------------------------------------------------- sound effects

def step_sound(weight=1.0):
    n = secs(0.35)
    t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * 85 * t) * np.exp(-t * 38)
    heel = noise(0.35, 150, 1400) * np.exp(-t * 55)
    creak = noise(0.35, 700, 2400) * np.exp(-((t - 0.05) ** 2) / 0.0006) * 0.25
    return (thump * 0.8 + heel * 0.6 + creak) * weight


def sfx_footsteps():
    out = track(4.2)
    for k in range(6):
        place(out, step_sound(0.8 + 0.2 * (k % 2)), 0.2 + k * 0.62 + rng.uniform(-0.03, 0.03), -0.2 + 0.08 * k)
    write(reverb(out, 1.4, 0.3, 4000), "sfx/footsteps.mp3")


def sfx_room_tone():
    L = scene_span("coldOpen")[1]
    out = track(L)
    bed = noise(L, 40, 500, color=2) * 0.5 * slow_random(L, 0.3, 0.2)
    place(out, bed, 0, -0.3)
    place(out, noise(L, 40, 500, color=2) * 0.5, 0, 0.3)
    for _ in range(int(L * 1.5)):  # candle crackle
        c = noise(0.02, 2000, 7000) * np.exp(-np.arange(secs(0.02)) / SR * 300)
        place(out, c * rng.uniform(0.05, 0.2), rng.uniform(0, L - 0.1), rng.uniform(-0.5, 0.5))
    write(out, "sfx/room-tone.mp3", peak=0.35)


def clink(gain=1.0, base=2240):
    n = secs(1.2)
    t = np.arange(n) / SR
    tone = sum(np.sin(2 * np.pi * base * m * t) * a * np.exp(-t * d) for m, a, d in ((1, 1, 5), (1.57, 0.6, 7), (2.29, 0.35, 9), (3.08, 0.2, 12)))
    tone[: secs(0.01)] += noise(0.01, 3000, 9000) * 0.5
    return tone * gain


def sfx_glass_set():
    out = track(1.6)
    t = np.arange(secs(0.2)) / SR
    place(out, np.sin(2 * np.pi * 140 * t) * np.exp(-t * 40) * 0.8, 0.05)
    place(out, clink(0.35, 2600), 0.05, 0.1)
    write(reverb(out, 1.0, 0.25, 7000), "sfx/glass-set.mp3", peak=0.7)


def sfx_glass_throw():
    out = track(2.2)
    splash = noise(0.9, 700, 5000) * env(secs(0.9), 0.02, 0.8, 1.5)
    place(out, splash, 0.05, 0.3, 0.8)
    for _ in range(18):
        d = noise(0.04, 1500, 6000) * np.exp(-np.arange(secs(0.04)) / SR * 90)
        place(out, d * rng.uniform(0.2, 0.5), rng.uniform(0.2, 1.1), rng.uniform(-0.2, 0.7))
    place(out, clink(0.5, 2100), 0.0, -0.1)
    write(reverb(out, 1.2, 0.25, 7000), "sfx/glass-throw.mp3", peak=0.75)


def sfx_carriage():
    L = 8.0
    out = track(L)
    passby = env(secs(L), 3, 3, 1.5)
    rumble = noise(L, 30, 300, color=2) * passby * slow_random(L, 3, 0.3)
    for ch in range(2):
        out[ch] += rumble * (0.6 + 0.4 * (np.linspace(0, 1, secs(L)) if ch else np.linspace(1, 0, secs(L))))
    t = 0.2
    while t < L - 0.3:
        for off in (0, 0.11):  # two-beat trot
            n = secs(0.12)
            clop = noise(0.12, 900, 3500) * np.exp(-np.arange(n) / SR * 60) + np.sin(2 * np.pi * 300 * np.arange(n) / SR) * np.exp(-np.arange(n) / SR * 70)
            pan = -0.8 + 1.6 * (t / L)
            place(out, clop * passby[min(secs(t), secs(L) - 1)] * 0.5, t + off, pan)
        t += 0.36
    write(reverb(out, 1.5, 0.2, 5000), "sfx/carriage.mp3", peak=0.7)


def chirp(f0=3200, f1=5200, seconds=0.12):
    n = secs(seconds)
    t = np.arange(n) / SR
    f = np.linspace(f0, f1, n) * (1 + 0.05 * np.sin(2 * np.pi * 40 * t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / seconds) ** 2


def birds(out, L, count, gain=0.12):
    for _ in range(count):
        at = rng.uniform(0.3, L - 1)
        f0 = rng.uniform(2600, 4200)
        for k in range(rng.integers(2, 5)):
            place(out, chirp(f0, f0 * rng.uniform(1.2, 1.6), rng.uniform(0.06, 0.14)) * gain, at + k * rng.uniform(0.12, 0.2), rng.uniform(-0.8, 0.8))


def murmur(L, lo=180, hi=1100):
    x = sum(noise(L, lo * rng.uniform(0.8, 1.2), hi * rng.uniform(0.8, 1.2)) * slow_random(L, 2.5, 0.8) for _ in range(5))
    return x / 5


def sfx_city():
    L = 12.0
    out = track(L)
    place(out, murmur(L) * 0.5 * env(secs(L), 2, 3), 0, -0.3)
    place(out, murmur(L) * 0.5 * env(secs(L), 2, 3), 0, 0.3)
    place(out, noise(L, 30, 250, color=2) * 0.3 * env(secs(L), 2, 3), 0)
    birds(out, L, 7, 0.08)
    write(reverb(out, 2.0, 0.35, 4000), "sfx/city.mp3", peak=0.5)


def sfx_morning():
    L = 10.0
    out = track(L)
    wind = noise(L, 100, 1200, color=1) * slow_random(L, 0.6, 0.5) * env(secs(L), 2.5, 3)
    place(out, wind * 0.35, 0, -0.2)
    place(out, wind[::-1] * 0.35, 0, 0.2)
    birds(out, L, 12, 0.14)
    write(reverb(out, 1.8, 0.3, 6000), "sfx/morning.mp3", peak=0.55)


def sfx_paper():
    L = 1.8
    out = track(L)
    for _ in range(9):
        n = secs(rng.uniform(0.05, 0.22))
        r = noise(n / SR, 1500, 9000) * np.sin(np.linspace(0, np.pi, n)) ** 1.5
        place(out, r * rng.uniform(0.3, 0.9), rng.uniform(0, L - 0.25), rng.uniform(-0.4, 0.4))
    write(reverb(out, 0.8, 0.2, 8000), "sfx/paper.mp3", peak=0.6)


def sfx_pen():
    L = 5.5
    out = track(L)
    t = 0.2
    while t < L - 0.4:
        d = rng.uniform(0.07, 0.24)
        n = secs(d)
        s = noise(d, 2500, 9000) * np.sin(np.linspace(0, np.pi, n)) * (0.6 + 0.4 * np.sin(np.linspace(0, rng.uniform(6, 14), n)))
        place(out, s * rng.uniform(0.4, 0.8), t, 0.1)
        t += d + rng.uniform(0.03, 0.18) + (0.5 if rng.uniform() < 0.1 else 0)
    write(reverb(out, 0.6, 0.15, 9000), "sfx/pen.mp3", peak=0.5)


def sfx_palace():
    L = 12.0
    out = track(L)
    place(out, noise(L, 40, 300, color=2) * 0.4 * env(secs(L), 2, 3), 0)
    for k in range(5):
        place(out, step_sound(0.35), 3 + k * 0.7, 0.5 - 0.1 * k)
    birds(out, L, 3, 0.04)
    write(reverb(out, 3.5, 0.55, 3500), "sfx/palace.mp3", peak=0.45)


def sfx_courtroom():
    L = scene_span("defence")[1] - scene_span("defence")[0]
    out = track(L)
    place(out, murmur(L, 150, 900) * 0.35 * env(secs(L), 3, 4), 0, -0.2)
    place(out, murmur(L, 150, 900) * 0.35 * env(secs(L), 3, 4), 0, 0.2)
    t = 2.0
    while t < L - 2:  # punkah creak
        n = secs(0.5)
        f = 180 + 60 * np.sin(np.linspace(0, np.pi, n))
        creak = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.sin(np.linspace(0, np.pi, n)) ** 2
        place(out, spectral_filter(creak, 300, 1800) * 0.05, t, 0.4)
        t += 3.1
    for _ in range(6):
        place(out, noise(0.3, 1500, 8000) * np.sin(np.linspace(0, np.pi, secs(0.3))) * 0.2, rng.uniform(2, L - 2), rng.uniform(-0.6, 0.6))
    write(reverb(out, 2.5, 0.45, 4000), "sfx/courtroom.mp3", peak=0.4)


def sfx_door():
    L = 5.0
    out = track(L)
    n = secs(1.3)
    t = np.arange(n) / SR
    f = np.linspace(210, 120, n) * (1 + 0.04 * np.sin(2 * np.pi * 9 * t))
    creak = spectral_filter(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)), 200, 2200) * env(n, 0.3, 0.3) * 0.25
    place(out, creak, 0.0, -0.2)
    m = secs(2.5)
    tt = np.arange(m) / SR
    boom = np.sin(2 * np.pi * np.cumsum(55 * (1 + 0.3 * np.exp(-tt * 12))) / SR) * np.exp(-tt * 2.2)
    boom[: secs(0.1)] += noise(0.1, 40, 1200) * np.exp(-np.arange(secs(0.1)) / SR * 30)
    place(out, boom, 1.25, 0, 1.0)
    latch = clink(0.15, 1600)[: secs(0.3)]
    place(out, latch, 1.35, 0.2)
    write(reverb(out, 3.5, 0.45, 3000), "sfx/door.mp3", peak=0.85)


if __name__ == "__main__":
    print("music")
    music_opening(); music_title(); music_investigation(); music_courtroom(); music_verdict(); music_ending()
    print("sfx")
    sfx_footsteps(); sfx_room_tone(); sfx_glass_set(); sfx_glass_throw(); sfx_carriage(); sfx_city()
    sfx_morning(); sfx_paper(); sfx_pen(); sfx_palace(); sfx_courtroom(); sfx_door()
