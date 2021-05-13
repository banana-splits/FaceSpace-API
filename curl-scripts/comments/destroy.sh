#!/bin/bash

API="http://localhost:4741"
URL_PATH="/posts/${POST_ID}/comments/${COMMENT_ID}"

curl "${API}${URL_PATH}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo