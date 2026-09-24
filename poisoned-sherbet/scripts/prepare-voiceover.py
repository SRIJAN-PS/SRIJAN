"""Turn raw narration recordings into one clip per narration line.

A scene can be recorded as a single take (all its lines, separated by blank
lines) or line by line. Takes are split at the pause nearest each expected
line boundary. Every clip is trimmed to its speech, long internal pauses are
shortened, and the tempo is adjusted without changing pitch.

  python3 scripts/prepare-voiceover.py RAW_DIR
    RAW_DIR/take-<sceneId>.mp3            whole-scene take
    RAW_DIR/take-<sceneId>2.mp3           a second take continuing the scene
    RAW_DIR/<sceneId>/<cueId>.wav|.mp3     single line
Writes public/audio/voiceover/<sceneId>/<cueId>.mp3 and prints a report.
"""
import array, json, os, subprocess, sys, wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FFMPEG = [os.path.join(ROOT, "node_modules/.bin/remotion"), "ffmpeg", "-y", "-loglevel", "error"]
SR = 44100
HOP = 441  # 10 ms
LEAD, TAIL = 0.06, 0.14  # seconds kept around speech
MAX_PAUSE = 0.42  # longest pause kept inside a line
TEMPO = float(os.environ.get("TEMPO", "1.05"))

def decode(path):
    tmp = path + ".wav"
    subprocess.run(FFMPEG + ["-i", path, "-ac", "1", "-ar", str(SR), "-sample_fmt", "s16", tmp], check=True)
    with wave.open(tmp) as w:
        data = array.array("h", w.readframes(w.getnframes()))
    os.remove(tmp)
    return data

def frames_rms(data):
    out = []
    for i in range(0, len(data) - HOP, HOP):
        seg = data[i:i + HOP]
        out.append((sum(x * x for x in seg) / HOP) ** 0.5)
    return out

def silences(rms, thresh, min_len):
    """(start, end) frame ranges below thresh lasting at least min_len frames."""
    out, s = [], None
    for i, v in enumerate(rms + [0]):
        if v < thresh and s is None:
            s = i
        elif v >= thresh and s is not None:
            if i - s >= min_len:
                out.append((s, i))
            s = None
    return out

def speech_bounds(rms, thresh):
    idx = [i for i, v in enumerate(rms) if v >= thresh]
    return idx[0], idx[-1] + 1

def weight(text):
    return len(text) + 12  # each line also carries its own pause/breath

def split_take(data, says):
    rms = frames_rms(data)
    thresh = max(rms) * 0.035
    start, end = speech_bounds(rms, thresh)
    gaps = [g for g in silences(rms, thresh, 18) if g[0] > start and g[1] < end]
    total = sum(weight(t) for t in says)
    cuts, prev, acc = [], start, 0
    for k in range(len(says) - 1):
        acc += weight(says[k])
        expect = start + (end - start) * acc / total
        remaining = len(says) - 2 - k
        best, best_score = None, -1e9
        for gi, g in enumerate(gaps):
            if g[0] <= prev:
                continue
            if len([h for h in gaps if h[0] > g[1]]) < remaining:
                continue
            mid = (g[0] + g[1]) / 2
            score = (g[1] - g[0]) - abs(mid - expect) * 0.12
            if score > best_score:
                best, best_score = g, score
        if best is None:
            raise SystemExit("could not split take")
        cuts.append(best)
        prev = best[1]
    pieces, s = [], start
    for g in cuts:
        pieces.append((s, g[0]))
        s = g[1]
    pieces.append((s, end))
    return [data[a * HOP:b * HOP] for a, b in pieces], rms

def tidy(seg):
    """Trim to speech, shorten long internal pauses."""
    rms = frames_rms(seg)
    if not rms:
        return seg
    thresh = max(rms) * 0.035
    a, b = speech_bounds(rms, thresh)
    keep = array.array("h")
    cursor = a
    for g0, g1 in silences(rms, thresh, int(MAX_PAUSE * 100) + 1):
        if g0 <= a or g1 >= b:
            continue
        keep.extend(seg[cursor * HOP:g0 * HOP])
        half = int(MAX_PAUSE * 100 / 2)
        keep.extend(seg[g0 * HOP:(g0 + half) * HOP])
        keep.extend(seg[(g1 - half) * HOP:g1 * HOP])
        cursor = g1
    keep.extend(seg[cursor * HOP:b * HOP])
    lead = array.array("h", [0]) * int(LEAD * SR)
    lo = max(0, a * HOP - int(LEAD * SR))
    tail_end = min(len(seg), b * HOP + int(TAIL * SR))
    out = array.array("h", seg[lo:a * HOP]) if lo < a * HOP else lead
    out.extend(keep)
    out.extend(seg[b * HOP:tail_end])
    # 10 ms fades so cuts never click
    n = int(0.01 * SR)
    for i in range(min(n, len(out))):
        out[i] = int(out[i] * i / n)
        out[-1 - i] = int(out[-1 - i] * i / n)
    return out

TARGET_RMS_DB = -18.0  # speech loudness of every clip
PEAK_DB = -1.0


def level(seg):
    """Scale a clip so its speech sits at TARGET_RMS_DB, never peaking above PEAK_DB."""
    x = [v / 32768 for v in seg]
    loud = [v for v in x if abs(v) > 0.01] or x
    rms = (sum(v * v for v in loud) / len(loud)) ** 0.5
    peak = max(abs(v) for v in x) or 1
    gain = min(10 ** (TARGET_RMS_DB / 20) / max(rms, 1e-6), 10 ** (PEAK_DB / 20) / peak)
    return array.array("h", [max(-32767, min(32767, int(v * gain * 32768))) for v in x])


def write(seg, dest):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    tmp = dest + ".wav"
    with wave.open(tmp, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(seg.tobytes())
    subprocess.run(FFMPEG + ["-i", tmp, "-af", f"atempo={TEMPO}", "-ac", "1", "-b:a", "128k", dest], check=True)
    os.remove(tmp)
    return len(seg) / SR / TEMPO

def main(raw):
    story = json.loads(subprocess.run(
        ["node", "--experimental-strip-types", "--no-warnings", os.path.join(ROOT, "scripts/print-takes.ts"), "--json"],
        capture_output=True, text=True, check=True).stdout)
    out_root = os.path.join(ROOT, "public/audio/voiceover")
    total = 0.0
    for scene in story:
        cues = scene["cues"]
        done = {}
        single = os.path.join(raw, scene["id"])
        for c in cues:
            for ext in (".wav", ".mp3"):
                p = os.path.join(single, c["id"] + ext)
                if os.path.exists(p):
                    done[c["id"]] = decode(p)
                    break
        # Takes cover the lines not recorded singly, in order.
        rest = [c for c in cues if c["id"] not in done]
        takes = sorted(f for f in (os.listdir(raw) if os.path.isdir(raw) else []) if f.startswith(f"take-{scene['id']}") and f.endswith(".mp3")
                       and f[len(f"take-{scene['id']}"):-4] in ("", "2", "3"))
        if rest and takes:
            data = array.array("h")
            for t in takes:
                data.extend(decode(os.path.join(raw, t)))
                data.extend(array.array("h", [0]) * int(0.8 * SR))
            pieces, _ = split_take(data, [c["say"] for c in rest])
            for c, seg in zip(rest, pieces):
                done[c["id"]] = seg
        for c in cues:
            if c["id"] not in done:
                print(f"  MISSING {scene['id']}/{c['id']}")
                continue
            secs = write(level(tidy(done[c["id"]])), os.path.join(out_root, scene["id"], c["id"] + ".mp3"))
            total += secs
            rate = len(c["say"]) / secs
            flag = "  <-- check" if rate < 9 or rate > 19 else ""
            print(f"  {scene['id']}/{c['id']}: {secs:5.2f}s  {rate:4.1f} chars/s{flag}")
    print(f"total speech {total:.1f}s")

main(sys.argv[1])
