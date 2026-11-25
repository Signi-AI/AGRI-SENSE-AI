#!/usr/bin/env bash
# Nakili artifacts za ML kutoka chanzo (hii folder) kwenda nakala ya runtime
# inayotumika na backend API. Endesha baada ya kutrain au kuhariri ML.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ML="$ROOT/machine-learning"
BE="$ROOT/backend/app/ml"

cp "$ML/src/diagnostic_functions.py" "$BE/diagnostic_functions.py"
cp "$ML/models/crop_recommendation_model.pkl" "$BE/crop_recommendation_model.pkl"
cp "$ML/viwango_vya_mazao.json" "$BE/viwango_vya_mazao.json"

echo "ML runtime artifacts zimesawazishwa: $BE"
