/**
 * Validadores para empresas: creación (PMA 2) y actualización; usan IMPACT_LEVELS y CATEGORIES del modelo.
 */
import { body, param } from 'express-validator';
import Company, { IMPACT_LEVELS, CATEGORIES } from '../models/company.model.js';

export const createCompanyValidators = [
    body('companyName')
        .trim()
        .notEmpty().withMessage('El nombre de la empresa es obligatorio')
        .isLength({ min: 2 }).withMessage('Mínimo 2 caracteres')
        .custom(async (name) => {
            const exists = await Company.findOne({
                companyName: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
            });
            if (exists) throw new Error('Ya existe una empresa con ese nombre');
        }),
    body('impactLevel')
        .notEmpty().withMessage('El nivel de impacto es obligatorio')
        .isIn(IMPACT_LEVELS).withMessage(`Valores válidos: ${IMPACT_LEVELS.join(', ')}`),
    body('yearsOfExperience')
        .notEmpty().withMessage('Los años de trayectoria son obligatorios')
        .isInt({ min: 0, max: 200 }).withMessage('Debe ser un número entre 0 y 200'),
    body('category')
        .notEmpty().withMessage('La categoría es obligatoria')
        .isIn(CATEGORIES).withMessage(`Valores válidos: ${CATEGORIES.join(', ')}`),
    body('description')
        .optional()
        .isLength({ max: 500 }).withMessage('Máximo 500 caracteres'),
    body('contactEmail')
        .trim()
        .notEmpty().withMessage('El email de contacto es obligatorio')
        .isEmail().withMessage('Debe ser un correo válido'),
    body('contactPhone')
        .trim()
        .notEmpty().withMessage('El teléfono es obligatorio')
        .matches(/^[0-9]{8}$/).withMessage('Debe tener exactamente 8 dígitos'),
    body('website')
        .optional()
        .if((v) => v && v.length > 0)
        .isURL().withMessage('Debe ser una URL válida'),
];

export const updateCompanyValidators = [
    param('id').isMongoId().withMessage('ID de empresa inválido'),
    body('companyName')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Mínimo 2 caracteres')
        .custom(async (name, { req }) => {
            if (!name) return true;
            const exists = await Company.findOne({
                companyName: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
                _id: { $ne: req.params.id },
            });
            if (exists) throw new Error('Ya existe una empresa con ese nombre');
        }),
    body('impactLevel')
        .optional()
        .isIn(IMPACT_LEVELS).withMessage(`Valores válidos: ${IMPACT_LEVELS.join(', ')}`),
    body('yearsOfExperience')
        .optional()
        .isInt({ min: 0, max: 200 }).withMessage('Debe ser un número entre 0 y 200'),
    body('category')
        .optional()
        .isIn(CATEGORIES).withMessage(`Valores válidos: ${CATEGORIES.join(', ')}`),
    body('description')
        .optional()
        .isLength({ max: 500 }).withMessage('Máximo 500 caracteres'),
    body('contactEmail')
        .optional()
        .trim()
        .isEmail().withMessage('Debe ser un correo válido'),
    body('contactPhone')
        .optional()
        .trim()
        .matches(/^[0-9]{8}$/).withMessage('Debe tener exactamente 8 dígitos'),
    body('website')
        .optional()
        .if((v) => v && v.length > 0)
        .isURL().withMessage('Debe ser una URL válida'),
];
