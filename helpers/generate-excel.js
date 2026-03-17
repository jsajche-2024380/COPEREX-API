import ExcelJS from 'exceljs';
import Company from '../src/models/company.model.js';

const HEADER_STYLE = {
    fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1e3a5f' },
    },
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    },
};

const ROW_ALT_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };

const COLUMNS = [
    { header: 'Nombre de Empresa', width: 30 },
    { header: 'Categoría', width: 20 },
    { header: 'Nivel de Impacto', width: 20 },
    { header: 'Años de Trayectoria', width: 20 },
    { header: 'Email de Contacto', width: 30 },
    { header: 'Teléfono', width: 15 },
    { header: 'Sitio Web', width: 30 },
    { header: 'Fecha de Registro', width: 20 },
];

function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-GT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

export async function generateExcelWorkbook() {
    const companies = await Company.find().sort({ companyName: 1 }).lean();
    if (!companies || companies.length === 0) return null;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Empresas Interfer', { views: [{ state: 'frozen', ySplit: 1 }] });

    sheet.columns = COLUMNS.map((col) => ({ header: col.header, width: col.width }));

    const headerRow = sheet.getRow(1);
    headerRow.values = COLUMNS.map((col) => col.header);
    headerRow.eachCell((cell) => {
        cell.fill = HEADER_STYLE.fill;
        cell.font = HEADER_STYLE.font;
        cell.alignment = HEADER_STYLE.alignment;
        cell.border = HEADER_STYLE.border;
    });

    companies.forEach((company, index) => {
        const row = sheet.addRow([
            company.companyName || '',
            company.category || '',
            company.impactLevel || '',
            company.yearsOfExperience ?? '',
            company.contactEmail || '',
            company.contactPhone || '',
            company.website || '',
            formatDate(company.createdAt),
        ]);
        row.eachCell((cell, colNumber) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
            if (index % 2 === 1) cell.fill = ROW_ALT_FILL;
        });
    });

    const summaryRow = sheet.addRow([`Total de empresas registradas: ${companies.length}`]);
    summaryRow.getCell(1).font = { bold: true };
    summaryRow.getCell(1).alignment = { horizontal: 'left' };

    return workbook;
}
