/**
 * Rate limiters para la API.
 * generalLimit: aplica a todas las rutas. loginLimiter: solo al endpoint de login (protección fuerza bruta).
 */
import rateLimit from 'express-rate-limit';
import { messages } from '../src/constants/messages.js';

/** Límite global por IP (100 peticiones / 15 min). */
export const generalLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, msg: messages.RATE_LIMIT_EXCEEDED },
    standardHeaders: true,
    legacyHeaders: false,
});

/** Límite estricto para login (10 intentos / 15 min por IP). */
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
