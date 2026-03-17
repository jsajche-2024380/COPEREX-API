import jwt from 'jsonwebtoken';
import Admin from '../src/models/admin.model.js';
import { env } from '../configs/app.js';
import { messages } from '../src/constants/messages.js';

export const validateJWT = async (req, res, next) => {
    const token =
        req.header('x-token') ||
        req.header('Authorization')?.replace('Bearer ', '').trim();

    if (!token || token === '' || token === '{{token}}') {
        return res.status(401).json({
            success: false,
            msg: messages.TOKEN_MISSING,
            error: 'MISSING_TOKEN',
        });
    }

    if (!env.JWT_SECRET) {
        console.error('JWT | JWT_SECRET no está definido en .env');
        return res.status(500).json({
            success: false,
            msg: messages.SERVER_ERROR,
        });
    }

    try {
        const verifyOptions = {};
        if (env.JWT_ISSUER) verifyOptions.issuer = env.JWT_ISSUER;
        if (env.JWT_AUDIENCE) verifyOptions.audience = env.JWT_AUDIENCE;

        const decoded = jwt.verify(token, env.JWT_SECRET, verifyOptions);

        const adminId = decoded.sub || decoded.uid;
        if (!adminId) {
            return res.status(401).json({
                success: false,
                msg: messages.TOKEN_INVALID,
                error: 'INVALID_TOKEN',
            });
        }

        const admin = await Admin.findById(adminId).select('-password');
        if (!admin) {
            return res.status(401).json({
                success: false,
                msg: messages.TOKEN_INVALID,
                error: 'INVALID_TOKEN',
            });
        }

        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                msg: messages.ACCOUNT_DISABLED,
                error: 'ACCOUNT_DISABLED',
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                msg: messages.TOKEN_EXPIRED,
                error: 'TOKEN_EXPIRED',
            });
        }
        console.error('JWT | Error al verificar token:', error.message);
        return res.status(401).json({
            success: false,
            msg: messages.TOKEN_INVALID,
            error: 'INVALID_TOKEN',
        });
    }
};
