// client/src/components/EmployeeList.jsx — Q1: Employee List Page component

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

const EmployeeCard = ({ employee, onDelete, onEdit, onAI }) => {
 const [deleting, setDeleting] = useState(false);

 const handleDelete = async () => {
 if (!window.confirm(`Delete ${employee.name}?`)) return;
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
 <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
 {/* Header */}
 <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
 <div>
 <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>{employee.name}</h3>
 <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{employee.email}</p>
 </div>
 <span className={`badge ${getBadgeClass(employee.performanceScore)}`}>
 {employee.performanceScore}/100
 </span>
 </div>

 {/* Dept & Experience */}
 <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
 <span className="badge badge-blue"> {employee.department}</span>
 <span className="badge badge-purple"> {employee.experience} yrs</span>
 </div>

 {/* Performance Score Bar */}
 <div>
 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
 <span>Performance</span>
 <span>{employee.performanceScore}%</span>
 </div>
 <div className="score-bar">
 <div
 className={`score-fill ${getScoreClass(employee.performanceScore)}`}
 style={{ width: `${employee.performanceScore}%` }}
 />
 </div>
 </div>

 {/* Skills */}
 {employee.skills?.length > 0 && (
 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
 {employee.skills.map((skill, i) => (
 <span key={i} className="skill-tag">{skill}</span>
 ))}
 </div>
 )}

 {/* Actions */}
 <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
 <button className="btn btn-success btn-sm" onClick={() => onAI(employee)}> AI Insight</button>
 <button className="btn btn-secondary btn-sm" onClick={() => onEdit(employee)}> Edit</button>
 <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
 {deleting ? '...' : ' Delete'}
 </button>
 </div>
 </div>
 );
};

// ─── Edit Modal ────────────────────────────────────────────────────────────────
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
 <div style={{
 position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
 display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
 }}>
 <div className="card" style={{ width: '100%', maxWidth: '480px' }}>
 <h3 style={{ marginBottom: '20px', fontWeight: 700 }}> Edit — {employee.name}</h3>

 <div className="form-group">
 <label className="form-label">Performance Score</label>
 <input className="form-input" type="number" min="0" max="100"
 value={form.performanceScore}
 onChange={(e) => setForm({ ...form, performanceScore: e.target.value })} />
 </div>
 <div className="form-group">
 <label className="form-label">Department</label>
 <input className="form-input" type="text"
 value={form.department}
 onChange={(e) => setForm({ ...form, department: e.target.value })} />
 </div>
 <div className="form-group">
 <label className="form-label">Skills (comma separated)</label>
 <input className="form-input" type="text"
 value={form.skills}
 onChange={(e) => setForm({ ...form, skills: e.target.value })} />
 </div>
 <div className="form-group">
 <label className="form-label">Years of Experience</label>
 <input className="form-input" type="number" min="0"
 value={form.experience}
 onChange={(e) => setForm({ ...form, experience: e.target.value })} />
 </div>

 <div style={{ display: 'flex', gap: '10px' }}>
 <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
 {loading ? 'Saving...' : ' Save Changes'}
 </button>
 <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
 </div>
 </div>
 </div>
 );
};

// ─── Main Export ───────────────────────────────────────────────────────────────
const EmployeeList = ({ employees, loading, onDelete, onRefresh, onAI }) => {
 const [editTarget, setEditTarget] = useState(null);

 if (loading) {
 return (
 <div className="loading-screen">
 <div className="spinner" />
 <span>Loading employees...</span>
 </div>
 );
 }

 if (!employees.length) {
 return (
 <div className="empty-state">
 <div className="empty-icon"></div>
 <h3>No employees found</h3>
 <p>Add your first employee using the form above.</p>
 </div>
 );
 }

 return (
 <>
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
