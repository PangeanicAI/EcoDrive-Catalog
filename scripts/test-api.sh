#!/bin/bash

# Script to test the catalog API endpoint
# Usage: ./scripts/test-api.sh

set -e

API_URL="http://ecodrive.pangeanic.com:19193"
ENDPOINT="/management/federatedcatalog/request"

echo "🧪 Testing EcoDrive Catalog API"
echo "========================================"
echo "URL: $API_URL$ENDPOINT"
echo ""

echo "📡 Sending POST request..."
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL$ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "offset": 0,
    "limit": 5,
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/"
    }
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "📊 Response Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ API is working correctly!"
  echo ""
  echo "Response preview (first catalog):"
  echo "$BODY" | jq '.[0] | {id: .["@id"], type: .["@type"], datasets: (.["http://www.w3.org/ns/dcat#dataset"] | length)}' 2>/dev/null || echo "$BODY" | head -20
else
  echo "❌ API returned error code: $HTTP_CODE"
  echo ""
  echo "Response body:"
  echo "$BODY"
fi

echo ""
echo "========================================"
