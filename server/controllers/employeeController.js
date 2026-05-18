// server/controllers/employeeController.js — All employee CRUD logic (Q2 + Q3)

const Employee = require('../models/Employee');

// ─── POST /api/employees — Add a new employee ─────────────────────────────────
const addEmployee = async (req, res) => {
 try {
 const { name, email, department, skills, performanceScore, experience } = req.body;

 // Create and save new employee to MongoDB
 const employee = await Employee.create({
 name, email, department, skills, performanceScore, experience,
 });

 res.status(201).json({ message: 'Employee added successfully ', employee });
 } catch (error) {
 // Handle duplicate email (MongoDB error code 11000)
 if (error.code === 11000) {
 return res.status(400).json({ message: 'Email already exists. Use a unique email.' });
 }
 // Handle Mongoose validation errors (e.g., missing performanceScore)
 if (error.name === 'ValidationError') {
 const messages = Object.values(error.errors).map((e) => e.message);
 return res.status(400).json({ message: messages.join(', ') });
 }
 res.status(500).json({ message: 'Server error', error: error.message });
 }
};

// ─── GET /api/employees — Get all employees ───────────────────────────────────
const getAllEmployees = async (req, res) => {
 try {
 const employees = await Employee.find().sort({ createdAt: -1 }); // Newest first
 res.status(200).json(employees);
 } catch (error) {
 res.status(500).json({ message: 'Server error', error: error.message });
 }
};

// ─── GET /api/employees/search?department=Development — Search/filter ─────────
const searchEmployees = async (req, res) => {
 try {
 const { department, name, minScore, maxScore } = req.query;

 const query = {};
 if (department) query.department = { $regex: department, $options: 'i' }; // Case-insensitive
 if (name) query.name = { $regex: name, $options: 'i' };
 if (minScore) query.performanceScore = { ...query.performanceScore, $gte: Number(minScore) };
 if (maxScore) query.performanceScore = { ...query.performanceScore, $lte: Number(maxScore) };

 const employees = await Employee.find(query).sort({ performanceScore: -1 });
 res.status(200).json(employees);
 } catch (error) {
 res.status(500).json({ message: 'Server error', error: error.message });
 }
};

// ─── PUT /api/employees/:id — Update employee (e.g., performance score) ───────
const updateEmployee = async (req, res) => {
 try {
 const employee = await Employee.findByIdAndUpdate(
 req.params.id,
 req.body,
 { new: true, runValidators: true } // Return updated doc & validate
 );
 if (!employee) return res.status(404).json({ message: 'Employee not found' });
 res.status(200).json({ message: 'Employee updated ', employee });
 } catch (error) {
 res.status(500).json({ message: 'Server error', error: error.message });
 }
};

// ─── DELETE /api/employees/:id — Delete employee ──────────────────────────────
const deleteEmployee = async (req, res) => {
 try {
 const employee = await Employee.findByIdAndDelete(req.params.id);
 if (!employee) return res.status(404).json({ message: 'Employee not found' });
 res.status(200).json({ message: 'Employee deleted successfully ' });
 } catch (error) {
 res.status(500).json({ message: 'Server error', error: error.message });
 }
};

// ─── GET /api/employees/:id — Get single employee ────────────────────────────
const getEmployeeById = async (req, res) => {
 try {
 const employee = await Employee.findById(req.params.id);
 if (!employee) return res.status(404).json({ message: 'Employee not found' });
 res.status(200).json(employee);
 } catch (error) {
 res.status(500).json({ message: 'Server error', error: error.message });
 }
};

module.exports = {
 addEmployee,
 getAllEmployees,
 searchEmployees,
 updateEmployee,
 deleteEmployee,
 getEmployeeById,
};
