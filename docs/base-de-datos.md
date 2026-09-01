# Base de datos · decisión temporal y alternativas AWS

## Estado actual

**Decisión temporal:** AulaTrack utiliza PostgreSQL administrado por Supabase.

El backend Spring Boot se conecta directamente mediante JDBC. React y Angular **no** se conectan a Supabase: ambos siguen consumiendo únicamente la API Spring Boot.

```text
React ───┐
         ├──► Spring Boot API ───► PostgreSQL / Supabase
Angular ─┘
```

Esta frontera es deliberada: cambiar el proveedor PostgreSQL no debe modificar las SPA ni el contrato REST.

## Conexión recomendada para esta etapa

Para Spring Boot/Hibernate utilizar el JDBC **Session Pooler** de Supabase, puerto `5432`, obtenido desde `Dashboard > Connect > JDBC`.

No utilizar el Transaction Pooler `6543` como datasource principal de Hibernate.

La conexión se entrega exclusivamente mediante:

```text
SUPABASE_DB_URL
```

Ejemplo de forma, no copiar literalmente:

```text
jdbc:postgresql://HOST:5432/postgres?user=USER&password=PASSWORD&sslmode=require
```

No versionar contraseña ni connection string real.

## Esquema

AulaTrack utiliza por defecto:

```text
DB_SCHEMA=aulatrack
```

Se evita trabajar directamente en `public`, ya que ese esquema puede estar expuesto por la Data API de Supabase. Spring/Hibernate administra las tablas del ejercicio dentro del esquema de aplicación.

## Alternativas para el despliegue AWS de EV1

La decisión final queda abierta hasta validar restricciones y consumo de créditos del laboratorio de los estudiantes.

### Opción A · mantener Supabase

```text
EC2 / Spring Boot
       │
       └──► Supabase PostgreSQL
```

Ventajas:

- baja complejidad operativa;
- no consume créditos AWS de base de datos;
- separa claramente compute y datos;
- permite concentrar EV1 en EC2, API Gateway, identidad y seguridad.

Desventajas:

- la BD queda fuera de AWS;
- introduce una dependencia externa adicional.

### Opción B · Amazon RDS for PostgreSQL

```text
EC2 / Spring Boot ───► RDS PostgreSQL
```

Ventajas:

- arquitectura cloud más representativa;
- servicio administrado;
- evita administrar PostgreSQL manualmente dentro de EC2.

Desventajas:

- consume créditos/recursos del laboratorio;
- agrega configuración de red, seguridad y costos;
- puede distraer del objetivo principal de EV1 si la rúbrica no evalúa RDS.

### Opción C · PostgreSQL en Docker dentro de EC2

```text
EC2
├── Spring Boot container
└── PostgreSQL container
```

Ventajas:

- usa una sola VM;
- conceptualmente simple para una demo controlada;
- evita un servicio adicional.

Desventajas:

- mezcla aplicación y persistencia en el mismo host;
- exige administrar volumen, backup, puertos y ciclo de vida;
- es una práctica menos adecuada que un servicio administrado para una solución real.

## Criterio de decisión posterior

Antes de elegir la opción final para alumnos se debe comprobar:

1. servicios habilitados realmente dentro del AWS Academy Learner Lab;
2. presupuesto/créditos efectivos del laboratorio;
3. duración esperada de EC2/RDS;
4. peso real de persistencia en la rúbrica de EV1;
5. complejidad adicional que cada alternativa introduce al ejercicio.

Hasta esa revisión, **Supabase permanece como datasource canónico de desarrollo e integración**.
