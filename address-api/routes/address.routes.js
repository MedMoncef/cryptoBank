import express from 'express';
import * as addressController from '../controllers/address.controller.js';

const router = express.Router();

// Route to create an address
router.post('/', addressController.createAddress);

// Route to get all addresses
router.get('/addresses', addressController.getAllAddresses);

// Route to get an address by ID
router.get('/:id', addressController.getAddressById);

// Route to delete an address by ID
router.delete('/:id', addressController.deleteAddress);

// Route to update an address by ID (PATCH)
router.patch('/:id', addressController.updateAddress);

export default router;