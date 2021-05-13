#!/bin/bash

API="http://localhost:4741"
URL_PATH="/posts/${POST_ID}/comments/${COMMENT_ID}"

curl "${API}${URL_PATH}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "comment": {
      "text": "'"${TEXT}"'"
    }
  }'

echo
