# Guía de Integración - Acceso SSO con Hydra IAM

## ¿Cómo funciona el flujo de acceso?

1. El usuario hace clic en una plataforma dentro de Hydra Hub
2. Hydra Core genera un JWT con los datos del usuario y su acceso
3. El usuario es redirigido a la plataforma con el token en la URL
4. La plataforma recibe el token, lo valida y otorga acceso

---

## 1. Cómo llega el token

El token se envía como parámetro en la URL:

```
GET https://miapp.example.com/dashboard?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 2. Estructura del token (JWT)

El token es un **JWT firmado con HS256**. El payload contiene:

```json
{
  "sub": "uuid-del-usuario",
  "email": "usuario@empresa.com",
  "name": "Nombre del Usuario",
  "roles": ["admin", "editor"],
  "positionId": "uuid-del-cargo",
  "platform": "CODIGO_PLATAFORMA",
  "iat": 1711612800,
  "exp": 1711613700,
  "iss": "hydra-iam",
  "aud": "internal-platforms"
}
```

### Campos del payload

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `sub` | string | ID único del usuario en Hydra IAM |
| `email` | string | Correo electrónico del usuario |
| `name` | string | Nombre completo del usuario |
| `roles` | string[] | Lista de roles asignados (de usuario, cargo y grupo) |
| `positionId` | string \| null | ID del cargo del usuario |
| `platform` | string | Código de la plataforma autorizada |
| `iat` | number | Timestamp de emisión |
| `exp` | number | Timestamp de expiración (15 minutos) |
| `iss` | string | Emisor: `hydra-iam` |
| `aud` | string | Audiencia: `internal-platforms` |

---

## 3. Qué debe hacer la plataforma receptora

### Paso 1: Extraer el token de la URL

```javascript
// Ejemplo en JavaScript (frontend o backend)
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
```

### Paso 2: Validar el token

La plataforma debe verificar la firma del JWT usando el secreto compartido.

**Datos necesarios para validar:**
- **Algoritmo:** HS256
- **Secreto (JWT_SECRET):** `super_secret_key`
- **Issuer esperado:** `hydra-iam`
- **Audience esperada:** `internal-platforms`
- **El token expira en:** 15 minutos

**Ejemplo de validación (Node.js):**

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'super_secret_key';

try {
  const payload = jwt.verify(token, JWT_SECRET, {
    issuer: 'hydra-iam',
    audience: 'internal-platforms',
  });

  // Token válido - usar payload.sub, payload.email, etc.
  console.log('Usuario:', payload.name);
  console.log('Email:', payload.email);
  console.log('Roles:', payload.roles);
} catch (err) {
  // Token inválido o expirado
  console.error('Token inválido:', err.message);
}
```

**Ejemplo de validación (Python):**

```python
import jwt

JWT_SECRET = 'super_secret_key'

try:
    payload = jwt.decode(
        token,
        JWT_SECRET,
        algorithms=['HS256'],
        issuer='hydra-iam',
        audience='internal-platforms'
    )
    print(f"Usuario: {payload['name']}")
    print(f"Roles: {payload['roles']}")
except jwt.InvalidTokenError as e:
    print(f"Token inválido: {e}")
```

### Paso 3: Crear sesión en tu plataforma

Una vez validado el token:

1. Buscar si el usuario ya existe en tu base de datos local usando `payload.sub` o `payload.email`
2. Si no existe, créalo con los datos del payload
3. Inicia sesión en tu plataforma para ese usuario
4. **Importante:** Limpia el token de la URL (reemplaza la URL sin el parámetro `token`) para evitar reuso

```javascript
// Limpiar token de la URL después de procesarlo
window.history.replaceState({}, document.title, window.location.pathname);
```

---

## 4. Manejo de errores

| Error | Acción recomendada |
|-------|-------------------|
| Token expirado (`TokenExpiredError`) | Redirigir al usuario a Hydra Hub para generar un nuevo token |
| Firma inválida | Rechazar acceso, el token fue manipulado |
| Issuer/Audience incorrecto | Rechazar acceso, el token no fue emitido para tu plataforma |
| Usuario sin acceso | Verificar que el `platform` en el payload coincida con tu código |

---

## 5. Notas importantes

- El token tiene una validez de **15 minutos**
- El token es de un solo uso; tu plataforma debe establecer su propia sesión
- No almacenes el JWT en `localStorage` de forma permanente
- El campo `platform` en el payload indica para qué plataforma fue generado el token
- Los roles vienen consolidados (usuario + cargo + grupo)

---
## Contacto

Para solicitar el `JWT_SECRET` o realizar pruebas de integración, contactar al equipo de Hydra IAM.
