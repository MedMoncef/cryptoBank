import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import CustomError from '../utils/CustomError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'RANDOMSECRETKEY';

export const login = async (req, res, next) => {
    try {
        const { email, motDePasse } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw new CustomError('Invalid email or password', 401);
        }

        const isValidPassword = await user.comparePassword(motDePasse);
        if (!isValidPassword) {
            throw new CustomError('Invalid email or password', 401);
        }

        if (user.statut !== 'ACTIVE') {
            throw new CustomError('Account is not active', 403);
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                status: user.statut
            }, 
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                statut: user.statut,
                statutVerificationEmail: user.statutVerificationEmail,
                statutVerificationTelephone: user.statutVerificationTelephone
            }
        });
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const register = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new CustomError('Email already registered', 400);
        }

        // Create user with initial INACTIVE status
        const user = new User({
            ...req.body,
            statut: 'INACTIVE'
        });
        await user.save();

        // Generate verification token
        const verificationToken = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Here you would typically send an email with verification link
        // For now, we'll just return the token
        res.status(201).json({
            message: 'User registered successfully. Please verify your email.',
            verificationToken
        });
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new CustomError('User not found', 404);
        }

        user.statutVerificationEmail = true;
        user.statut = 'ACTIVE';
        await user.save();

        res.status(200).json({
            message: 'Email verified successfully'
        });
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};