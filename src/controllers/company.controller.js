import mongoose from 'mongoose';
import {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
} from '../services/company.service.js';
import { generateExcelWorkbook } from '../../helpers/generate-excel.js';
import { messages } from '../constants/messages.js';

export const getAll = async (req, res) => {
    try {
        const { category, impactLevel, yearsOfExperience, minYears, maxYears, sort } = req.query;
        const filters = {};
        if (category) filters.category = category;
        if (impactLevel) filters.impactLevel = impactLevel;
        if (yearsOfExperience !== undefined) filters.yearsOfExperience = yearsOfExperience;
        if (minYears !== undefined) filters.minYears = minYears;
        if (maxYears !== undefined) filters.maxYears = maxYears;
        const companies = await getAllCompanies(filters, sort);
        return res.status(200).json({ data: companies });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: messages.SERVER_ERROR });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'ID de empresa inválido' });
        }
        const company = await getCompanyById(id);
        return res.status(200).json({ data: company });
    } catch (error) {
        console.error(error);
        const status = error.statusCode || 500;
        const msg = error.message || messages.SERVER_ERROR;
        return res.status(status).json({ msg });
    }
};

export const create = async (req, res) => {
    try {
        const adminId = req.admin._id;
        const company = await createCompany(req.body, adminId);
        return res.status(201).json({ msg: messages.COMPANY_CREATED, data: company });
    } catch (error) {
        console.error(error);
        const status = error.statusCode || 500;
        const msg = error.message || messages.SERVER_ERROR;
        return res.status(status).json({ msg });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'ID de empresa inválido' });
        }
        const company = await updateCompany(id, req.body);
        return res.status(200).json({ msg: messages.COMPANY_UPDATED, data: company });
    } catch (error) {
        console.error(error);
        const status = error.statusCode || 500;
        const msg = error.message || messages.SERVER_ERROR;
        return res.status(status).json({ msg });
    }
};

export const generateExcelReport = async (req, res) => {
    try {
        const workbook = await generateExcelWorkbook();
        if (!workbook) {
            return res.status(200).json({ msg: messages.REPORT_NO_DATA });
        }
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=Empresas_Interfer.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: messages.SERVER_ERROR });
    }
};
