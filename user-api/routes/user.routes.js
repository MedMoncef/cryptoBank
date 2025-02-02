import express from 'express';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.post('/', userController.createUser);
router.put('/:userId/address/:addressId', userController.assignAddressToUser);
router.get('/users', userController.getAllUsers);

export default router;