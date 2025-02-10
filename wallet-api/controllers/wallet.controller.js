import Wallet from '../models/wallet.model.js';
import CustomError from '../utils/CustomError.js';
import axios from 'axios';

const TRANSACTION_SERVICE_URL = 'http://localhost:3003/api/transactions';

export const createWallet = async (req, res, next) => {
    try {
        const { userId, currency } = req.body;
        const wallet = new Wallet({ userId, currency });
        await wallet.save();
        res.status(201).json(wallet);
    } catch (error) {
        next(new CustomError(error.message, 400));
    }
};

export const getWalletBalance = async (req, res, next) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.params.userId });
        if (!wallet) {
            throw new CustomError('Wallet not found', 404);
        }
        res.status(200).json({ balance: wallet.balance, currency: wallet.currency });
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const addFunds = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const wallet = await Wallet.findOne({ userId: req.params.userId });
        
        if (!wallet) {
            throw new CustomError('Wallet not found', 404);
        }

        wallet.balance += amount;
        await wallet.save();

        // Create transaction record
        await axios.post(TRANSACTION_SERVICE_URL, {
            walletId: wallet.id,
            amount,
            type: 'DEPOSIT',
            status: 'COMPLETED'
        });

        res.status(200).json(wallet);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const withdrawFunds = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const wallet = await Wallet.findOne({ userId: req.params.userId });
        
        if (!wallet) {
            throw new CustomError('Wallet not found', 404);
        }

        if (wallet.balance < amount) {
            throw new CustomError('Insufficient funds', 400);
        }

        wallet.balance -= amount;
        await wallet.save();

        // Create transaction record
        await axios.post(TRANSACTION_SERVICE_URL, {
            walletId: wallet.id,
            amount: -amount,
            type: 'WITHDRAWAL',
            status: 'COMPLETED'
        });

        res.status(200).json(wallet);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const processTransaction = async (req, res, next) => {
    try {
        const { transactionId } = req.params;
        const { amount, type } = req.body;
        
        const wallet = await Wallet.findOne({ userId: req.params.userId });
        if (!wallet) {
            throw new CustomError('Wallet not found', 404);
        }

        if (type === 'DEBIT' && wallet.balance < amount) {
            throw new CustomError('Insufficient funds', 400);
        }

        wallet.balance += type === 'CREDIT' ? amount : -amount;
        await wallet.save();

        // Update transaction status
        await axios.patch(`${TRANSACTION_SERVICE_URL}/${transactionId}`, {
            status: 'COMPLETED'
        });

        res.status(200).json(wallet);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};