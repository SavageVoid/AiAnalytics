// server/index.js — Main entry point for the Express server

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors()); // Allow cross-origin requests from React
app.use(express.json()); // Parse incoming JSON request bodies

// ─── Routes ───────────────────────────────────────────────────────────────────
const employeeRoutes = require('./routes/employeeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/employees', employeeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);

// ─── Serve React Frontend (Production) ────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
 console.error(' Server Error:', err.message);
 res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ─── Connect to MongoDB and Start Server ──────────────────────────────────────
mongoose
 .connect(process.env.MONGO_URI)
 .then(() => {
 console.log(' MongoDB Connected');
 app.listen(PORT, () => {
 console.log(` Server running at http://localhost:${PORT}`);
 });
 })
 .catch((err) => {
 console.error(' MongoDB connection failed:', err.message);
 process.exit(1);
 });
