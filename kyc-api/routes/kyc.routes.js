import express from 'express';
import * as kycController from '../controllers/kyc.controller.js';

const router = express.Router();

router.post('/:userId/documents', kycController.submitDocuments);
router.patch('/:userId/verify', kycController.verifyIdentity);
router.get('/:userId/documents', kycController.getDocuments);
router.put('/:userId/documents', kycController.updateDocuments);

export default router;