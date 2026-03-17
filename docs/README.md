# Documentación COPEREX-API

## Colección Postman

Archivo: **`COPEREX-API.postman_collection.json`**

### Cómo importar en Postman

1. Abre Postman.
2. Click en **Import** (arriba izquierda).
3. Arrastra el archivo `COPEREX-API.postman_collection.json` o selecciónalo desde la carpeta `docs`.
4. La colección **COPEREX-API - Feria Interfer** aparecerá en el panel izquierdo.

### Cómo usar

1. Asegúrate de que el servidor esté corriendo (`npm run dev` en la raíz del proyecto).
2. La variable **baseUrl** viene por defecto en `http://localhost:3000`. Si usas otro puerto, edita la variable en la colección (click derecho en la colección → Edit → Variables).
3. Ejecuta **Auth → Login** con el admin por defecto (`admin@coperex.com` / `Admin123!`). El token se guarda solo en la variable **token**.
4. El resto de peticiones (Admins, Companies) usan ese token en **Authorization → Bearer Token** con valor `{{token}}`. Es requisito que el token del login se envíe en **Authorization** como **Bearer Token**; si no se envía o es inválido, la API responde **401** y no se ejecuta la acción.

### Errores cuando falta o falla el token (401)

| Situación | Mensaje de error |
|-----------|------------------|
| No se envía token | «No se proporcionó token de autenticación. Use el encabezado Authorization: Bearer \<token\>» |
| Token expirado | «Token expirado, por favor inicie sesión nuevamente» |
| Token inválido o corrupto | «Token no válido o inválido. Verifique que esté usando el token del login en Authorization: Bearer» |
| Cuenta del admin desactivada | «Cuenta de administrador desactivada. Contacta al administrador principal.» |

### Contenido de la colección

- **Auth:** Login (guarda token), Logout.
- **Admins:** Listar, obtener por ID, crear, actualizar, cambiar contraseña.
- **Companies:** Listar (con filtros opcionales), descargar Excel, obtener por ID, registrar, actualizar.
