/**
 * Lógica de negocio de autenticación: validación de credenciales, estado activo y generación de JWT.
 */
import Admin from '../models/admin.model.js';
import { comparePassword } from '../../helpers/encrypt.js';
import { generateJWT } from '../../helpers/generate-jwt.js';
import { messages } from '../constants/messages.js';

export const loginService = async (email, password) => {
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
        const err = new Error(messages.AUTH_INVALID_CREDENTIALS);
        err.statusCode = 401;
        throw err;
    }

    if (!admin.isActive) {
        const err = new Error('Cuenta desactivada. Contacta al administrador.');
        err.statusCode = 423;
        throw err;
    }

    const match = await comparePassword(password, admin.password);
    if (!match) {
        const err = new Error(messages.AUTH_INVALID_CREDENTIALS);
        err.statusCode = 401;
        throw err;
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = await generateJWT(admin._id.toString(), admin.role);
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

    return { admin, token, expiresAt };
};
