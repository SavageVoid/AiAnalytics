// client/src/components/AIRecommendation.jsx — Premium AI Insights Modal with Pulsing Skeleton Loaders

import { useState } from 'react';
import api from '../api/axios';

const AIRecommendation = ({ preloadEmployee, onClose }) => {
  const [employeeData, setEmployeeData] = useState(
    preloadEmployee
      ? {
          name: preloadEmployee.name,
          department: preloadEmployee.department,
          skills: preloadEmployee.skills.join(', '),
          performanceScore: preloadEmployee.performanceScore,
          experience: preloadEmployee.experience,
        }
      : { name: '', department: '', skills: '', performanceScore: 75, experience: 2 }
  );
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (name, val) => {
    setEmployeeData({ ...employeeData, [name]: Number(val) });
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
          experience: Number(employeeData.experience),
        },
      };

      const res = await api.post('/ai/recommend', payload);
      setRecommendation(res.data.recommendation);
    } catch (err) {
      setError(err.response?.data?.message || 'AI recommendation failed. Check your API connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={preloadEmployee ? "modal-overlay" : ""}>
      <div className="modal-content" style={{ maxWidth: '680px', background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>AI Strategic Evaluation</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
              Generate custom professional development tracks and promotion parameters.
            </p>
          </div>
          {onClose && (
            <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '6px 12px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Close</span>
            </button>
          )}
        </div>

        {/* Dynamic Sliders Form */}
        <div className="grid-2" style={{ marginBottom: '20px' }}>
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

          <div className="form-group slider-container">
            <div className="slider-header">
              <label className="form-label" htmlFor="ai-score">Performance Score</label>
              <span className="slider-value">{employeeData.performanceScore}%</span>
            </div>
            <input id="ai-score" name="performanceScore" type="range" className="form-slider"
              min="0" max="100" value={employeeData.performanceScore}
              onChange={(e) => handleSliderChange('performanceScore', e.target.value)} />
          </div>

          <div className="form-group slider-container">
            <div className="slider-header">
              <label className="form-label" htmlFor="ai-experience">Years of Experience</label>
              <span className="slider-value">{employeeData.experience} Yrs</span>
            </div>
            <input id="ai-experience" name="experience" type="range" className="form-slider"
              min="0" max="40" value={employeeData.experience}
              onChange={(e) => handleSliderChange('experience', e.target.value)} />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
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
          style={{ width: '100%' }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ borderColor: '#030712', borderTopColor: 'transparent' }} />
              <span>Generating AI Assessment...</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Get AI Recommendation</span>
            </>
          )}
        </button>

        {/* Error notification */}
        {error && (
          <div className="alert alert-error" style={{ marginTop: '20px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Skeleton loading preview */}
        {loading && (
          <div className="skeleton-container" style={{ marginTop: '24px', padding: '24px', background: 'rgba(255, 255, 255, 0.01)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
            <div className="skeleton-line header" style={{ marginBottom: '14px' }} />
            <div className="skeleton-line" style={{ width: '90%', marginBottom: '8px' }} />
            <div className="skeleton-line" style={{ width: '95%', marginBottom: '8px' }} />
            <div className="skeleton-line" style={{ width: '80%' }} />
          </div>
        )}

        {/* AI Response Text Box */}
        {recommendation && (
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '12px', color: 'var(--accent-mint)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>AI Evaluation Report: {employeeData.name}</span>
            </h3>
            <div className="ai-response" style={{
              background: 'rgba(52, 211, 153, 0.02)',
              border: '1px solid rgba(52, 211, 153, 0.15)',
              boxShadow: '0 0 30px rgba(52, 211, 153, 0.04)',
              maxHeight: '280px',
              overflowY: 'auto'
            }}>
              {recommendation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;
