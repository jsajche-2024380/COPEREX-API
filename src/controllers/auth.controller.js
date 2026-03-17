import { loginService } from '../services/auth.service.js';
import { messages } from '../constants/messages.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { admin, token, expiresAt } = await loginService(email, password);

        return res.status(200).json({
            success: true,
            msg: messages.AUTH_LOGIN_SUCCESS,
            token,
            expiresAt,
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                lastLogin: admin.lastLogin,
            },
        });
    } catch (error) {
        console.error('Auth | login error:', error.message);
        const status = error.statusCode || 500;
        return res.status(status).json({
            success: false,
            msg: error.message || messages.SERVER_ERROR,
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const admin = req.admin;
        return res.status(200).json({
            success: true,
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                isActive: admin.isActive,
                lastLogin: admin.lastLogin,
                createdAt: admin.createdAt,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: messages.SERVER_ERROR });
    }
};

export const logout = async (_req, res) => {
    return res.status(200).json({
        success: true,
        msg: messages.AUTH_LOGOUT_SUCCESS,
    });
};
