export const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.path} | ${err.message}`);

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        return res.status(400).json({
            success: false,
            msg: 'Error de validación',
            errors,
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            msg: `El campo "${field}" ya está en uso`,
            error: 'DUPLICATE_FIELD',
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            msg: 'ID inválido',
            error: 'INVALID_ID',
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            msg: 'Token inválido',
            error: 'INVALID_TOKEN',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            msg: 'Token expirado',
            error: 'TOKEN_EXPIRED',
        });
    }

    res.status(500).json({
        success: false,
        msg: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR',
    });
};
