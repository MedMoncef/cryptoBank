import express from 'express';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.post('/', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);
router.patch('/:id', userController.updateUser);
router.put('/:userId/address/:addressId', userController.assignAddressToUser);

export default router;