import mongoose from 'mongoose';
import { ADMIN_ROLE } from '../constants/roles.js';

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            minlength: [3, 'Mínimo 3 caracteres'],
        },
        email: {
            type: String,
            required: [true, 'El correo es obligatorio'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
        },
        role: {
            type: String,
            default: ADMIN_ROLE,
            immutable: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            default: null,
        },
        lastLogin: { type: Date, default: null },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

adminSchema.set('toJSON', {
    transform(_doc, ret) {
        delete ret.password;
        return ret;
    },
});

export default mongoose.model('Admin', adminSchema);
