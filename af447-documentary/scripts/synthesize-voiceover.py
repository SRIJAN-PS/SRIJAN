"""Record every narration line in Hindi locally with Kokoro (Apache-2.0) via sherpa-onnx.

  pip install sherpa-onnx soundfile numpy
  # model: github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-multi-lang-v1_0.tar.bz2
  KOKORO_DIR=/path/to/kokoro-multi-lang-v1_0 python3 scripts/synthesize-voiceover.py RAW_DIR [sceneId ...]

The Devanagari `say` text is phonemised by espeak-ng (Hindi).
Writes RAW_DIR/<sceneId>/<cueId>.wav; then run scripts/prepare-voiceover.py RAW_DIR.
"""
import json, os, subprocess, sys
import numpy as np, sherpa_onnx, soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
K = os.environ["KOKORO_DIR"].rstrip("/") + "/"
VOICE = int(os.environ.get("VOICE", "33"))  # 33 = hm_omega (Hindi, male)
SPEED = float(os.environ.get("SPEED", "0.92"))

tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
    kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(
        model=K + "model.onnx", voices=K + "voices.bin", tokens=K + "tokens.txt",
        lexicon=K + "lexicon-us-en.txt," + K + "lexicon-zh.txt",
        data_dir=K + "espeak-ng-data", dict_dir=K + "dict", lang="hi"),
    num_threads=4)))

story = json.loads(subprocess.run(
    ["node", "--experimental-strip-types", "--no-warnings", os.path.join(ROOT, "scripts/print-takes.ts"), "--json"],
    capture_output=True, text=True, check=True).stdout)
raw, only = sys.argv[1], set(sys.argv[2:])
for scene in story:
    if only and scene["id"] not in only:
        continue
    os.makedirs(os.path.join(raw, scene["id"]), exist_ok=True)
    for cue in scene["cues"]:
        audio = tts.generate(cue["say"], sid=VOICE, speed=SPEED)
        sf.write(os.path.join(raw, scene["id"], cue["id"] + ".wav"), np.array(audio.samples), audio.sample_rate)
        print(f"{scene['id']}/{cue['id']}: {len(audio.samples) / audio.sample_rate:.2f}s", flush=True)
