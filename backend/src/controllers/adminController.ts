import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Student from '../models/Student';

// @desc    Admin add user (student or company)
// @route   POST /api/admin/users
// @access  Private/Admin
export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    if (role !== 'student' && role !== 'company') {
      res.status(400).json({ message: 'Role can only be student or company' });
      return;
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // If student, create a corresponding student profile
    if (role === 'student') {
      await Student.create({
        userId: user._id,
        skills: [],
      });
    }

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};