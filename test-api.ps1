# Script de PowerShell para probar la API
Write-Host "🧪 Probando API de Clínica de Psicopedagogía" -ForegroundColor Green

# Test 1: Verificar que el servidor esté corriendo
Write-Host "`n1️⃣ Verificando servidor..." -ForegroundColor Yellow
try {
    $serverResponse = Invoke-RestMethod -Uri "http://localhost:3000" -Method GET
    Write-Host "✅ Servidor corriendo correctamente" -ForegroundColor Green
    Write-Host "   Mensaje: $($serverResponse.message)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error: Servidor no responde. ¿Está corriendo npm run dev?" -ForegroundColor Red
    exit 1
}

# Test 2: Login con profesional
Write-Host "`n2️⃣ Probando login de profesional..." -ForegroundColor Yellow
$loginBody = @{
    email = "dr.martinez@clinica.com"
    password = "password"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Login exitoso!" -ForegroundColor Green
    Write-Host "   Usuario: $($loginResponse.user.nombre) $($loginResponse.user.apellido)" -ForegroundColor Cyan
    Write-Host "   Rol: $($loginResponse.user.rol)" -ForegroundColor Cyan
    Write-Host "   Token: $($loginResponse.token.Substring(0,50))..." -ForegroundColor Gray
    
    $token = $loginResponse.token
    
    # Test 3: Obtener perfil con token
    Write-Host "`n3️⃣ Probando obtener perfil..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/profile" -Method GET -Headers $headers
    Write-Host "✅ Perfil obtenido correctamente" -ForegroundColor Green
    Write-Host "   Email: $($profileResponse.user.email)" -ForegroundColor Cyan
    
    # Test 4: Obtener profesionales
    Write-Host "`n4️⃣ Probando obtener profesionales..." -ForegroundColor Yellow
    $professionalsResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/profesionales" -Method GET -Headers $headers
    Write-Host "✅ Profesionales obtenidos: $($professionalsResponse.count)" -ForegroundColor Green
    
    foreach ($prof in $professionalsResponse.profesionales) {
        Write-Host "   - $($prof.usuario.nombre) $($prof.usuario.apellido) ($($prof.especialidad))" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "❌ Error en login:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Respuesta del servidor: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Pruebas completadas!" -ForegroundColor Green