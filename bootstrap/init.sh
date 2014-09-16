curl -XPUT 'http://localhost:9200/whatsclose/_mapping' -d '
{
  "mappings": {
    "band" : {
    	"properties": {
	      "name" : { "type" : "string" },
	      "website" : { "type" : "string" },
	      "styles" : { "type" : "string", "index_name" : "style" }
	     }
    },
    "concert" : {
      "properties": {
        "bandName" : { 
          "type": "multi_field",
          "fields": {
            "exact": {
              "type" : "string",
              "index": "not_analyzed"
            },
            "not_exact": {
              "type": "string",
              "analyzer": "standard"
            }
          }
        },
        "styles" : {
        	"type": "string",
        	"index_name" : "style"
        },
        "date" : {
        	"type" : "date",
        	"format" : "YYYY-MM-dd"
        },
        "location" : { "type" : "string" },
        "venue" : { "type": "string" },
        "geometry" : { "type" : "geo_point"}
      }
    },
    "multiple.concert" : {
      "properties": {
        "bandName" : { 
          "type": "multi_field",
          "fields": {
            "exact": {
              "type" : "string",
              "index": "not_analyzed"
            },
            "not_exact": {
              "type": "string",
              "analyzer": "standard"
            }
          }
        },
        "styles" : {
	        "type": "string",
	        "index_name" : "tyle"
        },
        "date" : {
	        "type" : "date",
	        "format" : "YYYY-MM-dd"
        },
        "location" : { "type" : "string" },
        "venue" : { "type": "string" },
        "geometries" : {
          "type" : "nested",
          "index_name": "geo",
          "properties": {
            "formatted_address" : { "type": "string" },
            "geometry" : { "type": "geo_point" }
          }
        } 
      } 
    }
  }
}
'