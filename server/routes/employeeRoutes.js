// server/routes/employeeRoutes.js — Employee API route definitions (Q2)

const express  = require('express');
const router   = express.Router();
const {
  addEmployee,
  getAllEmployees,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// All employee routes are protected — require valid JWT token
router.post('/',          protect, addEmployee);        // POST   /api/employees
router.get('/',           protect, getAllEmployees);     // GET    /api/employees
router.get('/search',     protect, searchEmployees);    // GET    /api/employees/search?department=...
router.get('/:id',        protect, getEmployeeById);    // GET    /api/employees/:id
router.put('/:id',        protect, updateEmployee);     // PUT    /api/employees/:id
router.delete('/:id',     protect, deleteEmployee);     // DELETE /api/employees/:id

module.exports = router;
