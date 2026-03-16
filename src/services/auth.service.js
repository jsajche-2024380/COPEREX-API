import Admin from '../models/admin.model.js';
import { comparePassword } from '../../helpers/encrypt.js';
import { generateJWT } from '../../helpers/generate-jwt.js';
import { messages } from '../constants/messages.js';

export const loginService = async (email, password) => {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
        const err = new Error(messages.AUTH_INVALID_CREDENTIALS);
        err.statusCode = 400;
        throw err;
    }
    if (!admin.isActive) {
        const err = new Error(messages.AUTH_ACCOUNT_LOCKED);
        err.statusCode = 403;
        throw err;
    }
    const match = await comparePassword(password, admin.password);
    if (!match) {
        admin.loginAttempts += 1;
        if (admin.loginAttempts >= 5) {
            admin.isActive = false;
        }
        await admin.save();
        const err = new Error(messages.AUTH_INVALID_CREDENTIALS);
        err.statusCode = 400;
        throw err;
    }
    admin.loginAttempts = 0;
    admin.lastLogin = new Date();
    await admin.save();
    const token = await generateJWT(admin._id.toString(), admin.email, admin.role);
    return { admin, token };
};
