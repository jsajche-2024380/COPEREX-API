/**
 * Configuración central de la aplicación.
 * Carga variables de entorno y exporta un objeto env con valores por defecto.
 */
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'JWT_EXPIRATION'];

for (const key of requiredEnvVars) {
    if (!process.env[key] || process.env[key].trim() === '') {
        throw new Error(
            `Variable de entorno requerida no definida o vacía: ${key}. Copia .env.example a .env y completa los valores.`
        );
    }
}

export const env = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: (process.env.JWT_SECRET || '').trim(),
    JWT_EXPIRATION: (process.env.JWT_EXPIRATION || '8h').trim(),
    JWT_ISSUER: (process.env.JWT_ISSUER || '').trim(),
    JWT_AUDIENCE: (process.env.JWT_AUDIENCE || '').trim(),
    DEFAULT_ADMIN_NAME: process.env.DEFAULT_ADMIN_NAME || 'Administrador Principal',
    DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL || 'admin@coperex.com',
    DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!',
};
