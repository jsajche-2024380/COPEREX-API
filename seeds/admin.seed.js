import Admin from '../src/models/admin.model.js';
import { env } from '../configs/app.js';
import { hashPassword } from '../helpers/encrypt.js';

export const checkAndCreateDefaultAdmin = async () => {
    const count = await Admin.countDocuments();
    if (count > 0) {
        console.log('Seeds | Ya existe al menos un administrador, no se crea ninguno');
        return;
    }
    const hashedPassword = await hashPassword(env.DEFAULT_ADMIN_PASSWORD);
    await Admin.create({
        name: env.DEFAULT_ADMIN_NAME,
        email: env.DEFAULT_ADMIN_EMAIL,
        password: hashedPassword,
    });
    console.log('Seeds | Administrador por defecto creado');
};
