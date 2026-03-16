import jwt from 'jsonwebtoken';
import Admin from '../src/models/admin.model.js';
import { env } from '../configs/app.js';
import { messages } from '../src/constants/messages.js';

export const validateJWT = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        return res.status(401).json({ msg: messages.TOKEN_MISSING });
    }
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        const admin = await Admin.findById(decoded.uid);
        if (!admin || !admin.isActive) {
            return res.status(401).json({ msg: messages.TOKEN_INVALID });
        }
        req.admin = admin;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: messages.TOKEN_EXPIRED });
        }
        return res.status(401).json({ msg: messages.TOKEN_INVALID });
    }
};
