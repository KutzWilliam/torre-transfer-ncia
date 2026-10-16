try {
  $path = "$env:LOCALAPPDATA\Docker\wsl\disk\docker_data.vhdx"
  Write-Host "Testando Optimize-VHD em $path..."
  Optimize-VHD -Path $path -Mode Quick -ErrorAction Stop
  Write-Host "SUCESSO: Optimize-VHD executado sem erros!"
} catch {
  Write-Host "FALHA: $($_.Exception.Message)"
}
