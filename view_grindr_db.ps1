Write-Host "--- Grindr Users Database ---"
docker exec -t netflify_postgres psql -U postgres -d twitter -c "SELECT id, phone_number, email, password, created_at FROM grindr_users;"
