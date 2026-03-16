import { body, param } from 'express-validator';
import Admin from '../models/admin.model.js';

export const createAdminValidators = [
    body('name')
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isLength({ min: 3 })
        .withMessage('El nombre debe tener al menos 3 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),
    body('email')
        .notEmpty()
        .withMessage('El correo es obligatorio')
        .isEmail()
        .withMessage('Debe ser un correo válido')
        .custom(async (email) => {
            const exists = await Admin.findOne({ email: email.toLowerCase() });
            if (exists) throw new Error('El correo electrónico ya está registrado');
        }),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/(?=.*[A-Z])/)
        .withMessage('La contraseña debe tener al menos una mayúscula')
        .matches(/(?=.*[0-9])/)
        .withMessage('La contraseña debe tener al menos un número'),
];

export const updateAdminValidators = [
    param('id').isMongoId().withMessage('ID de administrador inválido'),
    body('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage('El nombre debe tener al menos 3 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Debe ser un correo válido')
        .custom(async (email, { req }) => {
            if (!email) return true;
            const other = await Admin.findOne({
                email: email.toLowerCase(),
                _id: { $ne: req.params.id },
            });
            if (other) throw new Error('El correo electrónico ya está registrado');
        }),
];

export const changePasswordValidators = [
    body('currentPassword')
        .notEmpty()
        .withMessage('La contraseña actual es obligatoria'),
    body('newPassword')
        .notEmpty()
        .withMessage('La nueva contraseña es obligatoria')
        .isLength({ min: 8 })
        .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
        .matches(/(?=.*[A-Z])/)
        .withMessage('La nueva contraseña debe tener al menos una mayúscula')
        .matches(/(?=.*[0-9])/)
        .withMessage('La nueva contraseña debe tener al menos un número'),
];
