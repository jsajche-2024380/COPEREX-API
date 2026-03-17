import rateLimit from 'express-rate-limit';
import { messages } from '../src/constants/messages.js';

export const generalLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, msg: messages.RATE_LIMIT_EXCEEDED },
    standardHeaders: true,
    legacyHeaders: false,
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        msg: 'Demasiados intentos de inicio de sesión. Intenta en 15 minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
