import { body } from 'express-validator';

export const loginValidators = [
    body('email')
        .notEmpty()
        .withMessage('El correo es obligatorio')
        .isEmail()
        .withMessage('Debe ser un correo válido'),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
];
