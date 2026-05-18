// client/src/pages/DashboardPage.jsx — Home dashboard with stats

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, avgScore: 0, topDept: '-', eligible: 0 });
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, rankRes] = await Promise.all([
          api.get('/employees'),
          api.get('/ai/rank'),
        ]);

        const emps = empRes.data;
        const avgScore = emps.length
          ? Math.round(emps.reduce((s, e) => s + e.performanceScore, 0) / emps.length)
          : 0;

        // Count employees per department
        const deptCount = emps.reduce((acc, e) => {
          acc[e.department] = (acc[e.department] || 0) + 1;
          return acc;
        }, {});
        const topDept = Object.keys(deptCount).sort((a, b) => deptCount[b] - deptCount[a])[0] || '-';

        setStats({
          total:    emps.length,
          avgScore,
          topDept,
          eligible: emps.filter((e) => e.performanceScore >= 80 && e.experience >= 2).length,
        });
        setRanking(rankRes.data.ranked.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /><span>Loading dashboard...</span></div>;

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name} 👋</h1>
        <p className="page-subtitle">Here's your employee analytics overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        {[
          { icon: '👥', value: stats.total,    label: 'Total Employees' },
          { icon: '📊', value: `${stats.avgScore}%`, label: 'Avg Performance' },
          { icon: '🏢', value: stats.topDept,  label: 'Top Department' },
          { icon: '🏆', value: stats.eligible, label: 'Promotion Eligible' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>⚡ Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/employees/add" className="btn btn-primary">➕ Add New Employee</Link>
            <Link to="/employees"     className="btn btn-secondary">👥 View All Employees</Link>
            <Link to="/ai"            className="btn btn-secondary">🤖 Get AI Insights</Link>
          </div>
        </div>

        {/* Top 5 Ranking */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>🏆 Top Performers</h3>
          {ranking.length === 0
            ? <p style={{ color: 'var(--text-muted)' }}>No employees yet.</p>
            : ranking.map((emp) => (
                <div key={emp.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>#{emp.rank}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{emp.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{emp.department}</div>
                    </div>
                  </div>
                  <span className={`badge ${emp.performanceScore >= 80 ? 'badge-green' : 'badge-amber'}`}>
                    {emp.performanceScore}%
                  </span>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
