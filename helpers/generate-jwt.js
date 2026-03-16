import jwt from 'jsonwebtoken';
import { env } from '../configs/app.js';

export const generateJWT = (uid, email, role) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, email, role };
        jwt.sign(
            payload,
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRATION },
            (err, token) => {
                if (err) reject(err);
                else resolve(token);
            }
        );
    });
};
