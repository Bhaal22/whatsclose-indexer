GET _snapshot/backup_ws_1
PUT _snapshot/backup_ws_1
{
  "type": "fs",
  "settings": {
    "location": "D:\\dev\\tools\\elasticsearch-1.3.2",
    "compress": true
  }
}

PUT _snapshot/backup_ws_1/ws_1?wait_for_completion=true
{
  "indices": "whatsclose"
}
DELETE _snapshot/backup_ws_1/ws_1

POST _snapshot/backup_ws_1/ws_1/_restore
{
  "indices": "whatsclose",
  "rename_pattern": "whatsclose",
  "rename_replacement": "whatsclose.dev"
  
}

POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "whatsclose.dev",
        "alias": "whatsclose"
      }
    }
  ]
}
