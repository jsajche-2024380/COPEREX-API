import { validationResult } from 'express-validator';
import { messages } from '../src/constants/messages.js';

export const validateFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: messages.VALIDATION_ERROR,
            errors: errors.array().map((err) => ({
                field: err.path || err.param,
                message: err.msg,
            })),
        });
    }
    next();
};
