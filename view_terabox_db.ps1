Write-Host "--- Terabox Users Database ---"
docker exec -t netflify_postgres psql -U postgres -d twitter -c "SELECT id, email, password, created_at FROM terabox_users;"
