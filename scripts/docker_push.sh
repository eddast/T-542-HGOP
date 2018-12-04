#!/bin/bash

GIT_COMMIT=$1
docker push eddast/hgop:$GIT_COMMIT || exit 1
