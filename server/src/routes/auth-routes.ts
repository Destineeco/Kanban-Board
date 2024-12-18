import { Router, Request, Response } from 'express';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Login handler
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: User not found' });
    }

    // Compare the password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed: Invalid credentials' });
    }

    // JWT secret key
    const secretKey = process.env.JWT_SECRET_KEY || 'your_default_secret_key';  // It's better to handle default secret more securely

    // Create JWT token with user data (you can include the user's ID or other details)
    const token = jwt.sign(
      { id: user.id, username: user.username }, // Include user ID for better security and identification
      secretKey, 
      { expiresIn: '1h' } // Token expiration time
    );

    return res.json({ token }); // Send the JWT token as a response

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal server error' }); // Server error handling
  }
};

// Define the router for login route
const router = Router();

// POST /login route for user login
router.post('/login', login);

export default router;
