import { Router } from 'express';
import {
    getAll,
    getById,
    create,
    update,
    updatePassword,
} from '../controllers/admin.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateFields } from '../../middlewares/validate-fields.js';
import {
    createAdminValidators,
    updateAdminValidators,
    changePasswordValidators,
} from '../validators/admin.validators.js';

const router = Router();

router.get('/', validateJWT, getAll);
router.patch(
    '/change-password',
    validateJWT,
    changePasswordValidators,
    validateFields,
    updatePassword
);
router.get('/:id', validateJWT, getById);
router.post('/', validateJWT, createAdminValidators, validateFields, create);
router.put('/:id', validateJWT, updateAdminValidators, validateFields, update);

export default router;
