@echo off
start cmd /k "cd address-api && bun start"
start cmd /k "cd user-api && bun start"
start cmd /k "cd middleware-api && bun start"
start cmd /k "cd transactions-api && bun start"
start cmd /k "cd wallet-api && bun start"
start cmd /k "cd kyc-api && bun start"
start cmd /k "cd currency-api && bun start"