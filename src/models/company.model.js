import mongoose from 'mongoose';

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

const companySchema = new mongoose.Schema(
    {
        companyName: { type: String, required: true, trim: true, unique: true },
        impactLevel: {
            type: String,
            required: true,
            enum: IMPACT_LEVELS,
        },
        yearsOfExperience: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        category: {
            type: String,
            required: true,
            enum: CATEGORIES,
        },
        description: { type: String, trim: true, maxlength: 500 },
        contactEmail: { type: String, required: true, trim: true, lowercase: true },
        contactPhone: { type: String, required: true, match: /^[0-9]{8}$/ },
        website: { type: String, trim: true, default: '' },
        registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

companySchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.model('Company', companySchema);
