import Currency from '../models/currency.model.js';
import CustomError from '../utils/CustomError.js';

export const createCurrency = async (req, res, next) => {
    try {
        const { name, symbol, type, exchangeRate } = req.body;

        const existingCurrency = await Currency.findOne({ symbol });
        if (existingCurrency) {
            throw new CustomError('Currency already exists', 400);
        }

        const currency = new Currency({
            name,
            symbol: symbol.toUpperCase(),
            type: type.toUpperCase(),
            exchangeRate
        });

        await currency.save();
        res.status(201).json(currency);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const getAllCurrencies = async (req, res, next) => {
    try {
        const currencies = await Currency.find();
        res.status(200).json(currencies);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const getActiveCurrencies = async (req, res, next) => {
    try {
        const currencies = await Currency.find({ isActive: true });
        res.status(200).json(currencies);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const getCurrencyBySymbol = async (req, res, next) => {
    try {
        const currency = await Currency.findOne({ symbol: req.params.symbol.toUpperCase() });
        if (!currency) {
            throw new CustomError('Currency not found', 404);
        }
        res.status(200).json(currency);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const updateCurrency = async (req, res, next) => {
    try {
        const { name, type, exchangeRate } = req.body;
        const currency = await Currency.findOne({ symbol: req.params.symbol.toUpperCase() });
        
        if (!currency) {
            throw new CustomError('Currency not found', 404);
        }

        currency.name = name || currency.name;
        currency.type = type ? type.toUpperCase() : currency.type;
        currency.exchangeRate = exchangeRate || currency.exchangeRate;
        currency.lastUpdated = Date.now();

        await currency.save();
        res.status(200).json(currency);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const deleteCurrency = async (req, res, next) => {
    try {
        const currency = await Currency.findOne({ symbol: req.params.symbol.toUpperCase() });
        if (!currency) {
            throw new CustomError('Currency not found', 404);
        }

        await currency.delete();
        res.status(204).send();
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const toggleCurrencyStatus = async (req, res, next) => {
    try {
        const currency = await Currency.findOne({ symbol: req.params.symbol.toUpperCase() });
        if (!currency) {
            throw new CustomError('Currency not found', 404);
        }

        currency.isActive = !currency.isActive;
        await currency.save();
        res.status(200).json(currency);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const updateExchangeRate = async (req, res, next) => {
    try {
        const { exchangeRate } = req.body;
        const currency = await Currency.findOne({ symbol: req.params.symbol.toUpperCase() });
        
        if (!currency) {
            throw new CustomError('Currency not found', 404);
        }

        currency.exchangeRate = exchangeRate;
        currency.lastUpdated = Date.now();
        await currency.save();
        res.status(200).json(currency);
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};

export const getExchangeRate = async (req, res, next) => {
    try {
        const { fromSymbol, toSymbol } = req.params;
        
        const fromCurrency = await Currency.findOne({ symbol: fromSymbol.toUpperCase() });
        const toCurrency = await Currency.findOne({ symbol: toSymbol.toUpperCase() });
        
        if (!fromCurrency || !toCurrency) {
            throw new CustomError('One or both currencies not found', 404);
        }

        const rate = toCurrency.exchangeRate / fromCurrency.exchangeRate;
        res.status(200).json({
            fromCurrency: fromSymbol.toUpperCase(),
            toCurrency: toSymbol.toUpperCase(),
            rate: rate
        });
    } catch (error) {
        next(new CustomError(error.message, error.status || 400));
    }
};