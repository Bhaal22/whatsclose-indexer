#!/bin/bash

docker run -d -p 9200:9200 -p 9300:9300 -v "/var/whatsclose-data":/usr/share/elasticsearch/data -e "discovery.type=single-node" -e "xpack.security.enabled=false" docker.elastic.co/elasticsearch/elasticsearch:5.6.1
