# Infraestructura EV1

Este directorio contendrá la configuración y evidencia de infraestructura de AulaTrack.

```text
infra/
├── entra/   # App Registrations, scopes, roles y valores no secretos
└── aws/     # EC2, API Gateway y despliegue
```

## Regla

No se versionan secretos, Access Tokens, contraseñas, client secrets ni credenciales cloud.

La aplicación debe obtener configuración dependiente del entorno mediante variables de entorno o mecanismos equivalentes.

## Siguiente incorporación

1. Microsoft Entra ID:
   - API registration;
   - SPA React registration;
   - SPA Angular registration;
   - `tasks.read`, `tasks.write`;
   - `ADMIN`.
2. Spring OAuth2 Resource Server.
3. MSAL en ambos clientes.
4. AWS EC2 + API Gateway.
5. matriz E2E común.
