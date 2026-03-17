

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
            console.log('No existe un admin con ese email. Ejecuta el servidor (npm run dev) para que el seed lo cree.');
            process.exit(1);
        }
        admin.password = await hashPassword(newPassword);
        await admin.save();
        console.log('Contraseña del admin por defecto actualizada. Ya puedes loguearte con:', email, 'y la contraseña de tu .env');
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

run();
