// client/src/components/EmployeeList.jsx — High-fidelity Directory with View Switcher & Sliders

import { useState } from 'react';
import api from '../api/axios';

const getScoreClass = (score) => {
  if (score >= 80) return 'score-high';
  if (score >= 50) return 'score-mid';
  return 'score-low';
};

const getBadgeClass = (score) => {
  if (score >= 80) return 'badge-green';
  if (score >= 60) return 'badge-amber';
  return 'badge-red';
};

const getInitials = (name) => {
  return name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'EE';
};

// ─── Individual Employee Card (Grid View) ──────────────────────────────────────
const EmployeeCard = ({ employee, onDelete, onEdit, onAI }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete profile for ${employee.name}?`)) return;
    setDeleting(true);
    try {
      await api.delete(`/employees/${employee._id}`);
      onDelete(employee._id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete employee');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Section */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <div className="avatar-circle">
          {getInitials(employee.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {employee.name}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {employee.email}
          </p>
        </div>
      </div>

      {/* Meta Badges */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <span className="badge badge-blue">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          {employee.department}
        </span>
        <span className="badge badge-purple" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {employee.experience} yrs exp
        </span>
      </div>

      {/* Performance Metrics */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          <span>Performance Score</span>
          <span className={`badge ${getBadgeClass(employee.performanceScore)}`} style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
            {employee.performanceScore}%
          </span>
        </div>
        <div className="score-bar" style={{ height: '8px' }}>
          <div
            className={`score-fill ${getScoreClass(employee.performanceScore)}`}
            style={{ width: `${employee.performanceScore}%` }}
          />
        </div>
      </div>

      {/* Skills Array */}
      {employee.skills?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
          {employee.skills.map((skill, i) => (
            <span key={i} className="skill-tag">{skill}</span>
          ))}
        </div>
      )}

      {/* Action triggers */}
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-success btn-sm" onClick={() => onAI(employee)} style={{ flex: 1 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>Evaluate</span>
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => onEdit(employee)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
          </svg>
        </button>
        <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ─── Individual Employee Row (List View) ──────────────────────────────────────
const EmployeeRow = ({ employee, onDelete, onEdit, onAI }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete profile for ${employee.name}?`)) return;
    setDeleting(true);
    try {
      await api.delete(`/employees/${employee._id}`);
      onDelete(employee._id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete employee');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="list-layout-row">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 2, minWidth: 0 }}>
        <div className="avatar-circle" style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
          {getInitials(employee.name)}
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {employee.name}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {employee.email}
          </p>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <span className="badge badge-blue">
          {employee.department}
        </span>
      </div>

      <div style={{ flex: 1, color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
        {employee.experience} years
      </div>

      <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="score-bar" style={{ width: '80px', height: '6px' }}>
          <div
            className={`score-fill ${getScoreClass(employee.performanceScore)}`}
            style={{ width: `${employee.performanceScore}%` }}
          />
        </div>
        <span className={`badge ${getBadgeClass(employee.performanceScore)}`} style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
          {employee.performanceScore}%
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn btn-success btn-sm" onClick={() => onAI(employee)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => onEdit(employee)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
          </svg>
        </button>
        <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ─── Edit Modal (Now Featuring Sliders with Live Values) ──────────────────────
const EditModal = ({ employee, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    performanceScore: employee.performanceScore,
    department: employee.department,
    skills: employee.skills.join(', '),
    experience: employee.experience,
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/employees/${employee._id}`, {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
      onUpdated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ marginBottom: '24px', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
          Update Profile — {employee.name}
        </h3>

        {/* Department field */}
        <div className="form-group">
          <label className="form-label">Department</label>
          <input className="form-input" type="text"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })} />
        </div>

        {/* Performance Score range slider */}
        <div className="form-group slider-container">
          <div className="slider-header">
            <label className="form-label">Performance Rating</label>
            <span className="slider-value">{form.performanceScore}%</span>
          </div>
          <input className="form-slider" type="range" min="0" max="100"
            value={form.performanceScore}
            onChange={(e) => setForm({ ...form, performanceScore: e.target.value })} />
        </div>

        {/* Experience range slider */}
        <div className="form-group slider-container">
          <div className="slider-header">
            <label className="form-label">Years of Experience</label>
            <span className="slider-value">{form.experience} Years</span>
          </div>
          <input className="form-slider" type="range" min="0" max="40"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })} />
        </div>

        {/* Skills Tag input */}
        <div className="form-group">
          <label className="form-label">Core Skills (comma separated)</label>
          <input className="form-input" type="text"
            value={form.skills}
            placeholder="e.g. React, Mongoose, Node.js"
            onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading} style={{ flex: 1 }}>
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Export Component with List/Grid Toggle ───────────────────────────────
const EmployeeList = ({ employees, loading, onDelete, onRefresh, onAI }) => {
  const [editTarget, setEditTarget] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Syncing directory index...</span>
      </div>
    );
  }

  if (!employees.length) {
    return (
      <div className="empty-state" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
        <div className="empty-icon" style={{ color: 'var(--accent-cyan)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3>No Employee Matches Found</h3>
        <p>Try refining your search queries or add a new record profile.</p>
      </div>
    );
  }

  return (
    <>
      {/* View Switcher Deck */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <div className="view-switcher">
          {/* Grid Button */}
          <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
          {/* List Button */}
          <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid or List dynamic layout */}
      {viewMode === 'grid' ? (
        <div className="grid-3">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp._id}
              employee={emp}
              onDelete={onDelete}
              onEdit={setEditTarget}
              onAI={onAI}
            />
          ))}
        </div>
      ) : (
        <div className="list-layout-container">
          {employees.map((emp) => (
            <EmployeeRow
              key={emp._id}
              employee={emp}
              onDelete={onDelete}
              onEdit={setEditTarget}
              onAI={onAI}
            />
          ))}
        </div>
      )}

      {editTarget && (
        <EditModal
          employee={editTarget}
          onClose={() => setEditTarget(null)}
          onUpdated={onRefresh}
        />
      )}
    </>
  );
};

export default EmployeeList;
