import mongoose from 'mongoose';
import {
    getAllAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    updateMyPassword,
} from '../services/admin.service.js';
import { messages } from '../constants/messages.js';

export const getAll = async (req, res) => {
    try {
        const admins = await getAllAdmins();
        return res.status(200).json({ data: admins });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: messages.SERVER_ERROR });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'ID de administrador inválido' });
        }
        const admin = await getAdminById(id);
        return res.status(200).json({ data: admin });
    } catch (error) {
        console.error(error);
        const status = error.statusCode || 500;
        const msg = error.message || messages.SERVER_ERROR;
        return res.status(status).json({ msg });
    }
};

export const create = async (req, res) => {
    try {
        const creatorId = req.admin._id;
        const admin = await createAdmin(req.body, creatorId);
        return res.status(201).json({ msg: messages.ADMIN_CREATED, data: admin });
    } catch (error) {
        console.error(error);
        const status = error.statusCode || 500;
        const msg = error.message || messages.SERVER_ERROR;
        return res.status(status).json({ msg });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'ID de administrador inválido' });
        }
        if (id === req.admin._id.toString()) {
            return res.status(400).json({ msg: messages.ADMIN_CANNOT_EDIT_SELF });
        }
        const admin = await updateAdmin(id, req.body);
        return res.status(200).json({ msg: messages.ADMIN_UPDATED, data: admin });
    } catch (error) {
        console.error(error);
        const status = error.statusCode || 500;
        const msg = error.message || messages.SERVER_ERROR;
        return res.status(status).json({ msg });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const id = req.admin._id.toString();
        const { currentPassword, newPassword } = req.body;
        await updateMyPassword(id, currentPassword, newPassword);
        return res.status(200).json({ msg: messages.PASSWORD_CHANGED });
    } catch (error) {
        console.error(error);
        const status = error.statusCode || 500;
        const msg = error.message || messages.SERVER_ERROR;
        return res.status(status).json({ msg });
    }
};
