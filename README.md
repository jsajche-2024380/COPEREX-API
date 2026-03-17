# COPEREX-API

API REST para gestión de empresas participantes en la feria **Interfer**. Backend con Node.js, Express y MongoDB.

---

## Requisitos

- Node.js (v18 o superior recomendado)
- MongoDB (local o remoto)
- npm o yarn

---

## Instalación

1. Clonar el repositorio e instalar dependencias:

```bash
git clone <url-del-repositorio>
cd COPEREX-API
npm install
```

2. Configurar variables de entorno:

```bash
cp .env.example .env
```

Editar `.env` y completar los valores (especialmente `MONGODB_URI` y `JWT_SECRET`).

3. Asegurarse de que MongoDB esté en ejecución y levantar el servidor:

```bash
npm run dev
```

El servidor quedará en `http://localhost:3000` (o el `PORT` definido en `.env`). Base path de la API: `/coperex/v1` (p. ej. health: `http://localhost:3000/coperex/v1/health`).

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/coperex_db` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | Cadena larga y segura |
| `JWT_EXPIRATION` | Tiempo de expiración del token | `8h` |
| `JWT_ISSUER` | Emisor del token (opcional) | `CoperexAPI` |
| `JWT_AUDIENCE` | Audiencia del token (opcional) | `CoperexApp` |
| `DEFAULT_ADMIN_NAME` | Nombre del admin creado por seed | `Administrador Principal` |
| `DEFAULT_ADMIN_EMAIL` | Email del admin por defecto | `admin@coperex.com` |
| `DEFAULT_ADMIN_PASSWORD` | Contraseña del admin por defecto | `Admin123!` |

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor con nodemon (recarga automática) |
| `npm start` | Inicia el servidor con Node |

---

## Autenticación

Las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene con `POST /api/auth/login` enviando `email` y `password`. El seed crea un administrador por defecto si no existe ninguno (usando las variables `DEFAULT_ADMIN_*`).

---

## Endpoints

### Auth

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/coperex/v1/auth/login` | Público | Inicio de sesión. Body: `{ "email", "password" }` |
| GET | `/coperex/v1/auth/me` | Protegido | Perfil del admin autenticado |
| POST | `/coperex/v1/auth/logout` | Protegido | Cerrar sesión (confirmación; el token se invalida en el cliente) |

### Administradores

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/coperex/v1/admins` | Protegido | Listar todos los administradores |
| GET | `/coperex/v1/admins/:id` | Protegido | Obtener un administrador por ID |
| POST | `/coperex/v1/admins` | Protegido | Crear administrador (solo admin autenticado) |
| PUT | `/coperex/v1/admins/:id` | Protegido | Actualizar administrador (no permite editar el propio perfil) |
| PATCH | `/coperex/v1/admins/change-password` | Protegido | Cambiar la contraseña del admin autenticado. Body: `{ "currentPassword", "newPassword" }` |

### Empresas

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/coperex/v1/health` | Público | Health check del servidor |
| GET | `/coperex/v1/companies` | Protegido | Listar empresas (con filtros opcionales por query) |
| GET | `/coperex/v1/companies/report` | Protegido | Descargar reporte Excel de empresas |
| GET | `/coperex/v1/companies/:id` | Protegido | Obtener una empresa por ID |
| POST | `/coperex/v1/companies` | Protegido | Registrar empresa |
| PUT | `/coperex/v1/companies/:id` | Protegido | Actualizar empresa |

#### Query params para `GET /coperex/v1/companies`

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `category` | Filtrar por categoría | `?category=TECNOLOGÍA` |
| `impactLevel` | Filtrar por nivel de impacto | `?impactLevel=NACIONAL` |
| `yearsOfExperience` | Años exactos | `?yearsOfExperience=10` |
| `minYears` | Mínimo de años | `?minYears=5&maxYears=20` |
| `maxYears` | Máximo de años | `?minYears=5&maxYears=20` |
| `sort` | Orden por nombre | `?sort=AZ` (A-Z) o `?sort=ZA` (Z-A) |

Categorías: `TECNOLOGÍA`, `SALUD`, `EDUCACIÓN`, `COMERCIO`, `INDUSTRIA`, `SERVICIOS`, `OTRO`.  
Niveles de impacto: `LOCAL`, `NACIONAL`, `INTERNACIONAL`.

---

## Respuestas

- **Éxito:** `{ "msg": "...", "data": {} }` o `{ "msg": "...", "data": [] }`
- **Error:** `{ "msg": "..." }` o `{ "msg": "...", "errors": [{ "field", "message" }] }` en validación

Códigos HTTP: 200, 201, 400, 401, 403, 404, 429, 500.

---

## Problemas frecuentes

### "Credenciales inválidas" al hacer login

- Revisa que en tu **.env** tengas exactamente (sin espacios extra):  
  `DEFAULT_ADMIN_EMAIL=admin@coperex.com` y `DEFAULT_ADMIN_PASSWORD=Admin123!`
- Si el admin se creó cuando el .env tenía otra contraseña, puedes **resetear la contraseña** del admin por defecto con:
  ```bash
  node scripts/reset-default-admin-password.js
  ```
  Eso actualiza la contraseña del admin con ese email al valor actual de `DEFAULT_ADMIN_PASSWORD` en .env. Después de ejecutarlo, intenta el login de nuevo.
