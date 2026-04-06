import express from 'express';
import { addUser, getUsers } from '../controllers/adminController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/users')
  .post(protect, adminOnly, addUser)
  .get(protect, adminOnly, getUsers);

export default router;