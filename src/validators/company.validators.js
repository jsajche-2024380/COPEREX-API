import { body, param } from 'express-validator';
import Company from '../models/company.model.js';

const IMPACT_LEVELS = ['LOCAL', 'NACIONAL', 'INTERNACIONAL'];
const CATEGORIES = [
    'TECNOLOGÍA',
    'SALUD',
    'EDUCACIÓN',
    'COMERCIO',
    'INDUSTRIA',
    'SERVICIOS',
    'OTRO',
];

export const createCompanyValidators = [
    body('companyName')
        .notEmpty()
        .withMessage('El nombre de la empresa es obligatorio')
        .isLength({ min: 2 })
        .withMessage('El nombre debe tener al menos 2 caracteres')
        .custom(async (name) => {
            const exists = await Company.findOne({
                companyName: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
            });
            if (exists) throw new Error('Ya existe una empresa con ese nombre');
        }),
    body('impactLevel')
        .notEmpty()
        .withMessage('El nivel de impacto es obligatorio')
        .isIn(IMPACT_LEVELS)
        .withMessage(`El nivel de impacto debe ser uno de: ${IMPACT_LEVELS.join(', ')}`),
    body('yearsOfExperience')
        .notEmpty()
        .withMessage('Los años de trayectoria son obligatorios')
        .isInt({ min: 0, max: 100 })
        .withMessage('Los años de trayectoria deben ser un número entre 0 y 100'),
    body('category')
        .notEmpty()
        .withMessage('La categoría es obligatoria')
        .isIn(CATEGORIES)
        .withMessage(`La categoría debe ser una de: ${CATEGORIES.join(', ')}`),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede exceder 500 caracteres'),
    body('contactEmail')
        .notEmpty()
        .withMessage('El email de contacto es obligatorio')
        .isEmail()
        .withMessage('Debe ser un correo válido'),
    body('contactPhone')
        .notEmpty()
        .withMessage('El teléfono de contacto es obligatorio')
        .matches(/^[0-9]{8}$/)
        .withMessage('El teléfono debe tener exactamente 8 dígitos numéricos'),
    body('website')
        .optional()
        .if((value) => value && value.length > 0)
        .isURL()
        .withMessage('El sitio web debe ser una URL válida'),
];

export const updateCompanyValidators = [
    param('id').isMongoId().withMessage('ID de empresa inválido'),
    body('companyName')
        .optional()
        .isLength({ min: 2 })
        .withMessage('El nombre debe tener al menos 2 caracteres')
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
        .isIn(IMPACT_LEVELS)
        .withMessage(`El nivel de impacto debe ser uno de: ${IMPACT_LEVELS.join(', ')}`),
    body('yearsOfExperience')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('Los años de trayectoria deben ser un número entre 0 y 100'),
    body('category')
        .optional()
        .isIn(CATEGORIES)
        .withMessage(`La categoría debe ser una de: ${CATEGORIES.join(', ')}`),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede exceder 500 caracteres'),
    body('contactEmail')
        .optional()
        .isEmail()
        .withMessage('Debe ser un correo válido'),
    body('contactPhone')
        .optional()
        .matches(/^[0-9]{8}$/)
        .withMessage('El teléfono debe tener exactamente 8 dígitos numéricos'),
    body('website')
        .optional()
        .if((value) => value && value.length > 0)
        .isURL()
        .withMessage('El sitio web debe ser una URL válida'),
];
