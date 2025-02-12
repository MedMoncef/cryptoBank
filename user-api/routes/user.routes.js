import express from 'express';
import * as userController from '../controllers/user.controller.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/statistics', userController.getUserStatistics);
router.post('/', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);
router.patch('/:id', userController.updateUser);
router.put('/:userId/address/:addressId', userController.assignAddressToUser);

// auth routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/verify-email/:token', authController.verifyEmail);

export default router;