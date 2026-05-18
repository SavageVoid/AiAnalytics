// server/models/Employee.js — Mongoose schema for Employee

const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,                 // No duplicate emails (Q3: duplicate email → error)
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    skills: {
      type: [String],              // Array of skill strings
      default: [],
    },
    performanceScore: {
      type: Number,
      required: [true, 'Performance score is required'],   // Q3: missing score → validation error
      min: [0, 'Score cannot be less than 0'],
      max: [100, 'Score cannot exceed 100'],
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
  },
  {
    timestamps: true,              // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Employee', employeeSchema);
