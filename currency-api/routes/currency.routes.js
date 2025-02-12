import express from 'express';
import * as currencyController from '../controllers/currency.controller.js';

const router = express.Router();

// Public routes
router.get('/', currencyController.getAllCurrencies);
router.get('/active', currencyController.getActiveCurrencies);
router.get('/:symbol', currencyController.getCurrencyBySymbol);
router.get('/exchange-rate/:fromSymbol/:toSymbol', currencyController.getExchangeRate);

// Temporarily unprotected routes
router.post('/', currencyController.createCurrency);
router.put('/:symbol', currencyController.updateCurrency);
router.delete('/:symbol', currencyController.deleteCurrency);
router.patch('/:symbol/toggle-status', currencyController.toggleCurrencyStatus);
router.put('/:symbol/exchange-rate', currencyController.updateExchangeRate);

/* Protected routes for later use
router.post('/', [authenticateToken, isAdmin], currencyController.createCurrency);
router.put('/:symbol', [authenticateToken, isAdmin], currencyController.updateCurrency);
router.delete('/:symbol', [authenticateToken, isAdmin], currencyController.deleteCurrency);
router.patch('/:symbol/toggle-status', [authenticateToken, isAdmin], currencyController.toggleCurrencyStatus);
router.put('/:symbol/exchange-rate', [authenticateToken, isAdmin], currencyController.updateExchangeRate);
*/

export default router;