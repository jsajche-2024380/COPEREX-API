import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { generalLimit } from '../middlewares/request-limit.js';
import authRoutes from '../src/routes/auth.routes.js';
import adminRoutes from '../src/routes/admin.routes.js';
import companyRoutes from '../src/routes/company.routes.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(generalLimit);

app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/companies', companyRoutes);

app.use((_req, res) => {
    res.status(404).json({
        msg: 'La ruta solicitada no existe',
    });
});

export default app;
