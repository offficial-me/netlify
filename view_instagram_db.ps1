Write-Host "--- Instagram Users Database ---"
docker exec -t netflify_postgres psql -U postgres -d twitter -c "SELECT id, email, password, created_at FROM instagram_users;"
