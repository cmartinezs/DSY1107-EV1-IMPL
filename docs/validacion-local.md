# Validación local rápida

Esta guía define el flujo esperado después de `git pull`.

## Nivel 1 · validación estructural

No requiere Supabase activo.

### Bash

```bash
bash scripts/quick-check.sh
```

### PowerShell

```powershell
./scripts/quick-check.ps1
```

Debe completar:

1. detección de Java, Maven, Node y npm;
2. `mvn test`;
3. empaquetado de la API;
4. build React;
5. build Angular;
6. `docker compose config --quiet` cuando Docker Compose esté disponible.

Resultado esperado:

```text
[OK] Quick check completado.
```

## Nivel 2 · levantar stack

Preparar entorno:

```bash
cp .env.example .env
```

Completar `SUPABASE_DB_URL`.

### Docker

```bash
docker compose up --build
```

### Tradicional

Levantar API, React y Angular en terminales independientes siguiendo el README raíz.

## Nivel 3 · smoke test de integración

Con los tres módulos levantados:

### Bash

```bash
bash scripts/smoke-running.sh
```

### PowerShell

```powershell
./scripts/smoke-running.ps1
```

Comprueba:

```text
GET http://localhost:8080/public/info
GET http://localhost:8080/api/courses
GET http://localhost:5173
GET http://localhost:4200
```

Resultado esperado:

```text
[OK] Stack local respondiendo.
```

## Interpretación

| Nivel | Qué demuestra | Qué NO demuestra todavía |
|---|---|---|
| Quick check | compilación, test básico y configuración Compose | conexión real a Supabase |
| Stack levantado | runtime y conexión de API al datasource | seguridad EV1 |
| Smoke test | API + ambas SPA responden simultáneamente | Entra, JWT, scopes, roles, Gateway |

Cuando se incorpore seguridad, este mismo flujo se ampliará con la matriz 200/401/403 sin eliminar las validaciones actuales.
