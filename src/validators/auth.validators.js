/**
 * Validadores para el body del login: email obligatorio y formato válido, password obligatorio (sin validar formato).
 */
import { body } from 'express-validator';

export const loginValidators = [
    body('email')
        .trim()
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
];
