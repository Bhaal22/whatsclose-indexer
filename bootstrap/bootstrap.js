POST _aliases
{
"actions": [
  {
    "add": {
      "index": "whatsclose_dev",
      "alias": "whatsclose"
    }
  }
]
}

POST /_aliases
{
  "actions": [
    {
      "remove": {
        "index": "whatsclose-dev",
        "alias": "whatsclose"
      }
    },

    {
      "add": {
        "index": "whatsclose_2",
        "alias": "whatsclose"
      }
    }
  ]
}


