import express from 'express';
import * as walletController from '../controllers/wallet.controller.js';

const router = express.Router();

router.post('/', walletController.createWallet);
router.get('/:userId/balance', walletController.getWalletBalance);
router.post('/:userId/deposit', walletController.addFunds);
router.post('/:userId/withdraw', walletController.withdrawFunds);
router.post('/:userId/transfer', walletController.transferFunds);
router.get('/:userId/transactions', walletController.getWalletTransactions);

export default router;