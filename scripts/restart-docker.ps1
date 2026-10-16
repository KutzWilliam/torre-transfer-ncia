Write-Host "1. Finalizando processos do Docker Desktop..."
Stop-Process -Name "Docker Desktop", "com.docker.backend", "docker-sandbox", "com.docker.build", "docker" -Force -ErrorAction SilentlyContinue

Write-Host "2. Desligando WSL para liberar bloqueios de disco..."
wsl --shutdown

Start-Sleep -Seconds 5

Write-Host "3. Verificando espaço no disco C:..."
$free = (Get-PSDrive C).Free / 1GB
Write-Host "Espaço livre no disco C: $([math]::Round($free, 2)) GB"

Write-Host "4. Iniciando Docker Desktop novamente..."
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
Write-Host "Docker Desktop iniciado!"
