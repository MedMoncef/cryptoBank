import express from 'express';
import * as walletController from '../controllers/wallet.controller.js';

const router = express.Router();

router.post('/', walletController.createWallet);
router.get('/:userId/balance', walletController.getWalletBalance);
router.post('/:userId/add-funds', walletController.addFunds);
router.post('/:userId/withdraw-funds', walletController.withdrawFunds);
router.post('/:userId/transactions/:transactionId', walletController.processTransaction);

export default router;