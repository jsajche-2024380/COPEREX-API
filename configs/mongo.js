import mongoose from 'mongoose';
import { env } from './app.js';

export const connectMongo = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });
        console.log('MongoDB | Conectado correctamente');
    } catch (error) {
        console.error('MongoDB | ERROR al conectar:', error.message);
        throw error;
    }
};

mongoose.connection.on('error', (err) => {
    console.error('MongoDB | Error de conexión:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB | Desconectado');
});
