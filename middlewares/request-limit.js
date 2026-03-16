import rateLimit from 'express-rate-limit';

export const generalLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        msg: 'Demasiadas peticiones desde esta IP, intente más tarde',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        msg: 'Demasiados intentos de login, intente más tarde',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
