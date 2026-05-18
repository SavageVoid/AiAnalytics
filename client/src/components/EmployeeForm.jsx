// client/src/components/EmployeeForm.jsx — Q1: Employee Registration Form

import { useState } from 'react';
import api from '../api/axios';

const DEPARTMENTS = ['Development', 'Design', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales'];

const EmployeeForm = ({ onSuccess }) => {
 const [formData, setFormData] = useState({
 name: '', email: '', department: '', skills: '', performanceScore: '', experience: '',
 });
 const [loading, setLoading] = useState(false);
 const [message, setMessage] = useState({ text: '', type: '' });

 // Handle all input changes
 const handleChange = (e) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setLoading(true);
 setMessage({ text: '', type: '' });

 try {
 // Convert comma-separated skills string → array
 const payload = {
 ...formData,
 skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
 performanceScore: Number(formData.performanceScore),
 experience: Number(formData.experience),
 };

 await api.post('/employees', payload);
 setMessage({ text: ' Employee added successfully!', type: 'success' });
 setFormData({ name: '', email: '', department: '', skills: '', performanceScore: '', experience: '' });
 if (onSuccess) onSuccess(); // Callback to refresh list
 } catch (err) {
 setMessage({ text: ` ${err.response?.data?.message || 'Failed to add employee'}`, type: 'error' });
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="card">
 <h2 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 700 }}>
 Register New Employee
 </h2>

 {message.text && (
 <div className={`alert alert-${message.type}`}>{message.text}</div>
 )}

 <form onSubmit={handleSubmit}>
 <div className="grid-2">
 {/* Employee Name */}
 <div className="form-group">
 <label className="form-label" htmlFor="name">Full Name</label>
 <input
 id="name" name="name" type="text"
 className="form-input" placeholder="e.g. Aman Verma"
 value={formData.name} onChange={handleChange} required
 />
 </div>

 {/* Email */}
 <div className="form-group">
 <label className="form-label" htmlFor="email">Email Address</label>
 <input
 id="email" name="email" type="email"
 className="form-input" placeholder="e.g. aman@gmail.com"
 value={formData.email} onChange={handleChange} required
 />
 </div>

 {/* Department */}
 <div className="form-group">
 <label className="form-label" htmlFor="department">Department</label>
 <select
 id="department" name="department"
 className="form-select"
 value={formData.department} onChange={handleChange} required
 >
 <option value="">Select Department</option>
 {DEPARTMENTS.map((dept) => (
 <option key={dept} value={dept}>{dept}</option>
 ))}
 </select>
 </div>

 {/* Performance Score */}
 <div className="form-group">
 <label className="form-label" htmlFor="performanceScore">
 Performance Score (0–100)
 </label>
 <input
 id="performanceScore" name="performanceScore" type="number"
 className="form-input" placeholder="e.g. 85"
 min="0" max="100"
 value={formData.performanceScore} onChange={handleChange} required
 />
 </div>

 {/* Experience */}
 <div className="form-group">
 <label className="form-label" htmlFor="experience">Years of Experience</label>
 <input
 id="experience" name="experience" type="number"
 className="form-input" placeholder="e.g. 3"
 min="0"
 value={formData.experience} onChange={handleChange} required
 />
 </div>

 {/* Skills */}
 <div className="form-group">
 <label className="form-label" htmlFor="skills">Skills (comma separated)</label>
 <input
 id="skills" name="skills" type="text"
 className="form-input" placeholder="e.g. React, Node.js, MongoDB"
 value={formData.skills} onChange={handleChange}
 />
 </div>
 </div>

 <button
 id="submit-employee-btn"
 type="submit"
 className="btn btn-primary btn-lg"
 disabled={loading}
 style={{ marginTop: '8px', width: '100%' }}
 >
 {loading ? <><span className="spinner" /> Adding...</> : ' Add Employee'}
 </button>
 </form>
 </div>
 );
};

export default EmployeeForm;
