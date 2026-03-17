/**
 * Generación de tokens JWT.
 * Payload incluye sub (id del admin), role y jti (uuid). Opcionalmente issuer y audience desde env.
 */
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../configs/app.js';

/** Genera un JWT firmado con el uid y rol indicados. */
export const generateJWT = (uid, role = 'ADMIN_ROLE') => {
    return new Promise((resolve, reject) => {
        const payload = {
            sub: uid,
            role,
            jti: uuidv4(),
        };

        const options = {
            expiresIn: env.JWT_EXPIRATION,
        };
        if (env.JWT_ISSUER) options.issuer = env.JWT_ISSUER;
        if (env.JWT_AUDIENCE) options.audience = env.JWT_AUDIENCE;

        jwt.sign(payload, env.JWT_SECRET, options, (err, token) => {
            if (err) {
                console.error('JWT | Error al generar token:', err.message);
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
};
