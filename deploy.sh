#!/bin/bash

set -e
GITURL=`git config remote.origin.url`
npm install
node build.js --deploy
cp CNAME build
cd build
git add --all
git commit -am "deploy"
git push origin HEAD:gh-pages
cd ..
