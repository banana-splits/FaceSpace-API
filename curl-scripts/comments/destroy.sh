#!/bin/bash

API="http://localhost:4741"
URL_PATH="/comments"

curl "${API}${URL_PATH}/${COMMENT_ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo