/**
 * Modelo de empresa (PMA puntos 2 y 3). Campos: companyName, impactLevel, yearsOfExperience, category, description, contactEmail, contactPhone, website, registeredBy.
 */
import mongoose from 'mongoose';

export const IMPACT_LEVELS = ['LOCAL', 'NACIONAL', 'INTERNACIONAL'];
export const CATEGORIES = [
    'TECNOLOGÍA',
    'SALUD',
    'EDUCACIÓN',
    'COMERCIO',
    'INDUSTRIA',
    'SERVICIOS',
    'OTRO',
];

const companySchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: [true, 'El nombre de la empresa es obligatorio'],
            trim: true,
            unique: true,
            minlength: [2, 'Mínimo 2 caracteres'],
        },
        impactLevel: {
            type: String,
            required: [true, 'El nivel de impacto es obligatorio'],
            enum: {
                values: IMPACT_LEVELS,
                message: `Nivel de impacto inválido. Valores: ${IMPACT_LEVELS.join(', ')}`,
            },
        },
        yearsOfExperience: {
            type: Number,
            required: [true, 'Los años de trayectoria son obligatorios'],
            min: [0, 'No puede ser negativo'],
            max: [200, 'Máximo 200 años'],
        },
        category: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            enum: {
                values: CATEGORIES,
                message: `Categoría inválida. Valores: ${CATEGORIES.join(', ')}`,
            },
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Máximo 500 caracteres'],
            default: '',
        },
        contactEmail: {
            type: String,
            required: [true, 'El email de contacto es obligatorio'],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Email de contacto inválido'],
        },
        contactPhone: {
            type: String,
            required: [true, 'El teléfono es obligatorio'],
            match: [/^[0-9]{8}$/, 'El teléfono debe tener 8 dígitos'],
        },
        website: {
            type: String,
            trim: true,
            default: '',
        },
        registeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: [true, 'El admin registrador es obligatorio'],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

companySchema.index({ category: 1, impactLevel: 1 });
companySchema.index({ yearsOfExperience: 1 });
companySchema.index({ companyName: 1 });

export default mongoose.model('Company', companySchema);
