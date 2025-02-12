import Wallet from '../models/wallet.model.js';
import CustomError from '../utils/CustomError.js';
import axios from 'axios';

const TRANSACTION_SERVICE_URL = 'http://localhost:5000/api/transactions/api/transactions';
const USERS_SERVICE_URL = 'http://localhost:5000/api/users/api/users';
const CURRENCY_SERVICE_URL = 'http://localhost:5000/api/currencies/api/currencies';

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

const verifyCurrency = async (symbol) => {
    try {
        const response = await axios.get(`${CURRENCY_SERVICE_URL}/${symbol}`);
        if (!response.data._id) {
            throw new CustomError('Currency does not exist', 404);
        }
        return response.data;
    } catch (error) {
        throw new CustomError('Failed to verify currency existence', 500);
    }
};

export const createWallet = async (req, res, next) => {
    try {
        const { userId, currency } = req.body;
        
        // Verify user exists
        await verifyUser(userId);

        // Verify currency exists
        await verifyCurrency(currency);

        // Check if wallet already exists for this user
        const existingWallet = await Wallet.findOne({ userId });
        if (existingWallet) {
            throw new CustomError('Wallet already exists for this user', 400);
        }

        const wallet = new Wallet({ userId, currency });
        await wallet.save();
        res.status(201).json(wallet);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const getExchangeRate = async (req, res, next) => {
    try {
        const { fromCurrency, toCurrency } = req.params;
        const response = await axios.get(`${CURRENCY_SERVICE_URL}/exchange-rate/${fromCurrency}/${toCurrency}`);
        res.status(200).json(response.data);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const getWalletBalance = async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        // Verify user exists
        await verifyUser(userId);

        const wallet = await Wallet.findOne({ userId });
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
        const { userId } = req.params;
        const { amount, currency: sourceCurrency } = req.body;
        
        // Verify user exists
        await verifyUser(userId);

        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            throw new CustomError('Wallet not found', 404);
        }

        let finalAmount = amount;
        // If source currency is different from wallet currency, convert the amount
        if (sourceCurrency !== wallet.currency) {
            const exchangeRate = await axios.get(
                `${CURRENCY_SERVICE_URL}/exchange-rate/${sourceCurrency}/${wallet.currency}`
            );
            finalAmount = amount * exchangeRate.data.rate;
        }

        // Create transaction record
        const transactionResponse = await axios.post(TRANSACTION_SERVICE_URL, {
            sender: 'SYSTEM',
            receiver: userId,
            amount: finalAmount,
            walletId: wallet._id,
            type: 'DEPOSIT',
            status: 'PENDING',
            sourceCurrency,
            targetCurrency: wallet.currency
        });

        try {
            // Update wallet balance
            wallet.balance += Number(finalAmount);
            await wallet.save();

            // Update transaction status to completed
            await axios.put(`${TRANSACTION_SERVICE_URL}/${transactionResponse.data._id}`, {
                status: 'COMPLETED'
            });

            res.status(200).json(wallet);
        } catch (error) {
            // If wallet update fails, mark transaction as failed
            await axios.put(`${TRANSACTION_SERVICE_URL}/${transactionResponse.data._id}`, {
                status: 'FAILED'
            });
            throw error;
        }
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const withdrawFunds = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { amount } = req.body;
        
        // Verify user exists
        await verifyUser(userId);

        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            throw new CustomError('Wallet not found', 404);
        }

        if (wallet.balance < amount) {
            throw new CustomError('Insufficient funds', 400);
        }

        // Create transaction record
        const transactionResponse = await axios.post(TRANSACTION_SERVICE_URL, {
            sender: userId,
            receiver: 'SYSTEM',
            amount: amount,
            walletId: wallet._id,
            type: 'WITHDRAWAL',
            status: 'PENDING'
        });

        try {
            // Update wallet balance
            wallet.balance -= Number(amount);
            await wallet.save();

            // Update transaction status to completed
            await axios.put(`${TRANSACTION_SERVICE_URL}/${transactionResponse.data._id}`, {
                status: 'COMPLETED'
            });

            res.status(200).json(wallet);
        } catch (error) {
            // If wallet update fails, mark transaction as failed
            await axios.put(`${TRANSACTION_SERVICE_URL}/${transactionResponse.data._id}`, {
                status: 'FAILED'
            });
            throw error;
        }
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const transferFunds = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { receiverId, amount } = req.body;
        
        // Verify both users exist
        await verifyUser(userId);
        await verifyUser(receiverId);

        // Get sender's wallet
        const senderWallet = await Wallet.findOne({ userId });
        if (!senderWallet) {
            throw new CustomError('Sender wallet not found', 404);
        }

        // Get receiver's wallet
        const receiverWallet = await Wallet.findOne({ userId: receiverId });
        if (!receiverWallet) {
            throw new CustomError('Receiver wallet not found', 404);
        }

        if (senderWallet.balance < amount) {
            throw new CustomError('Insufficient funds', 400);
        }

        // Create transaction record
        const transactionResponse = await axios.post(TRANSACTION_SERVICE_URL, {
            sender: userId,
            receiver: receiverId,
            amount: amount,
            walletId: senderWallet._id,
            type: 'TRANSFER',
            status: 'PENDING'
        });

        try {
            // Update sender wallet balance
            senderWallet.balance -= Number(amount);
            await senderWallet.save();

            // Update receiver wallet balance
            receiverWallet.balance += Number(amount);
            await receiverWallet.save();

            // Update transaction status to completed
            await axios.put(`${TRANSACTION_SERVICE_URL}/${transactionResponse.data._id}`, {
                status: 'COMPLETED'
            });

            res.status(200).json({
                senderWallet,
                receiverWallet,
                transaction: transactionResponse.data
            });
        } catch (error) {
            // If wallet update fails, mark transaction as failed
            await axios.put(`${TRANSACTION_SERVICE_URL}/${transactionResponse.data._id}`, {
                status: 'FAILED'
            });
            throw error;
        }
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const getWalletTransactions = async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        // Verify user exists
        await verifyUser(userId);

        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            throw new CustomError('Wallet not found', 404);
        }

        const transactions = await axios.get(`${TRANSACTION_SERVICE_URL}?walletId=${wallet._id}`);
        res.status(200).json(transactions.data);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};