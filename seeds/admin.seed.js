/**
 * Seed del administrador por defecto.
 * Crea un único admin si la colección está vacía; no modifica admins existentes.
 */
import Admin from '../src/models/admin.model.js';
import { env } from '../configs/app.js';
import { hashPassword } from '../helpers/encrypt.js';

export const checkAndCreateDefaultAdmin = async () => {
    const defaultEmail = String(env.DEFAULT_ADMIN_EMAIL).trim().toLowerCase();

    const count = await Admin.countDocuments();
    if (count > 0) {
        console.log('Seeds | Admin ya existe — no se realizan cambios');
        return;
    }

    const defaultPassword = String(env.DEFAULT_ADMIN_PASSWORD).trim();
    const hashedPassword = await hashPassword(defaultPassword);

    await Admin.create({
        name: String(env.DEFAULT_ADMIN_NAME).trim(),
        email: defaultEmail,
        password: hashedPassword,
        isActive: true,
    });

    console.log('Seeds | Administrador por defecto creado');
    console.log(`Seeds | Email:     ${defaultEmail}`);
    console.log(`Seeds | Contraseña: valor de DEFAULT_ADMIN_PASSWORD en .env`);
};
