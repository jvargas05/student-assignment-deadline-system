#!/usr/bin/env bash
# API test script for DueTrack. Run it while the server is running:
#     bash docs/curl-tests.sh            (default API: http://localhost:5000)
#     bash docs/curl-tests.sh https://your-deployed-url.com
# Copy the printed table into your test evidence (or take a screenshot of it).

API="${1:-http://localhost:5000}/api"
PASS=0; FAIL=0

# check "<name>" <expected-status> <METHOD> <path> [json-body]
check() {
  local name="$1" expected="$2" method="$3" path="$4" body="$5"
  local out status
  if [ -n "$body" ]; then
    out=$(curl -s -w "\n%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$body" "$API$path")
  else
    out=$(curl -s -w "\n%{http_code}" -X "$method" "$API$path")
  fi
  status=$(echo "$out" | tail -n1)
  RESPONSE=$(echo "$out" | sed '$d')
  if [ "$status" = "$expected" ]; then
    printf "PASS  %-52s expected %s got %s\n" "$name" "$expected" "$status"; PASS=$((PASS+1))
  else
    printf "FAIL  %-52s expected %s got %s\n" "$name" "$expected" "$status"; FAIL=$((FAIL+1))
    echo "      response: $RESPONSE"
  fi
}

VALID='{"title":"Curl Test Assignment","course":"DCIT 26","dueDate":"2030-01-15T10:00:00.000Z","priority":"High","category":"Lab"}'

echo "== DueTrack API tests ($API) =="

check "Health check"                               200 GET    "/health"
check "POST valid assignment"                      201 POST   "/assignments" "$VALID"
ID=$(echo "$RESPONSE" | sed -E 's/.*"_id":"([a-f0-9]{24})".*/\1/')
echo "      created id: $ID"

check "POST missing title"                         400 POST   "/assignments" '{"course":"DCIT 26","dueDate":"2030-01-15T10:00:00.000Z"}'
check "POST missing course"                        400 POST   "/assignments" '{"title":"No course","dueDate":"2030-01-15T10:00:00.000Z"}'
check "POST invalid priority"                      400 POST   "/assignments" '{"title":"Bad priority","course":"X","dueDate":"2030-01-15T10:00:00.000Z","priority":"Urgent"}'
check "POST invalid date"                          400 POST   "/assignments" '{"title":"Bad date","course":"X","dueDate":"not-a-date"}'
check "POST malformed JSON"                        400 POST   "/assignments" '{"title": '

check "GET all assignments"                        200 GET    "/assignments"
check "GET all - filter status=Pending"            200 GET    "/assignments?status=Pending"
check "GET all - search=curl"                      200 GET    "/assignments?search=curl"
check "GET all - search with no match (empty [])"  200 GET    "/assignments?search=zzzzNoMatchzzzz"
echo "      (empty-result body: $RESPONSE)"
check "GET all - invalid status filter"            400 GET    "/assignments?status=Done"

check "GET by id"                                  200 GET    "/assignments/$ID"
check "GET by id - valid format but not in DB"     404 GET    "/assignments/000000000000000000000000"
check "GET by id - malformed id"                   400 GET    "/assignments/abc123"

check "PUT full update"                            200 PUT    "/assignments/$ID" '{"title":"Curl Test Assignment (edited)","course":"DCIT 26","dueDate":"2030-02-01T10:00:00.000Z","priority":"Low","category":"Project","status":"In Progress"}'
check "PUT empty title"                            400 PUT    "/assignments/$ID" '{"title":""}'
check "PUT missing record"                         404 PUT    "/assignments/000000000000000000000000" "$VALID"
check "PATCH status only"                          200 PATCH  "/assignments/$ID" '{"status":"Submitted"}'
check "PATCH invalid status"                       400 PATCH  "/assignments/$ID" '{"status":"Done"}'

check "DELETE assignment"                          200 DELETE "/assignments/$ID"
check "DELETE same id again (already gone)"        404 DELETE "/assignments/$ID"
check "GET deleted record"                         404 GET    "/assignments/$ID"
check "GET unknown route"                          404 GET    "/does-not-exist"

echo "-----------------------------------------------"
echo "Passed: $PASS   Failed: $FAIL"
[ "$FAIL" -eq 0 ]
