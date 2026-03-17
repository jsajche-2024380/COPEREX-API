'use strict';
/**
 * Configuración del servidor Express.
 * Registra middlewares globales, rutas bajo BASE_PATH y el manejador de errores.
 */
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { generalLimit } from '../middlewares/request-limit.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import authRoutes from '../src/routes/auth.routes.js';
import adminRoutes from '../src/routes/admin.routes.js';
import companyRoutes from '../src/routes/company.routes.js';

export const BASE_PATH = '/coperex/v1';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-token'],
}));
app.use(helmet());
app.use(generalLimit);
app.use(morgan('dev'));

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/admins`, adminRoutes);
app.use(`${BASE_PATH}/companies`, companyRoutes);

/** Ruta pública de health check. */
app.get(`${BASE_PATH}/health`, (_req, res) => {
    res.status(200).json({
        success: true,
        status: 'Healthy',
        timestamp: new Date().toISOString(),
        service: 'COPEREX Interfer API',
    });
});

/** Respuesta 404 para rutas no registradas. */
app.use((_req, res) => {
    res.status(404).json({ success: false, msg: 'La ruta solicitada no existe' });
});

app.use(errorHandler);

export default app;
