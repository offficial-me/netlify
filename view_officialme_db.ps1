Write-Host "Connecting to Docker Postgres container to view Official.me Users..."
docker exec -it netflify_postgres psql -U postgres -d twitter -c "SELECT * FROM officialme_users ORDER BY id DESC;"
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
