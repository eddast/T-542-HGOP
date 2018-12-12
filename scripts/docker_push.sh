#!/bin/bash

GIT_COMMIT=$1
docker push eddast/hgop:game-api-$GIT_COMMIT || exit 1
docker push eddast/hgop:game-client-$GIT_COMMIT || exit 1
