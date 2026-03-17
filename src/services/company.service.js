import Company from '../models/company.model.js';
import { messages } from '../constants/messages.js';

export const getAllCompanies = async (filters = {}, sort = '') => {
    const query = {};

    if (filters.category) query.category = filters.category;
    if (filters.impactLevel) query.impactLevel = filters.impactLevel;

    if (filters.minYears != null || filters.maxYears != null) {
        query.yearsOfExperience = {};
        if (filters.minYears != null) query.yearsOfExperience.$gte = Number(filters.minYears);
        if (filters.maxYears != null) query.yearsOfExperience.$lte = Number(filters.maxYears);
    } else if (filters.yearsOfExperience != null) {
        query.yearsOfExperience = filters.yearsOfExperience;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'AZ') sortOption = { companyName: 1 };
    if (sort === 'ZA') sortOption = { companyName: -1 };

    return Company.find(query).sort(sortOption).lean();
};

export const getCompanyById = async (id) => {
    const company = await Company.findById(id).populate('registeredBy', 'name email');
    if (!company) {
        const err = new Error(messages.COMPANY_NOT_FOUND);
        err.statusCode = 404;
        throw err;
    }
    return company;
};

export const createCompany = async (data, adminId) => {
    const company = await Company.create({
        ...data,
        companyName: data.companyName.trim(),
        contactEmail: data.contactEmail.toLowerCase().trim(),
        contactPhone: String(data.contactPhone).trim(),
        website: data.website ? data.website.trim() : '',
        description: data.description ? data.description.trim() : '',
        registeredBy: adminId,
    });
    return company;
};

export const updateCompany = async (id, data) => {
    const company = await Company.findById(id);
    if (!company) {
        const err = new Error(messages.COMPANY_NOT_FOUND);
        err.statusCode = 404;
        throw err;
    }
    const allowed = [
        'companyName',
        'impactLevel',
        'yearsOfExperience',
        'category',
        'description',
        'contactEmail',
        'contactPhone',
        'website',
    ];
    for (const key of allowed) {
        if (data[key] !== undefined) company[key] = data[key];
    }
    if (company.companyName) company.companyName = company.companyName.trim();
    if (company.contactEmail) company.contactEmail = company.contactEmail.toLowerCase().trim();
    await company.save();
    return company;
};
