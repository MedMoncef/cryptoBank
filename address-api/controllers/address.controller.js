import Address from '../models/address.model.js';
import CustomError from '../utils/CustomError.js';
import axios from 'axios';

const USERS_SERVICE_URL = 'http://localhost:5000/api/users/api/users';

// Create address
export const createAddress = async (req, res, next) => {
    try {
        const { userId, street, city, postalCode } = req.body;

        if (!userId) {
            return next(new CustomError('User ID is required', 400));
        }

        try {
            const response = await axios.get(`${USERS_SERVICE_URL}/${userId}`);

            if (!response.data.id) {
                return next(new CustomError('User does not exist', 404));
            }
        } catch (error) {
            return next(new CustomError('Failed to verify user existence', 500));
        }

        const address = new Address({
            street,
            city,
            postalCode,
            userId,
        });

        await address.save();
        res.status(201).json(address);
    } catch (error) {
        next(new CustomError(error.message, 400));
    }
};

// Get all addresses
export const getAllAddresses = async (req, res, next) => {
    try {
        const addresses = await Address.find();
        res.status(200).json(addresses);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

// Get address by ID
export const getAddressById = async (req, res, next) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) {
            return next(new CustomError('Address not found', 404));
        }
        res.status(200).json(address);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

// Delete address by ID
export const deleteAddress = async (req, res, next) => {
    try {
        const address = await Address.findByIdAndDelete(req.params.id);
        if (!address) {
            return next(new CustomError('Address not found', 404));
        }
        res.status(204).json({
            success: true, 
            message: 'Address successfully deleted' 
        });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

// Update address by ID (PATCH)
export const updateAddress = async (req, res, next) => {
    try {
        const address = await Address.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!address) {
            return next(new CustomError('Address not found', 404));
        }
        res.status(200).json(address);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};