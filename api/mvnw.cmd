@echo off
setlocal

set "BASE_DIR=%~dp0"
set "PROPS=%BASE_DIR%.mvn\wrapper\maven-wrapper.properties"
set "WRAPPER_JAR=%BASE_DIR%.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.4/maven-wrapper-3.3.4.jar"

if not exist "%PROPS%" (
  echo Error: missing %PROPS% 1>&2
  exit /b 1
)

for /f "usebackq tokens=1,* delims==" %%A in ("%PROPS%") do (
  if "%%A"=="wrapperUrl" set "WRAPPER_URL=%%B"
)

if not exist "%WRAPPER_JAR%" (
  echo Maven Wrapper: downloading bootstrap jar... 1>&2
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; Invoke-WebRequest -UseBasicParsing -Uri '%WRAPPER_URL%' -OutFile '%WRAPPER_JAR%'"
  if errorlevel 1 exit /b 1
)

if "%JAVA_HOME%"=="" (
  where java >nul 2>nul
  if errorlevel 1 (
    echo Error: Java not found. Install JDK 21 or configure JAVA_HOME. 1>&2
    exit /b 1
  )
  set "JAVA_CMD=java"
) else (
  set "JAVA_CMD=%JAVA_HOME%\bin\java.exe"
)

"%JAVA_CMD%" %MAVEN_OPTS% -classpath "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%BASE_DIR%" org.apache.maven.wrapper.MavenWrapperMain %*
exit /b %ERRORLEVEL%
