# PowerShell installer for git hooks (Windows friendly)
$hookDir = Join-Path -Path (git rev-parse --git-dir) -ChildPath 'hooks'
$precommit = @"
#!/usr/bin/env bash
exec "$PWD/tools/precommit-check.sh" "$@"
"@
Set-Content -Path (Join-Path $hookDir 'pre-commit') -Value $precommit -Force -Encoding ASCII
# Make executable (msys/git or Git for Windows will honor)
try { & git update-index --add --chmod=+x $hookDir\pre-commit } catch { }
Write-Host "Installed pre-commit hook to $hookDir\pre-commit" -ForegroundColor Green
