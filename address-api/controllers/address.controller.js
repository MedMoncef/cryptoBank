import Address from '../models/address.model.js';
import CustomError from '../utils/CustomError.js';
import axios from 'axios';

// Create address
export const createAddress = async (req, res, next) => {
    try {
        const { userId, street, city, postalCode } = req.body;

        // Check if userId is provided
        if (!userId) {
            return next(new CustomError('User ID is required', 400));
        }

        // Check if the user exists using the external API
        try {
            const response = await axios.get(`https://api-test.com/api/userExist/${userId}`);
            if (!response.data.exists) {
                return next(new CustomError('User does not exist', 404));
            }
        } catch (error) {
            // Handle API errors (e.g., network issues, invalid response)
            return next(new CustomError('Failed to verify user existence', 500));
        }

        // Create the address
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
        res.status(204).send(); // No content to send back
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