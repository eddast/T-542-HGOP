#!/bin/bash

cd /home/eddda/Documents/T-542-HGOP/game-api
docker build -t testnewapi .
docker tag testnewapi eddast/hgop:testnewapi
docker push eddast/hgop:testnewapi
cd /home/eddda/Documents/T-542-HGOP/game-client
docker build -t testnewclient .
docker tag testnewclient eddast/hgop:testnewclient
docker push eddast/hgop:testnewclient
cd /home/eddda/Documents/T-542-HGOP
docker-compose pull
export API_URL=localhost
docker-compose up
