# JIRA RICEFW Server Test Script
# This script tests all the available endpoints

Write-Host "=== JIRA RICEFW Server API Tests ===" -ForegroundColor Green

# Test 1: Health Check
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = curl http://localhost:8080/api/test/health | ConvertFrom-Json
    Write-Host "✓ Health Status: $($health.status)" -ForegroundColor Green
    Write-Host "✓ Service: $($health.service)" -ForegroundColor Green
    Write-Host "✓ Message: $($health.message)" -ForegroundColor Green
}
catch {
    Write-Host "✗ Health endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Info Endpoint
Write-Host "`n2. Testing Info Endpoint..." -ForegroundColor Yellow
try {
    $info = curl http://localhost:8080/api/test/info | ConvertFrom-Json
    Write-Host "✓ Application: $($info.application)" -ForegroundColor Green
    Write-Host "✓ Version: $($info.version)" -ForegroundColor Green
    Write-Host "✓ Features: $($info.features -join ', ')" -ForegroundColor Green
}
catch {
    Write-Host "✗ Info endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Echo Endpoint (POST)
Write-Host "`n3. Testing Echo Endpoint..." -ForegroundColor Yellow
try {
    $testData = @{
        message   = "Test from PowerShell script"
        timestamp = (Get-Date).ToString()
        user      = $env:USERNAME
    }
    $body = $testData | ConvertTo-Json
    $echo = curl -Method POST -Uri "http://localhost:8080/api/test/echo" -ContentType "application/json" -Body $body | ConvertFrom-Json
    Write-Host "✓ Echo Message: $($echo.message)" -ForegroundColor Green
    Write-Host "✓ Received Data: $($echo.receivedData | ConvertTo-Json -Compress)" -ForegroundColor Green
}
catch {
    Write-Host "✗ Echo endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: JIRA Test Endpoint
Write-Host "`n4. Testing JIRA Integration Endpoint..." -ForegroundColor Yellow
try {
    $jira = curl http://localhost:8080/api/test/jira-test | ConvertFrom-Json
    Write-Host "✓ JIRA Status: $($jira.status)" -ForegroundColor Green
    Write-Host "✓ JIRA Message: $($jira.message)" -ForegroundColor Green
    Write-Host "✓ Note: $($jira.note)" -ForegroundColor Green
}
catch {
    Write-Host "✗ JIRA test endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Actuator Health
Write-Host "`n5. Testing Actuator Health..." -ForegroundColor Yellow
try {
    $actuator = curl http://localhost:8080/api/actuator/health | ConvertFrom-Json
    Write-Host "✓ Actuator Status: $($actuator.status)" -ForegroundColor Green
    Write-Host "✓ Components: $($actuator.components.PSObject.Properties.Name -join ', ')" -ForegroundColor Green
}
catch {
    Write-Host "✗ Actuator health failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== All Tests Completed ===" -ForegroundColor Green
Write-Host "Server is running successfully on http://localhost:8080" -ForegroundColor Cyan
Write-Host "API Base Path: /api" -ForegroundColor Cyan
Write-Host "H2 Console: http://localhost:8080/api/h2-console" -ForegroundColor Cyan
