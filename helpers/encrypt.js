/**
 * Utilidades de cifrado para contraseñas (bcrypt).
 */
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/** Genera el hash de una contraseña en texto plano. */
export const hashPassword = (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

/** Compara una contraseña en texto plano con un hash almacenado. */
export const comparePassword = (plain, hashed) => {
    return bcrypt.compare(plain, hashed);
};
