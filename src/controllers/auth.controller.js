import { loginService } from '../services/auth.service.js';
import { messages } from '../constants/messages.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { admin, token } = await loginService(email, password);
        return res.status(200).json({
            msg: messages.AUTH_LOGIN_SUCCESS,
            data: { token, admin },
        });
    } catch (error) {
        console.error(error);
        const status = error.statusCode || 500;
        const msg = error.message || messages.SERVER_ERROR;
        return res.status(status).json({ msg });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).json({
            msg: messages.AUTH_LOGOUT_SUCCESS,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: messages.SERVER_ERROR });
    }
};
