import mongoose from 'mongoose';
import { env } from './app.js';

export const connectMongo = async () => {
    try {
        mongoose.connection.on('connecting', () => console.log('MongoDB | intentando conectar...'));
        mongoose.connection.on('connected', () => console.log('MongoDB | conectado exitosamente'));
        mongoose.connection.on('open', () => console.log('MongoDB | base de datos coperex_db abierta'));
        mongoose.connection.on('disconnected', () => console.log('MongoDB | desconectado'));
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB | error de conexión:', err.message);
            mongoose.disconnect();
        });

        await mongoose.connect(env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });
    } catch (error) {
        console.error('MongoDB | ERROR al conectar:', error.message);
        throw error;
    }
};

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB | conexión cerrada (SIGINT)');
    process.exit(0);
});
