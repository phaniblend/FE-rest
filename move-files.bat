@echo off
echo Moving RestMan files to correct locations...
echo.

REM Create necessary directories
echo Creating directories...
if not exist "components\chef" mkdir "components\chef"
if not exist "components\manager" mkdir "components\manager"
if not exist "components\waiter" mkdir "components\waiter"
if not exist "lib" mkdir "lib"

echo.
echo Moving chef components...
REM Move chef dashboard
if exist "app\chef\dashboard.tsx" (
    move "app\chef\dashboard.tsx" "components\chef\dashboard.tsx"
    echo Moved: app\chef\dashboard.tsx to components\chef\dashboard.tsx
) else (
    echo File not found: app\chef\dashboard.tsx
)

REM Move chef inventory
if exist "app\chef\inventory.tsx" (
    move "app\chef\inventory.tsx" "components\chef\inventory.tsx"
    echo Moved: app\chef\inventory.tsx to components\chef\inventory.tsx
) else (
    echo File not found: app\chef\inventory.tsx
)

echo.
echo Moving manager components...
REM Move manager dashboard (fixing typo)
if exist "app\manager\dasboard.tsx" (
    move "app\manager\dasboard.tsx" "components\manager\dashboard.tsx"
    echo Moved: app\manager\dasboard.tsx to components\manager\dashboard.tsx (fixed typo)
) else (
    echo File not found: app\manager\dasboard.tsx
)

REM Move manager inventory
if exist "app\manager\inventory.tsx" (
    move "app\manager\inventory.tsx" "components\manager\inventory.tsx"
    echo Moved: app\manager\inventory.tsx to components\manager\inventory.tsx
) else (
    echo File not found: app\manager\inventory.tsx
)

echo.
echo Moving waiter components...
REM Move waiter dashboard
if exist "app\waiter\dashboard.tsx" (
    move "app\waiter\dashboard.tsx" "components\waiter\dashboard.tsx"
    echo Moved: app\waiter\dashboard.tsx to components\waiter\dashboard.tsx
) else (
    echo File not found: app\waiter\dashboard.tsx
)

echo.
echo ========================================
echo File movement complete!
echo.
echo Don't forget to:
echo 1. Create lib\utils.ts with the cn function
echo 2. Run: npm install clsx tailwind-merge
echo 3. Update the waiter dashboard component with proper types
echo ========================================
echo.
pause