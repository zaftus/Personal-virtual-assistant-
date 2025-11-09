#!/usr/bin/env bash
set -euo pipefail
echo "Running backend tests..."
cd api && npm ci && npm test
echo "Running frontend tests..."
cd ../web && npm ci && npm test
echo "Running nlp tests..."
cd ../nlp && python -m pytest -q
