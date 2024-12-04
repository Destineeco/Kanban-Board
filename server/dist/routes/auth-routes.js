import { Router } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the user exists in the database
        const user = await User.findOne({ where: { username } });
        // Find user by username
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' }); // User not found
        }
        // Check if the provided password matches the stored password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' }); // Invalid password
        }
        const secretKey = process.env.JWT_SECRET_KEY || '';
        // Generate JWT token
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        return res.json({ token }); // Send token back as response
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' }); // Handle server errors
    }
};
const router = Router();
// POST /login - Login a user
router.post('/login', login);
export default router;
