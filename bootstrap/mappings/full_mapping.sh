#!/bin/sh

usage() {
    echo "Fullfill Whatsclose.io initial mapping:"
    echo "  full_mapping.sh elastic_search_hostname" 
}

if [ $# -eq 0 ]; then
    usage
    exit 1
fi

es_hostname=$1

curl -XPUT "http://$es_hostname:9200/whatsclose/" -d '
{
  "settings": {
    "analysis": {
      "filter": {
        "autocomplete_filter": {
          "type":     "edge_ngram",
          "min_gram": 1,
          "max_gram": 20
        }
      },
      "analyzer": {
        "autocomplete": {
          "type":      "custom",
          "tokenizer": "keyword",
          "filter": [
            "lowercase",
            "autocomplete_filter"
          ]
        },
        "autocomplete_search": {
          "tokenizer": "keyword"
        }
      }
    }
  },
  "mappings": {
    "band" : {
      "properties": {
        "name" : {
          "type" : "text",
          "fields": {
            "exact": {
              "type" : "string",
              "index": "not_analyzed"
            },
            "not_exact": {
              "type": "string",
              "analyzer":  "autocomplete",
              "search_analyzer": "standard"
            }
          }
        },
        "website" : { "type" : "string" },
        "styles" :  { "type" : "string" },
        "last_crawl_date" : { "type": "date", "format" : "YYYY-MM-dd" }
      }
    },

    "concert" : {
      "properties": {
       "bandName" : {
          "type" : "text",
          "fields": {
            "exact": {
              "type" : "string",
              "index": "not_analyzed"
            },
            "not_exact": {
              "type": "string",
              "analyzer":  "autocomplete",
              "search_analyzer": "standard"
            }
          }
        },
        "styles" :   { "type": "string" },
        "date" :     { "type" : "date", "format" : "YYYY-MM-dd" },
        "location" : { "type" : "string" },
        "venue" : { "type": "string" },
        "geometry" : { "type" : "geo_point"}
      }
    },
    "multiple.concert" : {
      "properties": {
        "bandName" : {
          "type" : "text",
          "fields": {
            "exact": {
              "type" : "string",
              "index": "not_analyzed"
            },
            "not_exact": {
              "type": "string",
              "analyzer":  "autocomplete",
              "search_analyzer": "standard"
            }
          }
        },
        "styles" :   { "type": "string" },
        "date" :     { "type" : "date", "format" : "YYYY-MM-dd" },
        "location" : { "type" : "string" },
        "venue" :    { "type": "string" },
        "geometries" : { "type" : "nested",
                         "properties": {
                           "formatted_address" : { "type": "string" },
                           "geometry" : { "type": "geo_point" }
                         }
                       }
      }
    },
    "venue": {
      "properties": {
        "name" : {
          "type" : "text",
          "fields": {
            "exact": {
              "type" : "string",
              "index": "not_analyzed"
            },
            "not_exact": {
              "type": "string",
              "analyzer":  "autocomplete",
              "search_analyzer": "standard"
            }
          }
        },
        "website": { "type": "string" },
        "type": { "type": "string" },
        "location" : { "type" : "string" },
        "geometry" : { "type" : "geo_point"}
      }
    }
  }
}
'
