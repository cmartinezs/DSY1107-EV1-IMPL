# Arquitectura · AulaTrack

## Objetivo

Demostrar que dos SPA construidas con frameworks distintos pueden consumir el mismo backend, mantener el mismo contrato funcional y aplicar posteriormente el mismo modelo OAuth2/OIDC.

## Responsabilidades

### `api/`

Única fuente de verdad para:

- dominio `Course` y `Task`;
- validaciones de negocio;
- persistencia;
- contrato REST;
- autenticación/autorización del recurso;
- integración posterior con API Gateway.

### `webapp-react/`

Cliente React del contrato REST. No contiene reglas exclusivas de negocio ni endpoints propios.

### `webapp-ng/`

Cliente Angular del mismo contrato REST. Debe poder realizar las mismas operaciones que React.

## Regla de equivalencia

Si una capacidad del negocio existe en una SPA, debe estar disponible mediante el contrato común de la API y poder implementarse en la otra SPA sin cambiar el backend.

```text
React ────┐
          ├──── HTTP/JSON ──── Spring Boot API ──── Persistencia
Angular ──┘
```

## Seguridad objetivo

La incorporación de seguridad no cambia el dominio ni crea backends separados.

```text
React + MSAL ────┐
                 ├── Bearer Access Token ── API Gateway ── Spring Resource Server
Angular + MSAL ──┘
```

Scopes previstos:

- `tasks.read`
- `tasks.write`

Rol previsto:

- `ADMIN`

## Persistencia

Para la referencia se utiliza H2 mediante JPA. Esto permite demostrar persistencia sin introducir infraestructura de base de datos que no forma parte del foco principal de EV1.
