

const Employee = require('../models/Employee');


const addEmployee = async (req, res) => {
 try {
 const { name, email, department, skills, performanceScore, experience } = req.body;

 
 const employee = await Employee.create({
 name, email, department, skills, performanceScore, experience,
 });

 res.status(201).json({ message: 'Employee added successfully ', employee });
 } catch (error) {
 
 if (error.code === 11000) {
 return res.status(400).json({ message: 'Email already exists. Use a unique email.' });
 }
 
 if (error.name === 'ValidationError') {
 const messages = Object.values(error.errors).map((e) => e.message);
 return res.status(400).json({ message: messages.join(', ') });
 }
 res.status(500).json({ message: 'Server error', error: error.message });
 }
};


const getAllEmployees = async (req, res) => {
 try {
 const employees = await Employee.find().sort({ createdAt: -1 }); 
 res.status(200).json(employees);
 } catch (error) {
 res.status(500).json({ message: 'Server error', error: error.message });
 }
};


const searchEmployees = async (req, res) => {
 try {
 const { department, name, minScore, maxScore } = req.query;

 const query = {};
 if (department) query.department = { $regex: department, $options: 'i' }; 
 if (name) query.name = { $regex: name, $options: 'i' };
 if (minScore) query.performanceScore = { ...query.performanceScore, $gte: Number(minScore) };
 if (maxScore) query.performanceScore = { ...query.performanceScore, $lte: Number(maxScore) };

 const employees = await Employee.find(query).sort({ performanceScore: -1 });
 res.status(200).json(employees);
 } catch (error) {
 res.status(500).json({ message: 'Server error', error: error.message });
 }
};


const updateEmployee = async (req, res) => {
 try {
 const employee = await Employee.findByIdAndUpdate(
 req.params.id,
 req.body,
 { new: true, runValidators: true } 
 );
 if (!employee) return res.status(404).json({ message: 'Employee not found' });
 res.status(200).json({ message: 'Employee updated ', employee });
 } catch (error) {
 res.status(500).json({ message: 'Server error', error: error.message });
 }
};


const deleteEmployee = async (req, res) => {
 try {
 const employee = await Employee.findByIdAndDelete(req.params.id);
 if (!employee) return res.status(404).json({ message: 'Employee not found' });
 res.status(200).json({ message: 'Employee deleted successfully ' });
 } catch (error) {
 res.status(500).json({ message: 'Server error', error: error.message });
 }
};


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
