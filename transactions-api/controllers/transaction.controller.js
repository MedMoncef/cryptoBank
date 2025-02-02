import Transaction from '../models/transaction.model.js';
import CustomError from '../utils/CustomError.js';

// CREATE TRANSACTIONS
export const createTransaction = async (req, res, next) => {
    try {
        const transaction = new Transaction(req.body);
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        next(new CustomError(error.message, 400));
    }
};

// GET ALL TRANSACTIONS
export const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

// GET BY ID A TRANSACTION
export const getTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return next(new CustomError('No transaction found with that ID', 404));
        }
        res.status(200).json(transaction);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

// UPDATE TRANSACTION BY ID
export const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!transaction) {
            return next(new CustomError('No transaction found with that ID', 404));
        }
        res.status(200).json(transaction);
    } catch (error) {
        next(new CustomError(error.message, 400));
    }
};

// DELETE TRANSACTION BY ID
export const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return next(new CustomError('No transaction found with that ID', 404));
        }
        res.status(204).json(null);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};