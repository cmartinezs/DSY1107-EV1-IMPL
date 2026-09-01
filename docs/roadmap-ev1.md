# Roadmap EV1 sobre AulaTrack

La implementación avanza por capas para que cada cambio corresponda a un aprendizaje observable.

## Fase A · Aplicación local común — implementada

- [x] monorepo multimódulo;
- [x] backend Spring Boot único;
- [x] persistencia JPA + PostgreSQL/Supabase;
- [x] H2 aislado únicamente para tests automatizados;
- [x] dominio mínimo `Course` + `Task`;
- [x] API REST común;
- [x] cliente React;
- [x] cliente Angular;
- [x] CORS para ambas aplicaciones locales;
- [x] quick checks multiplataforma;
- [x] runtime smoke checks;
- [x] Dockerfiles por módulo;
- [x] Docker Compose para levantar API + ambas SPA;
- [x] ejecución tradicional preservada sin Docker.

## Fase B · Identidad y seguridad

Se incorporará sin cambiar el contrato de negocio:

- [ ] registrar API en Microsoft Entra ID;
- [ ] exponer scopes `tasks.read` y `tasks.write`;
- [ ] definir App Role `ADMIN`;
- [ ] registrar SPA React;
- [ ] registrar SPA Angular;
- [ ] integrar MSAL React;
- [ ] integrar MSAL Angular;
- [ ] convertir `api/` en OAuth2 Resource Server;
- [ ] validar issuer, audience, expiración, scopes y roles;
- [ ] demostrar 200 / 401 / 403.

## Fase C · Cloud

- [ ] desplegar `api/` en AWS EC2;
- [ ] publicar API mediante AWS API Gateway;
- [ ] externalizar URLs/orígenes/configuración;
- [ ] decidir datasource final para el ejercicio AWS según créditos y servicios disponibles;
- [ ] conectar ambas SPA al mismo endpoint cloud;
- [ ] ejecutar matriz E2E.

### Datasource durante desarrollo

Hasta resolver la decisión AWS, el datasource canónico es PostgreSQL administrado por Supabase. Las alternativas RDS PostgreSQL y PostgreSQL en Docker sobre EC2 se mantienen abiertas y documentadas en `docs/base-de-datos.md`.

## Política objetivo

```text
GET /public/info
→ público

GET /api/courses
GET /api/tasks
GET /api/tasks/{id}
→ tasks.read

POST /api/tasks
PUT /api/tasks/{id}
PATCH /api/tasks/{id}/status
→ tasks.write

POST /api/courses
→ ADMIN
```

## Criterio principal

React y Angular deben demostrar las mismas capacidades contra el mismo backend. Una diferencia de framework nunca debe convertirse en una diferencia del contrato de negocio o del modelo de autorización.
