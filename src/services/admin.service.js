/**
 * Servicios de administradores: CRUD y cambio de contraseña. Las respuestas excluyen el campo password.
 */
import Admin from '../models/admin.model.js';
import { hashPassword, comparePassword } from '../../helpers/encrypt.js';
import { messages } from '../constants/messages.js';

export const getAllAdmins = async () => {
    return Admin.find({ isActive: true })
        .sort({ createdAt: -1 })
        .select('-password')
        .lean();
};

export const getAdminById = async (id) => {
    const admin = await Admin.findById(id).select('-password');
    if (!admin) {
        const err = new Error(messages.ADMIN_NOT_FOUND);
        err.statusCode = 404;
        throw err;
    }
    return admin;
};

export const createAdmin = async (data, creatorId) => {
    const hashedPassword = await hashPassword(data.password);
    const admin = await Admin.create({
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        createdBy: creatorId,
        isActive: true,
    });
    const { password: _pw, ...adminData } = admin.toObject();
    return adminData;
};

export const updateAdmin = async (id, data) => {
    const admin = await Admin.findById(id);
    if (!admin) {
        const err = new Error(messages.ADMIN_NOT_FOUND);
        err.statusCode = 404;
        throw err;
    }

    if (data.name !== undefined) admin.name = data.name.trim();
    if (data.email !== undefined) admin.email = data.email.toLowerCase().trim();

    await admin.save();

    const result = await Admin.findById(id).select('-password');
    return result;
};

export const updateMyPassword = async (id, currentPassword, newPassword) => {
    const admin = await Admin.findById(id);
    if (!admin) {
        const err = new Error(messages.ADMIN_NOT_FOUND);
        err.statusCode = 404;
        throw err;
    }

    const match = await comparePassword(currentPassword, admin.password);
    if (!match) {
        const err = new Error(messages.PASSWORD_INCORRECT);
        err.statusCode = 400;
        throw err;
    }

    admin.password = await hashPassword(newPassword);
    await admin.save();
};
