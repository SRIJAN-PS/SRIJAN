"""Synthesise the music score and sound effects for AF447 from scratch (no samples).

Additive strings with ensemble detune and vibrato, Karplus-Strong plucks,
timpani, glass harmonics, shaped noise for engines, weather, radio, sonar and
the sea, and a convolution reverb. Cue lengths come from out/timeline.json,
so every cue fits its section. Cockpit alerts are approximations of the
aural alerts (no voice callouts).

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

def slot(id_):
    m = next(m for m in T["music"] if m["id"] == id_)
    return m["start"], m["end"]


def scene_span(scene):
    s = next(s for s in T["scenes"] if s["id"] == scene)
    return s["start"], s["end"]


def cue_time(scene, cue, edge="start"):
    s = next(s for s in T["scenes"] if s["id"] == scene)
    return next(c for c in s["cues"] if c["id"] == cue)[edge]


def piano(freq, seconds=4.0, gain=1.0):
    """Soft piano-like tone: plucked string with a long decay."""
    return pluck(freq, seconds, damp=0.9985) * gain


def pad_progression(out, chords, start, end, bar, gain, bright=6, bass=True, attack=2.5):
    t, i = start, 0
    while t < end:
        seg = min(bar + 2.5, end - t + 2.5)
        ch = chords[i % len(chords)]
        place(out, chord(ch, seg, attack=attack, release=3, bright=bright), t, 0, gain)
        if bass:
            place(out, string_voice(note(ch[0]) / 2, seg, attack=2, release=3, bright=3), t, 0, gain * 0.8)
        t += bar
        i += 1


AM = [["A2", "E3", "A3", "C4"], ["F2", "C3", "F3", "A3"], ["C3", "G3", "C4", "E4"], ["G2", "D3", "G3", "B3"]]


def music_opening():
    a, b = slot("opening")
    L = b - a
    out = track(L)
    place(out, low_drone(note("A1") * 2, L), 0, 0, 0.7)
    pad_progression(out, AM, 1.0, L - 3, 9.0, 0.45, bright=5)
    motif = ["E5", "C5", "A4", "B4", "C5", "A4"]
    t = 6.0
    k = 0
    while t < L - 6:
        place(out, piano(note(motif[k % len(motif)]), 4, 0.3), t, 0.2 if k % 2 else -0.2)
        t += 2.2 if k % 3 != 2 else 3.6
        k += 1
    write(reverb(out, 4.5, 0.45), "music/opening.mp3")


def music_cruise():
    a, b = slot("cruise")
    L = b - a
    out = track(L)
    weather = scene_span("normalFlight")[0] - a
    try:
        weather = cue_time("normalFlight", "weather") - a
    except StopIteration:
        pass
    pitot = scene_span("pitotProblem")[0] - a
    pad_progression(out, AM, 0, L, 10.0, 0.42, bright=5)
    # gentle pulse
    t = 4.0
    while t < L - 2:
        g = 0.12 if t < weather else 0.22 if t < pitot else 0.32
        place(out, timpani(note("A1"), 1.4, 0.6), t, 0, g)
        t += 2.0 if t < pitot else 1.4
    # unease: high sustained note from the weather on, rising in the pitot scene
    place(out, string_voice(note("E5"), L - weather, attack=8, release=4, bright=3, vibrato=0.002) * 0.3, weather, 0.3, 0.6)
    place(out, string_voice(note("F5"), L - pitot, attack=6, release=3, bright=3, vibrato=0.002) * 0.3, pitot, -0.3, 0.6)
    write(reverb(out, 3.5, 0.38), "music/cruise.mp3")


def music_tension():
    a, b = slot("tension")
    L = b - a
    out = track(L)
    place(out, low_drone(note("A1") * 2, L), 0, 0, 0.8)
    cluster = [["A2", "E3", "Bb3"], ["A2", "F3", "Bb3"], ["A2", "E3", "B3"], ["A2", "F3", "C4"]]
    pad_progression(out, cluster, 0, L, 7.0, 0.5, bright=7, bass=False, attack=1.5)
    # heartbeat that quickens from ~60 to ~96 bpm
    t = 1.0
    while t < L - 2:
        bpm = 60 + 36 * (t / L)
        g = 0.4 + 0.5 * (t / L)
        place(out, timpani(note("A1"), 1.2, 0.8), t, 0, 0.5 * g)
        place(out, timpani(note("A1"), 1.0, 0.5), t + 0.24, 0, 0.35 * g)
        t += 60 / bpm
    # low string ostinato in the second half
    osti = ["A2", "A2", "Bb2", "A2"]
    t, k = L * 0.45, 0
    while t < L - 1:
        place(out, pluck(note(osti[k % 4]), 0.8), t, 0.3 if k % 2 else -0.3, 0.35)
        t += 0.32
        k += 1
    place(out, string_voice(note("Bb5"), L * 0.6, attack=6, release=2, bright=3, vibrato=0.003) * 0.3, L * 0.4, 0.2, 0.7)
    write(reverb(out, 3.0, 0.32), "music/tension.mp3")


def music_deep():
    a, b = slot("deep")
    L = b - a
    out = track(L)
    place(out, low_drone(note("D1") * 2, L), 0, 0, 0.8)
    place(out, low_drone(note("A1") * 2, L) * 0.5, 0, 0.2, 0.6)
    place(out, glass_harmonic(note("A5"), L * 0.7), L * 0.1, 0.4, 0.04)
    place(out, glass_harmonic(note("E6"), L * 0.5), L * 0.4, -0.4, 0.03)
    t = 5.0
    notes = ["D4", "A3", "F4", "E4"]
    k = 0
    while t < L - 6:
        place(out, piano(note(notes[k % 4]), 5, 0.22), t, -0.3 + 0.2 * (k % 3))
        t += 7.5
        k += 1
    write(reverb(out, 5.5, 0.5), "music/deep.mp3")


def music_discovery():
    a, b = slot("discovery")
    L = b - a
    out = track(L)
    found = cue_time("twoYears", "april") - a
    prog = [["D3", "A3", "D4", "F4"], ["Bb2", "F3", "Bb3", "D4"], ["F3", "C4", "F4", "A4"], ["C3", "G3", "C4", "E4"]]
    pad_progression(out, prog, 0, L, 8.0, 0.4, bright=5)
    t = 2.0
    while t < L - 2:
        g = 0.15 if t < found else 0.28
        place(out, timpani(note("D2"), 1.2, 0.6), t, 0, g)
        t += 1.6
    arp = ["D4", "F4", "A4", "D5", "A4", "F4"]
    t, k = found, 0
    while t < L - 3:
        place(out, piano(note(arp[k % 6]), 2.5, 0.22), t, 0.25 if k % 2 else -0.25)
        t += 0.8
        k += 1
    write(reverb(out, 3.8, 0.4), "music/discovery.mp3")


def music_reflection():
    a, b = slot("reflection")
    L = b - a
    out = track(L)
    prog = [["A2", "E3", "A3", "C4"], ["F2", "C3", "A3", "C4"], ["D3", "A3", "D4", "F4"], ["E2", "B2", "E3", "G#3"]]
    pad_progression(out, prog, 0, L, 10.0, 0.38, bright=4.5)
    melody = ["C5", "B4", "A4", "E4", "F4", "E4", "D4", "E4"]
    t, k = 8.0, 0
    while t < L - 8:
        place(out, piano(note(melody[k % 8]), 5, 0.2), t, 0.15)
        t += 5.0
        k += 1
    write(reverb(out, 4.5, 0.45), "music/reflection.mp3")


def music_ending():
    a, b = slot("ending")
    L = b - a
    out = track(L)
    final = cue_time("ending", "decisions", "end") - a
    prog = [["A2", "E3", "A3", "C4"], ["F2", "C3", "A3", "C4"], ["C3", "G3", "C4", "E4"], ["G2", "D3", "B3", "D4"],
            ["A2", "E3", "A3", "C4"], ["F2", "C3", "A3", "C4"], ["G2", "D3", "G3", "B3"]]
    bar = final / len(prog)
    t = 0.0
    for i, ch in enumerate(prog):
        g = 0.4 + 0.25 * i / len(prog)
        place(out, chord(ch, bar + 3, attack=2.5, release=3, bright=7), t, 0, g)
        place(out, string_voice(note(ch[0]) / 2, bar + 3, attack=2, release=3, bright=3), t, 0, 0.35)
        t += bar
    melody = [("E5", 2), ("C5", 1), ("B4", 1), ("A4", 3), ("C5", 1), ("D5", 1), ("E5", 2), ("G5", 1.5), ("F5", 1), ("E5", 1.5), ("D5", 3)]
    beats = sum(d for _, d in melody)
    step = final / beats
    t = 0.5
    for nm, d in melody:
        place(out, string_voice(note(nm), d * step + 0.6, attack=0.6, release=1.0, bright=9, vibrato=0.006, voices=2), t, 0.1, 0.3)
        t += d * step
    res = L - final
    place(out, chord(["C3", "G3", "C4", "E4", "G4"], res, attack=2.5, release=min(6, res / 2), bright=8), final, 0, 0.7)
    place(out, string_voice(note("C2"), res, attack=2, release=min(6, res / 2), bright=3), final, 0, 0.45)
    write(reverb(out, 4.5, 0.4), "music/ending.mp3")


# ---------------------------------------------------------------- sound effects

def jet(seconds, spool=None, whine=2600.0):
    """Jet engine: broadband roar plus a turbine whine; `spool` 0..1 array sets the thrust."""
    n = secs(seconds)
    s = np.ones(n) if spool is None else spool
    roar = noise(seconds, 40, 5000, color=1.2)
    # brighten with thrust: crossfade between a dark and a bright version
    dark = spectral_filter(roar, 40, 700)
    out = dark * (0.6 + 0.4 * s) + roar * s * 0.5
    t = np.arange(n) / SR
    f = whine * (0.6 + 0.4 * s)
    out += 0.05 * np.sin(2 * np.pi * np.cumsum(f) / SR) * s
    return out * (0.3 + 0.7 * s)


def sfx_airport():
    L = scene_span("opening")[1] - scene_span("opening")[0]
    out = track(L)
    place(out, noise(L, 60, 900, color=1.5) * 0.4 * env(secs(L), 3, 4), 0, -0.2)
    distant = jet(L, whine=3200) * 0.25 * env(secs(L), 4, 4)
    place(out, spectral_filter(distant, 80, 2500), 0, 0.3)
    write(reverb(out, 2.5, 0.4, 3000), "sfx/airport.mp3", peak=0.5)


def sfx_takeoff():
    L = 16.0
    n = secs(L)
    t = np.arange(n) / SR
    spool = np.clip((t - 0.5) / 5, 0, 1) ** 0.8
    fade = np.clip(1 - (t - 9) / 7, 0, 1)
    x = jet(L, spool) * fade
    out = np.array([x * (1 - 0.3 * np.clip((t - 6) / 8, 0, 1)), x * (0.7 + 0.3 * np.clip((t - 6) / 8, 0, 1))])
    write(reverb(out, 2.0, 0.3, 4000), "sfx/takeoff.mp3", peak=0.85)


def sfx_cabin():
    L = scene_span("normalFlight")[1] - scene_span("normalFlight")[0] + 1
    out = track(L)
    bed = noise(L, 30, 400, color=2) * env(secs(L), 3, 3)
    place(out, bed, 0, -0.3)
    place(out, noise(L, 30, 400, color=2) * env(secs(L), 3, 3), 0, 0.3)
    place(out, noise(L, 400, 2500, color=1) * 0.12 * env(secs(L), 3, 3), 0)
    write(out, "sfx/cabin.mp3", peak=0.5)


def sfx_cockpit():
    L = 58.0
    out = track(L)
    bed = noise(L, 40, 600, color=1.8) * slow_random(L, 0.8, 0.15)
    place(out, bed * env(secs(L), 2, 3), 0, -0.2)
    place(out, noise(L, 800, 4000, color=0.5) * 0.15 * env(secs(L), 2, 3), 0, 0.2)
    t = np.arange(secs(L)) / SR
    place(out, np.sin(2 * np.pi * 400 * t) * 0.02 * env(secs(L), 2, 3), 0)
    write(out, "sfx/cockpit.mp3", peak=0.5)


def sfx_weather():
    L = 14.0
    out = track(L)
    rain = noise(L, 1500, 9000) * slow_random(L, 4, 0.5) * env(secs(L), 2, 3)
    place(out, rain * 0.5, 0, -0.3)
    place(out, noise(L, 1500, 9000) * slow_random(L, 4, 0.5) * env(secs(L), 2, 3) * 0.5, 0, 0.3)
    rumble = noise(L, 20, 150, color=2) * slow_random(L, 1.5, 0.7) * env(secs(L), 2, 3)
    place(out, rumble, 0)
    write(out, "sfx/weather.mp3", peak=0.6)


def sfx_ice():
    L = 9.0
    out = track(L)
    for _ in range(900):
        d = noise(0.006, 3000, 12000) * np.exp(-np.arange(secs(0.006)) / SR * 700)
        place(out, d * rng.uniform(0.05, 0.3), rng.uniform(0.3, L - 0.5), rng.uniform(-0.8, 0.8))
    place(out, noise(L, 4000, 12000) * 0.08 * env(secs(L), 2, 2), 0)
    write(out, "sfx/ice.mp3", peak=0.5)


def tone(freq, seconds, harmonics=(1, 0.5, 0.25), decay=0.0):
    n = secs(seconds)
    t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * freq * (k + 1) * t) for k, a in enumerate(harmonics))
    if decay:
        x *= np.exp(-t * decay)
    return x * env(n, 0.005, 0.02, 1)


def sfx_ap_disconnect():
    """Approximation of the autopilot-disconnect 'cavalry charge' (brass-like arpeggio)."""
    out = track(3.0)
    seq = ["G4", "C5", "E5", "G5", "E5", "G5"]
    t = 0.05
    for rep in range(2):
        for i, nm in enumerate(seq):
            d = 0.11 if i < 5 else 0.3
            place(out, tone(note(nm), d, (1, 0.7, 0.5, 0.3, 0.15)) * 0.5, t, 0)
            t += d
        t += 0.15
    write(reverb(out, 0.6, 0.15, 6000), "sfx/ap-disconnect.mp3", peak=0.7)


def sfx_chime():
    out = track(2.0)
    place(out, tone(1150, 1.2, (1, 0.3), decay=3.5), 0.05, 0)
    write(reverb(out, 0.6, 0.15, 6000), "sfx/chime.mp3", peak=0.6)


def sfx_stall_warning():
    """Approximation of the stall 'cricket' alert (no voice callout)."""
    L = 10.0
    out = track(L)
    t = 0.1
    while t < L - 0.4:
        burst = tone(2900, 0.16, (1, 0.2)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 32 * np.arange(secs(0.16)) / SR)))
        place(out, burst * 0.5, t, 0)
        t += 0.28 if int(t * 10) % 5 else 0.5
    write(out, "sfx/stall-warning.mp3", peak=0.55)


def sfx_radio():
    L = 4.0
    out = track(L)
    st = noise(L, 300, 3400) * env(secs(L), 0.02, 0.6) * slow_random(L, 8, 0.6)
    place(out, st * 0.6, 0, 0)
    place(out, tone(1000, 0.12) * 0.3, 0.02, 0)
    write(out, "sfx/radio.mp3", peak=0.5)


def sfx_radar():
    L = 6.0
    out = track(L)
    for k, t in enumerate([0.3, 1.8, 3.3, 4.8]):
        place(out, tone(880, 0.25, (1, 0.2), decay=10) * (0.6 if k < 3 else 0.25), t, 0)
    write(reverb(out, 1.2, 0.3), "sfx/radar.mp3", peak=0.5)


def sfx_sea():
    L = 16.0
    out = track(L)
    for ch_pan in (-0.4, 0.4):
        swell = 0.5 + 0.5 * np.sin(2 * np.pi * np.arange(secs(L)) / SR / 6.5 + rng.uniform(0, 6))
        place(out, noise(L, 80, 2500, color=1.3) * swell * env(secs(L), 2.5, 3), 0, ch_pan)
    write(out, "sfx/sea.mp3", peak=0.55)


def sfx_sonar():
    L = 13.0
    out = track(L)
    for t in (0.2, 3.4, 6.6, 9.8):
        place(out, tone(1500, 1.8, (1, 0.1), decay=2.2) * 0.6, t, 0)
    write(reverb(out, 3.5, 0.55, 5000), "sfx/sonar.mp3", peak=0.6)


def sfx_underwater():
    L = 16.0
    out = track(L)
    place(out, noise(L, 20, 250, color=2) * env(secs(L), 3, 3), 0)
    for _ in range(40):
        f0 = rng.uniform(400, 1200)
        n = secs(0.08)
        tt = np.arange(n) / SR
        bub = np.sin(2 * np.pi * np.cumsum(f0 * (1 + tt * 6)) / SR) * np.exp(-tt * 40)
        place(out, bub * rng.uniform(0.05, 0.2), rng.uniform(0.5, L - 0.5), rng.uniform(-0.6, 0.6))
    write(reverb(out, 3.0, 0.5, 2000), "sfx/underwater.mp3", peak=0.55)


def sfx_data():
    L = 9.0
    out = track(L)
    place(out, noise(L, 100, 1200, color=1.5) * 0.25 * env(secs(L), 1, 2), 0)
    t = 0.4
    while t < L - 0.5:
        place(out, tone(rng.choice([1320, 1760, 2093]), 0.05, (1,)) * 0.2, t, rng.uniform(-0.3, 0.3))
        t += rng.uniform(0.15, 0.6)
    write(out, "sfx/data.mp3", peak=0.45)


if __name__ == "__main__":
    print("music")
    music_opening(); music_cruise(); music_tension(); music_deep(); music_discovery(); music_reflection(); music_ending()
    print("sfx")
    sfx_airport(); sfx_takeoff(); sfx_cabin(); sfx_cockpit(); sfx_weather(); sfx_ice(); sfx_ap_disconnect(); sfx_chime()
    sfx_stall_warning(); sfx_radio(); sfx_radar(); sfx_sea(); sfx_sonar(); sfx_underwater(); sfx_data()
