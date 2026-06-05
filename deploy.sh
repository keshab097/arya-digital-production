#!/usr/bin/env bash
# Rebuild and publish the homepage to GitHub Pages.
# Usage: ./deploy.sh   (gh CLI must be signed in for the git push auth)
set -e

REPO_URL="https://github.com/keshab097/arya-digital-production.git"
LIVE_URL="https://keshab097.github.io/arya-digital-production/"

echo "Building (GitHub Pages base path)..."
GH_PAGES=1 npm run build

echo "Publishing dist/ to gh-pages branch..."
cd dist
touch .nojekyll          # tell Pages not to run Jekyll
rm -rf .git
git init -q
git checkout -q -b gh-pages
git add -A
git commit -q -m "Deploy homepage to GitHub Pages"
git push -fq "$REPO_URL" gh-pages
cd ..

echo "Done. Live in ~1 minute at: $LIVE_URL"
