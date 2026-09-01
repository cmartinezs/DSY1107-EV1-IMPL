# DSY1107 · EV1 · Implementación de referencia

Monorepo multimódulo utilizado para implementar y validar de extremo a extremo los aprendizajes de EV1 de **DSY1107 Desarrollo Cloud Native I**.

El objetivo no es construir un sistema complejo. La aplicación sirve como referencia técnica para demostrar que **dos SPA distintas pueden consumir el mismo backend y aplicar el mismo contrato de seguridad**.

## Aplicación: AulaTrack

AulaTrack es un gestor docente mínimo de asignaturas y pendientes.

```text
Course 1 ─────── N Task
```

### Course

- `id`
- `code`
- `name`
- `active`

### Task

- `id`
- `title`
- `description`
- `status`
- `dueDate`
- `courseId`

## Módulos

```text
DSY1107-EV1-IMPL/
├── api/             # Java + Spring Boot · backend único
├── webapp-react/    # React + TypeScript + Vite
├── webapp-ng/       # Angular
├── docs/            # arquitectura y decisiones
└── infra/           # configuración cloud/documentación
```

Ambos frontends consumen exactamente la misma API REST.

## Arquitectura objetivo EV1

```text
                 Microsoft Entra ID
                    ▲           ▲
                    │           │
              Auth Code     Auth Code
                + PKCE        + PKCE
                    │           │
             React + MSAL   Angular + MSAL
                    │           │
                    └─────┬─────┘
                          │ Access Token
                          ▼
                   AWS API Gateway
                          │ Bearer JWT
                          ▼
                   Spring Boot API
                 OAuth2 Resource Server
                          │
                          ▼
                       H2/JPA
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

La primera iteración funciona localmente sin identidad/cloud. La seguridad se incorpora después sobre el mismo contrato HTTP, siguiendo la progresión de la asignatura.

## Ejecución local

### API

```bash
cd api
mvn spring-boot:run
```

API: `http://localhost:8080`

### React

```bash
cd webapp-react
npm install
npm run dev
```

React: `http://localhost:5173`

### Angular

```bash
cd webapp-ng
npm install
npm start
```

Angular: `http://localhost:4200`

## Principio de diseño

El backend contiene el dominio y las reglas de negocio. React y Angular son dos consumidores intercambiables del mismo contrato REST; ninguno obtiene una API especial ni replica reglas del backend.
