/**
 * Script de utilidad: actualiza la contraseña del admin con DEFAULT_ADMIN_EMAIL al valor actual de DEFAULT_ADMIN_PASSWORD en .env.
 * Uso: node scripts/reset-default-admin-password.js (con MONGODB_URI y DEFAULT_* definidos en .env).
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../src/models/admin.model.js';
import { hashPassword } from '../helpers/encrypt.js';

dotenv.config();

const email = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@coperex.com').trim().toLowerCase();
const newPassword = (process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!').trim();

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log('No existe un admin con ese email. El seed crea el admin al arrancar el servidor (npm run dev).');
            process.exit(1);
        }
        admin.password = await hashPassword(newPassword);
        await admin.save();
        console.log('Contraseña del admin por defecto actualizada. Credenciales: email =', email, '| contraseña = valor de DEFAULT_ADMIN_PASSWORD en .env');
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

run();
