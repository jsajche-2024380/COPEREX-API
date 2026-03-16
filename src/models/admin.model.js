import mongoose from 'mongoose';
import { ADMIN_ROLE } from '../constants/roles.js';

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, default: ADMIN_ROLE },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
        lastLogin: { type: Date, default: null },
        loginAttempts: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

adminSchema.set('toJSON', {
    transform(_doc, ret) {
        delete ret.password;
        return ret;
    },
});

export default mongoose.model('Admin', adminSchema);
