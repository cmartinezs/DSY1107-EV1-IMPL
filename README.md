# DSY1107 · EV1 · Implementación de referencia

Monorepo multimódulo utilizado para implementar y validar de extremo a extremo los aprendizajes de EV1 de **DSY1107 Desarrollo Cloud Native I**.

El objetivo no es construir un sistema complejo. AulaTrack sirve como referencia técnica para demostrar que **dos SPA distintas pueden consumir el mismo backend y aplicar el mismo contrato de seguridad**.

## Aplicación: AulaTrack

Gestor docente mínimo de asignaturas y pendientes.

```mermaid
erDiagram
    COURSE ||--o{ TASK : contiene
```

## Módulos

```text
DSY1107-EV1-IMPL/
├── api/             # Java 21 + Spring Boot · backend único
├── webapp-react/    # React + TypeScript + Vite
├── webapp-ng/       # Angular
├── docs/            # arquitectura y decisiones
├── infra/           # configuración cloud/documentación
├── scripts/         # validaciones rápidas
└── docker-compose.yml
```

Ambos frontends consumen exactamente la misma API REST.

## Arquitectura actual

```mermaid
flowchart LR
    React[React SPA] -->|HTTP / JSON| API[Spring Boot API]
    Angular[Angular SPA] -->|HTTP / JSON| API
    API --> DB[(H2 local / PostgreSQL Supabase)]
```

La base de datos está detrás de la API. Ninguna SPA accede directamente al datasource.

## Arquitectura objetivo EV1

```mermaid
flowchart TB
    Entra[Microsoft Entra ID]
    React[React + MSAL]
    Angular[Angular + MSAL]
    Gateway[AWS API Gateway]
    API[Spring Boot API<br/>OAuth2 Resource Server]
    DB[(PostgreSQL datasource)]

    React <-->|Authorization Code + PKCE| Entra
    Angular <-->|Authorization Code + PKCE| Entra
    React -->|Access Token| Gateway
    Angular -->|Access Token| Gateway
    Gateway -->|Bearer JWT| API
    API --> DB
```

## Contrato REST inicial

```text
GET    /public/info
GET    /api/courses
POST   /api/courses
GET    /api/tasks
GET    /api/tasks/{id}
POST   /api/tasks
PUT    /api/tasks/{id}
PATCH  /api/tasks/{id}/status
```

---

# 1. Quick check después de `git pull`

El quick check valida los tres módulos sin requerir una conexión real a Supabase.

El backend usa **Maven Wrapper**; no requiere Maven instalado globalmente. Solo necesita JDK 21. El wrapper fija Maven 3.9.16 y descarga automáticamente lo necesario en la primera ejecución. Maven global queda únicamente como fallback de contingencia.

Los tests del backend utilizan H2 aislado en memoria.

### Linux / macOS / Git Bash

```bash
bash scripts/quick-check.sh
```

### PowerShell

```powershell
./scripts/quick-check.ps1
```

Valida:

```mermaid
flowchart TD
    Env[JDK / Node / npm disponibles] --> API[API: Maven Wrapper test + package]
    API --> React[React: npm install + build]
    React --> Angular[Angular: npm install + build]
    Angular --> Docker{¿Docker Compose disponible?}
    Docker -- Sí --> Compose[Validar docker compose config]
    Docker -- No --> Done[Finalizar]
    Compose --> Done
```

Un `[OK] Quick check completado.` significa que la estructura compila y los tests básicos pasan. No equivale todavía a una prueba E2E contra Entra/Supabase/AWS.

---

# 2. Runtime local rápido · cero configuración

El runtime local por defecto utiliza **H2 en memoria**. No requiere `.env`, Supabase ni PostgreSQL externo.

```bash
docker compose up --build
```

Servicios:

```text
API      http://localhost:8080
React    http://localhost:5173
Angular  http://localhost:4200
```

Luego puede ejecutarse:

```bash
bash scripts/smoke-running.sh
```

Este modo valida el stack completo local:

```mermaid
flowchart LR
    React[React] --> API[Spring Boot]
    Angular[Angular] --> API
    API --> H2[(H2 en memoria)]
```

La persistencia H2 es efímera y se reconstruye al reiniciar el proceso/contenedor.

Detener:

```bash
docker compose down
```

---

# 3. Runtime de integración · Supabase PostgreSQL

Cuando el objetivo sea validar integración real con PostgreSQL/Supabase, se activa explícitamente el perfil `supabase`.

Copiar:

```bash
cp .env.example .env
```

y completar:

```env
SPRING_PROFILES_ACTIVE=supabase
SUPABASE_DB_URL='jdbc:postgresql://HOST:5432/postgres?user=USER&password=PASSWORD&sslmode=require'
DB_SCHEMA=aulatrack
```

Luego:

```bash
docker compose up --build
```

Con ese perfil, Spring carga `application-supabase.yml` y reemplaza H2 por PostgreSQL/Supabase.

Más detalles y alternativas AWS: [`docs/base-de-datos.md`](docs/base-de-datos.md).

---

# 4. Levantar de forma tradicional

Docker no es obligatorio. Los tres módulos siguen siendo ejecutables individualmente.

## API local con H2

Linux/macOS/Git Bash:

```bash
cd api
./mvnw spring-boot:run
```

Si el checkout no preservó el bit ejecutable de `mvnw`:

```bash
sh ./mvnw spring-boot:run
```

PowerShell:

```powershell
cd api
./mvnw.cmd spring-boot:run
```

## API con Supabase

Linux/macOS/Git Bash:

```bash
set -a
source .env
set +a
cd api
./mvnw spring-boot:run
```

PowerShell:

```powershell
$env:SPRING_PROFILES_ACTIVE="supabase"
$env:SUPABASE_DB_URL="jdbc:postgresql://..."
$env:DB_SCHEMA="aulatrack"
cd api
./mvnw.cmd spring-boot:run
```

API: `http://localhost:8080`

## React

```bash
cd webapp-react
npm install
npm run dev
```

React: `http://localhost:5173`

## Angular

```bash
cd webapp-ng
npm install
npm start
```

Angular: `http://localhost:4200`

React y Angular pueden estar levantados simultáneamente y observar los mismos datos porque consumen el mismo backend y datasource activo.

---

## Conformidad de diagramas

Este repositorio **consume**, pero no define, `STD-ENG-DIAG-001@0.1.0-draft — Diagramming & Visual Representation Standard`, cuya fuente normativa vive en `adumun/platform-standards`.

Los diagramas de AulaTrack aplican ese estándar corporativo; cualquier desviación debe quedar justificada localmente sin copiar ni redefinir la norma.

## Principio de diseño

El backend contiene el dominio, persistencia y reglas de negocio. React y Angular son consumidores intercambiables del mismo contrato REST; ninguno obtiene una API especial ni replica reglas del backend.

La seguridad Entra/MSAL/Spring Resource Server y posteriormente AWS API Gateway se incorporarán sobre esta misma arquitectura, sin crear backends separados por frontend.
