# Hydra Notifications Service

Microservicio encargado de la gestión y distribución de notificaciones dentro del ecosistema Proyecto Hydra.

---

## 📌 Descripción

Hydra Notifications es un microservicio independiente que permite:

- Crear notificaciones para usuarios
- Gestionar estado de lectura
- Aplicar múltiples estrategias de entrega (Email, In-App, etc.)
- Autenticación service-to-service
- Escalabilidad horizontal independiente

Este servicio NO conoce la lógica interna de Hydra Core.
Solo recibe eventos o solicitudes autenticadas desde otros servicios.

---

## 🏗 Arquitectura

Forma parte del monorepo:

Hydra/
 ├── hydra-core
 ├── hydra-notifications
 └── hydra-hub

Base de datos independiente:

- Database: hydra_notifications
- Puerto: 5433

---

## 🧱 Stack Tecnológico

- NestJS
- Prisma ORM
- PostgreSQL 16
- Docker
- JWT Service-to-Service Authentication
- Pattern: Strategy (para canales de notificación)

---

## 📦 Modelo de Datos

### Notification

| Campo | Tipo | Descripción |
|-------|------|------------|
| id | UUID | Identificador único |
| userId | String | ID del usuario (proveniente de Hydra Core) |
| title | String | Título de la notificación |
| message | String | Contenido |
| type | ENUM | EMAIL / IN_APP |
| isRead | Boolean | Estado de lectura |
| createdAt | DateTime | Fecha de creación |

### ServiceClient

Usado para autenticación entre microservicios.

| Campo | Tipo |
|-------|------|
| id | UUID |
| name | String |
| clientId | String (unique) |
| secret | String |
| isActive | Boolean |

---

## 🔐 Seguridad

Autenticación Service-to-Service mediante:

- client_id
- client_secret
- JWT interno firmado

Solo servicios autorizados pueden crear notificaciones.

---

## 🚀 Ejecución en Desarrollo

Desde la raíz del proyecto:

```bash
docker-compose up --build