/**
 * Rutas de autenticación (PMA punto 1).
 * Login público con rate limit; /me y /logout requieren JWT.
 */
import { Router } from 'express';
import { login, logout, getMe } from '../controllers/auth.controller.js';
import { loginValidators } from '../validators/auth.validators.js';
import { validateFields } from '../../middlewares/validate-fields.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { loginLimiter } from '../../middlewares/request-limit.js';

const router = Router();

router.post('/login', loginLimiter, loginValidators, validateFields, login);
router.get('/me', validateJWT, getMe);
router.post('/logout', validateJWT, logout);

export default router;
