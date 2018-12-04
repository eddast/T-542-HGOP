#!/bin/bash

GIT_COMMIT=$1
cd game-api || exit 1
docker build -t eddast/hgop:$GIT_COMMIT . || exit 1