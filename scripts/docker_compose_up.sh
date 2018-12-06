#!/bin/bash

export TAG=$1
docker-compose down
docker-compose up
