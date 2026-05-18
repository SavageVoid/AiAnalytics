// client/src/components/AIRecommendation.jsx — Q1: AI Recommendation Display Page

import { useState } from 'react';
import api from '../api/axios';

const AIRecommendation = ({ preloadEmployee, onClose }) => {
  const [employeeData, setEmployeeData] = useState(
    preloadEmployee
      ? {
          name:             preloadEmployee.name,
          department:       preloadEmployee.department,
          skills:           preloadEmployee.skills.join(', '),
          performanceScore: preloadEmployee.performanceScore,
          experience:       preloadEmployee.experience,
        }
      : { name: '', department: '', skills: '', performanceScore: '', experience: '' }
  );
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');

  const handleChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const handleGetRecommendation = async () => {
    setLoading(true);
    setError('');
    setRecommendation('');

    try {
      const payload = {
        employeeData: {
          ...employeeData,
          skills: typeof employeeData.skills === 'string'
            ? employeeData.skills.split(',').map((s) => s.trim()).filter(Boolean)
            : employeeData.skills,
          performanceScore: Number(employeeData.performanceScore),
          experience:       Number(employeeData.experience),
        },
      };

      const res = await api.post('/ai/recommend', payload);
      setRecommendation(res.data.recommendation);
    } catch (err) {
      setError(err.response?.data?.message || 'AI recommendation failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={preloadEmployee ? {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 300, padding: '20px',
    } : {}}>
      <div className="card" style={{ width: '100%', maxWidth: preloadEmployee ? '620px' : '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>🤖 AI Recommendation</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
              Get AI-powered promotion and training suggestions
            </p>
          </div>
          {onClose && (
            <button className="btn btn-secondary btn-sm" onClick={onClose}>✕ Close</button>
          )}
        </div>

        {/* Form */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="ai-name">Employee Name</label>
            <input id="ai-name" name="name" type="text" className="form-input"
              placeholder="e.g. Aman Verma" value={employeeData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ai-department">Department</label>
            <input id="ai-department" name="department" type="text" className="form-input"
              placeholder="e.g. Development" value={employeeData.department} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ai-score">Performance Score (0–100)</label>
            <input id="ai-score" name="performanceScore" type="number" className="form-input"
              placeholder="e.g. 85" min="0" max="100" value={employeeData.performanceScore} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ai-experience">Years of Experience</label>
            <input id="ai-experience" name="experience" type="number" className="form-input"
              placeholder="e.g. 3" min="0" value={employeeData.experience} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" htmlFor="ai-skills">Skills (comma separated)</label>
            <input id="ai-skills" name="skills" type="text" className="form-input"
              placeholder="e.g. React, Node.js, MongoDB" value={employeeData.skills} onChange={handleChange} />
          </div>
        </div>

        <button
          id="get-ai-recommendation-btn"
          className="btn btn-primary btn-lg"
          onClick={handleGetRecommendation}
          disabled={loading || !employeeData.name}
          style={{ width: '100%', marginTop: '4px' }}
        >
          {loading
            ? <><span className="spinner" /> Generating AI Recommendation...</>
            : '✨ Get AI Recommendation'}
        </button>

        {/* Error */}
        {error && <div className="alert alert-error" style={{ marginTop: '16px' }}>{error}</div>}

        {/* AI Response */}
        {recommendation && (
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '12px', color: 'var(--accent-cyan)' }}>
              🧠 AI Analysis for {employeeData.name}
            </h3>
            <div className="ai-response">{recommendation}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;
