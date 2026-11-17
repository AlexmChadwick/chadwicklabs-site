#!/bin/sh
# Copies the static site from src/ into dist/. No dependencies.
set -eu
cd "$(dirname "$0")"
rm -rf dist
mkdir -p dist
cp -R src/. dist/
printf 'chadwicklabs.com\n' > dist/CNAME
: > dist/.nojekyll
echo "built dist/ ($(du -sk dist | cut -f1) KB)"
