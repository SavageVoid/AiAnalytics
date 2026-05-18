// client/src/components/EmployeeForm.jsx — High-fidelity Employee Form with Sliders

import { useState } from 'react';
import api from '../api/axios';

const DEPARTMENTS = ['Development', 'Design', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales'];

const EmployeeForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: 75,
    experience: 2,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Handle standard changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle slider changes explicitly
  const handleSliderChange = (name, val) => {
    setFormData({ ...formData, [name]: Number(val) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience),
      };

      await api.post('/employees', payload);
      setMessage({ text: 'Employee profile mapped successfully!', type: 'success' });
      setFormData({
        name: '',
        email: '',
        department: '',
        skills: '',
        performanceScore: 75,
        experience: 2,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to register employee', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
        Register New Profile
      </h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          <span>{message.text}</span>
        </div>
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

          {/* Skills */}
          <div className="form-group">
            <label className="form-label" htmlFor="skills">Core Skills (comma separated)</label>
            <input
              id="skills" name="skills" type="text"
              className="form-input" placeholder="e.g. React, Node.js, MongoDB"
              value={formData.skills} onChange={handleChange}
            />
          </div>

          {/* Performance Score range slider */}
          <div className="form-group slider-container">
            <div className="slider-header">
              <label className="form-label" htmlFor="performanceScore">Performance Score</label>
              <span className="slider-value">{formData.performanceScore}%</span>
            </div>
            <input
              id="performanceScore" name="performanceScore" type="range"
              className="form-slider" min="0" max="100"
              value={formData.performanceScore}
              onChange={(e) => handleSliderChange('performanceScore', e.target.value)}
            />
          </div>

          {/* Experience range slider */}
          <div className="form-group slider-container">
            <div className="slider-header">
              <label className="form-label" htmlFor="experience">Years of Experience</label>
              <span className="slider-value">{formData.experience} Years</span>
            </div>
            <input
              id="experience" name="experience" type="range"
              className="form-slider" min="0" max="40"
              value={formData.experience}
              onChange={(e) => handleSliderChange('experience', e.target.value)}
            />
          </div>
        </div>

        <button
          id="submit-employee-btn"
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          style={{ marginTop: '20px', width: '100%' }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ borderColor: '#030712', borderTopColor: 'transparent' }} />
              <span>Mapping Profile...</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Employee</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
