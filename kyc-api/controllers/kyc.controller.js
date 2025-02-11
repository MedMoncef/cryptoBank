import KYC from '../models/kyc.model.js';
import CustomError from '../utils/CustomError.js';

const USERS_SERVICE_URL = 'http://localhost:5000/api/users/api/users';

// Helper function to verify user existence
const verifyUser = async (userId) => {
    try {
        const response = await axios.get(`${USERS_SERVICE_URL}/${userId}`);
        if (!response.data._id) {
            throw new CustomError('User does not exist', 404);
        }
        return true;
    } catch (error) {
        throw new CustomError('Failed to verify user existence', 500);
    }
};

export const submitDocuments = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { documents } = req.body;

        let kyc = await KYC.findOne({ userId });
        if (kyc) {
            throw new CustomError('KYC already submitted', 400);
        }

        kyc = new KYC({
            userId,
            documents,
            status: 'PENDING'
        });

        await kyc.save();
        res.status(201).json(kyc);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const verifyIdentity = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        const kyc = await KYC.findOne({ userId });
        if (!kyc) {
            throw new CustomError('KYC not found', 404);
        }

        kyc.status = status;
        kyc.verificationDate = new Date();
        await kyc.save();

        res.status(200).json(kyc);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const getDocuments = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const kyc = await KYC.findOne({ userId });
        if (!kyc) {
            throw new CustomError('KYC not found', 404);
        }
        res.status(200).json(kyc);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const updateDocuments = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { documents } = req.body;

        const kyc = await KYC.findOne({ userId });
        if (!kyc) {
            throw new CustomError('KYC not found', 404);
        }

        kyc.documents = documents;
        kyc.status = 'PENDING';
        await kyc.save();

        res.status(200).json(kyc);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};