#!/bin/bash

export TAG=$1
echo $1
docker-compose down
docker-compose up
