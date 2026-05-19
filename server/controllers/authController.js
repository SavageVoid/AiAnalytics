

const User = require('../models/User');
const jwt = require('jsonwebtoken');


const generateToken = (userId) => {
 return jwt.sign(
 { id: userId },
 process.env.JWT_SECRET,
 { expiresIn: '7d' } 
 );
};


const register = async (req, res) => {
 try {
 const { name, email, password, role } = req.body;

 
 const existing = await User.findOne({ email });
 if (existing) {
 return res.status(400).json({ message: 'Email already registered.' });
 }

 
 const user = await User.create({ name, email, password, role });

 
 const token = generateToken(user._id);
 res.status(201).json({
 message: 'Account created successfully ',
 token,
 user: { id: user._id, name: user.name, email: user.email, role: user.role },
 });
 } catch (error) {
 console.error("Register Error:", error);
 if (error.name === 'ValidationError') {
 const messages = Object.values(error.errors).map((e) => e.message);
 return res.status(400).json({ message: messages.join(', ') });
 }
 res.status(500).json({ message: 'Server error', error: error.message });
 }
};


const login = async (req, res) => {
 try {
 const { email, password } = req.body;

 
 const user = await User.findOne({ email });
 if (!user) {
 return res.status(401).json({ message: 'Invalid email or password.' });
 }

 
 const isMatch = await user.comparePassword(password);
 if (!isMatch) {
 return res.status(401).json({ message: 'Invalid email or password.' });
 }

 
 const token = generateToken(user._id);
 res.status(200).json({
 message: 'Login successful ',
 token,
 user: { id: user._id, name: user.name, email: user.email, role: user.role },
 });
 } catch (error) {
 res.status(500).json({ message: 'Server error', error: error.message });
 }
};


const getMe = async (req, res) => {
 try {
 const user = await User.findById(req.user.id).select('-password');
 res.status(200).json(user);
 } catch (error) {
 res.status(500).json({ message: 'Server error', error: error.message });
 }
};

module.exports = { register, login, getMe };
