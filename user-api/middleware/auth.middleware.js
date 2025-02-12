import jwt from 'jsonwebtoken';
import CustomError from '../utils/CustomError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'RANDOMSECRETKEY';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new CustomError('Authentication token required', 401));
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return next(new CustomError('Invalid or expired token', 403));
        }
        req.user = user;
        next();
    });
};