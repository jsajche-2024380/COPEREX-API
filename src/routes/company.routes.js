import { Router } from 'express';
import { getAll, getById, create, update, generateExcelReport } from '../controllers/company.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateFields } from '../../middlewares/validate-fields.js';
import { createCompanyValidators, updateCompanyValidators } from '../validators/company.validators.js';

const router = Router();

router.get('/', validateJWT, getAll);
router.post('/', validateJWT, createCompanyValidators, validateFields, create);
router.get('/report', validateJWT, generateExcelReport);

router.get('/:id', validateJWT, getById);
router.put('/:id', validateJWT, updateCompanyValidators, validateFields, update);

export default router;
