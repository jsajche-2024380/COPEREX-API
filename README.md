# COPEREX-API

API REST para la gestión de empresas participantes en la feria **Interfer**. Desarrollada con Node.js, Express y MongoDB. Solo administradores pueden acceder; la autenticación es mediante JWT.

---

## Funcionalidades

- **Inicio de sesión** de administradores (único tipo de usuario).
- **Registro de empresas** con nivel de impacto, años de trayectoria, categoría empresarial y datos de contacto.
- **Listado de empresas** con filtros por categoría, nivel de impacto y años de trayectoria, y orden A-Z / Z-A.
- **Edición de empresas** (no hay eliminación según requisitos del proyecto).
- **Reporte Excel** (.xlsx) con todas las empresas registradas.
- **Gestión de administradores** (listar, crear, editar, cambiar contraseña).
- **Seguridad:** JWT, bcrypt, helmet, CORS, rate limiting (global y en login), express-validator.

---

## Requisitos

- **Node.js** v18 o superior (recomendado)
- **MongoDB** (local o Atlas)
- **npm** o **yarn**

---

## Instalación

1. Clonar el repositorio e instalar dependencias:

```bash
git clone https://github.com/jsajche-2024380/COPEREX-API.git
cd COPEREX-API
npm install
```

2. Configurar variables de entorno:

```bash
cp .env.example .env
```

Completar los valores en `.env` (obligatorios: `MONGODB_URI`, `JWT_SECRET`).

3. Tener MongoDB en ejecución y levantar el servidor:

```bash
npm run dev
```

El servidor queda en `http://localhost:3000` (o el `PORT` definido en `.env`). Base de la API: **`/coperex/v1`**.

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/coperex_db` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | Cadena larga y segura |
| `JWT_EXPIRATION` | Tiempo de expiración del token | `8h` |
| `JWT_ISSUER` | Emisor del token (recomendado) | `CoperexAPI` |
| `JWT_AUDIENCE` | Audiencia del token (recomendado) | `CoperexApp` |
| `DEFAULT_ADMIN_NAME` | Nombre del admin creado por seed | `Administrador Principal` |
| `DEFAULT_ADMIN_EMAIL` | Email del admin por defecto | `admin@coperex.com` |
| `DEFAULT_ADMIN_PASSWORD` | Contraseña del admin por defecto | `Admin123!` |

El seed crea un único administrador la primera vez que arranca la app (si no existe ninguno). No modifica admins ya existentes ni resetea contraseñas.

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor con nodemon (recarga automática) |
| `npm start` | Inicia el servidor con Node (producción) |

---

## Base URL y health check

- **Base:** `http://localhost:3000/coperex/v1`
- **Health (público):** `GET http://localhost:3000/coperex/v1/health`  
  Respuesta: `{ "success": true, "status": "Healthy", "timestamp": "...", "service": "COPEREX Interfer API" }`

---

## Autenticación

Solo la ruta de **login** es pública. El resto requiere token JWT.

**Obtener token:** `POST /coperex/v1/auth/login`  
Body (JSON):

```json
{
  "email": "admin@coperex.com",
  "password": "Admin123!"
}
```

La respuesta incluye `token` y `expiresAt`. El token debe enviarse en todas las peticiones protegidas.

**Envío del token** (cualquiera de los dos):

- `Authorization: Bearer <token>`
- `x-token: <token>`

**Rate limit en login:** 10 intentos por IP cada 15 minutos. Al superarse se responde 429.

---

## Endpoints

### Auth

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/coperex/v1/auth/login` | Público | Inicio de sesión. Body: `{ "email", "password" }` |
| GET | `/coperex/v1/auth/me` | Protegido | Perfil del admin autenticado |
| POST | `/coperex/v1/auth/logout` | Protegido | Cerrar sesión |

### Administradores

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/coperex/v1/admins` | Protegido | Listar administradores activos |
| GET | `/coperex/v1/admins/:id` | Protegido | Obtener administrador por ID |
| POST | `/coperex/v1/admins` | Protegido | Crear administrador |
| PUT | `/coperex/v1/admins/:id` | Protegido | Actualizar nombre y email |
| PATCH | `/coperex/v1/admins/change-password` | Protegido | Cambiar contraseña del admin autenticado. Body: `{ "currentPassword", "newPassword" }` |

### Empresas

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/coperex/v1/companies` | Protegido | Listar empresas (filtros y orden por query) |
| GET | `/coperex/v1/companies/report` | Protegido | Descargar reporte Excel (.xlsx) |
| GET | `/coperex/v1/companies/:id` | Protegido | Obtener empresa por ID |
| POST | `/coperex/v1/companies` | Protegido | Registrar empresa |
| PUT | `/coperex/v1/companies/:id` | Protegido | Actualizar empresa |

**Nota:** No existe endpoint DELETE para empresas (según requisitos del proyecto).

---

## PMA punto 2 — Registro de empresas

La API permite registrar empresas con datos clave: **nivel de impacto**, **años de trayectoria** y **categoría empresarial**, más datos adicionales (nombre, contacto, descripción, web). Endpoint: `POST /coperex/v1/companies`.

Body JSON de ejemplo:

```json
{
  "companyName": "Mi Empresa SA",
  "impactLevel": "NACIONAL",
  "yearsOfExperience": 5,
  "category": "TECNOLOGÍA",
  "description": "Descripción opcional",
  "contactEmail": "contacto@miempresa.com",
  "contactPhone": "12345678",
  "website": "https://miempresa.com"
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|------------|-------------|
| `companyName` | string | Sí | Nombre único, mínimo 2 caracteres |
| `impactLevel` | string | Sí | `LOCAL`, `NACIONAL` o `INTERNACIONAL` |
| `yearsOfExperience` | number | Sí | Años de trayectoria (0–200) |
| `category` | string | Sí | Ver categorías abajo |
| `description` | string | No | Máximo 500 caracteres |
| `contactEmail` | string | Sí | Email válido |
| `contactPhone` | string | Sí | Exactamente 8 dígitos |
| `website` | string | No | URL válida |

**Categorías:** `TECNOLOGÍA`, `SALUD`, `EDUCACIÓN`, `COMERCIO`, `INDUSTRIA`, `SERVICIOS`, `OTRO`.

---

## PMA punto 3 — Visualización de empresas

Los administradores pueden ver un **listado completo** de todas las empresas registradas, **filtrar y ordenar** la información, y **editar** la información. **No existe eliminación** de empresas (no hay endpoint DELETE).

- **Listado:** `GET /coperex/v1/companies`
- **Detalle de una empresa:** `GET /coperex/v1/companies/:id`
- **Editar empresa:** `PUT /coperex/v1/companies/:id` (body con los campos a actualizar; todos opcionales)

### Filtros y orden (GET /companies)

Query params opcionales:

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `category` | Filtrar por categoría | `?category=TECNOLOGÍA` |
| `impactLevel` | Filtrar por nivel de impacto | `?impactLevel=NACIONAL` |
| `yearsOfExperience` | Años de trayectoria exactos | `?yearsOfExperience=5` |
| `minYears` | Mínimo de años de trayectoria | `?minYears=3&maxYears=10` |
| `maxYears` | Máximo de años de trayectoria | `?minYears=3&maxYears=10` |
| `sort` | Orden por nombre | `?sort=AZ` (A→Z) o `?sort=ZA` (Z→A) |

Si se envían `minYears` y/o `maxYears`, se usa rango; si no, se puede usar `yearsOfExperience` para un valor exacto.

| Criterio PMA | Parámetro API | Ejemplo |
|--------------|---------------|---------|
| Filtrar por años de trayectoria | `yearsOfExperience` o `minYears` + `maxYears` | `?yearsOfExperience=5` o `?minYears=3&maxYears=10` |
| Filtrar por categoría | `category` | `?category=TECNOLOGÍA` |
| Orden A-Z | `sort=AZ` | `?sort=AZ` |
| Orden Z-A | `sort=ZA` | `?sort=ZA` |

---

## Reporte Excel

`GET /coperex/v1/companies/report` (con token) devuelve un archivo **.xlsx** con todas las empresas. Nombre del archivo: `Empresas_Interfer.xlsx`. En clientes como Postman se usa **Send and Download** para guardar el archivo.

---

## Respuestas y códigos HTTP

- **Éxito:** `{ "success": true, "msg": "...", "data": {} }` o `data: []`
- **Error de validación:** `{ "success": false, "msg": "...", "errors": [{ "field", "message" }] }`
- **Error general:** `{ "success": false, "msg": "..." }` y en algunos casos `"error": "CODIGO"`

Códigos usados: **200**, **201**, **400**, **401**, **423**, **404**, **429**, **500**.

---

## Errores de autenticación (401)

| Situación | Mensaje típico |
|-----------|-----------------|
| Sin token | No se proporcionó token de autenticación. Use el encabezado Authorization: Bearer \<token\> |
| Token expirado | Token expirado, por favor inicie sesión nuevamente |
| Token inválido | Token no válido o inválido... |
| Cuenta desactivada | Cuenta de administrador desactivada. Contacta al administrador principal. |

---

## Colección Postman

La carpeta **`docs`** contiene la colección **`COPEREX-API.postman_collection.json`** para importar en Postman. El request de Login guarda el token en la variable `{{token}}`; el resto de requests usan **Authorization: Bearer {{token}}**.

---

## Seguridad implementada

- **JWT** con `sub`, `jti` (uuid), opcionalmente `issuer` y `audience`.
- **bcrypt** para contraseñas.
- **helmet** para cabeceras HTTP seguras.
- **CORS** configurado (incluye `Authorization` y `x-token`).
- **express-rate-limit:** 100 peticiones por IP cada 15 min (global); 10 intentos de login por IP cada 15 min.
- **express-validator** en todos los cuerpos de petición relevantes.
- Todas las rutas excepto **login** y **health** requieren token válido y admin activo.

---

## Problemas frecuentes

### Credenciales inválidas en login

- Comprobar que `.env` define correctamente `DEFAULT_ADMIN_EMAIL` y `DEFAULT_ADMIN_PASSWORD` (sin espacios extra).
- Si el admin fue creado con otra contraseña, el script `scripts/reset-default-admin-password.js` actualiza la contraseña del admin con ese email al valor actual de `DEFAULT_ADMIN_PASSWORD` en `.env`:

```bash
node scripts/reset-default-admin-password.js
```

Tras ejecutarlo, el login con las credenciales de `.env` vuelve a funcionar.

### 429 en login

La API devuelve 429 cuando se superan 10 intentos de login por IP en 15 minutos. El límite se reinicia tras ese periodo (o desde otra IP).

### 404 "La ruta solicitada no existe"

La URL debe usar la base **`/coperex/v1`** y el recurso en plural (ej.: `/companies`, no `/company`).
