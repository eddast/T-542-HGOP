#!/bin/bash

GIT_COMMIT=$1
cd game-api || exit 1
docker build -t eddast/hgop:game-api-$GIT_COMMIT . || exit 1
cd ../game-client || exit 1
docker build -t eddast/hgop:game-client-$GIT_COMMIT . || exit 1