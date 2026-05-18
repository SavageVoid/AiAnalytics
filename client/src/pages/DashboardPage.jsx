// client/src/pages/DashboardPage.jsx — High-fidelity Dashboard with Visual Metrics

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CircularProgress = ({ score }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="circular-progress">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle
          className="bg-circle"
          r={radius}
          cx="45"
          cy="45"
        />
        <circle
          className="val-circle"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={radius}
          cx="45"
          cy="45"
        />
      </svg>
      <span className="circular-val">{score}%</span>
    </div>
  );
};

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

        const deptCount = emps.reduce((acc, e) => {
          acc[e.department] = (acc[e.department] || 0) + 1;
          return acc;
        }, {});
        const topDept = Object.keys(deptCount).sort((a, b) => deptCount[b] - deptCount[a])[0] || '-';

        setStats({
          total: emps.length,
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

  // Generate initials for employee avatar
  const getInitials = (name) => {
    return name
      ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
      : 'EE';
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Syncing employee records...</span>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1 className="page-title">Welcome Back, {user?.name}</h1>
        <p className="page-subtitle">Here's your employee analytics overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        {/* Total Employees */}
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-cyan)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Employees</div>
          </div>
        </div>

        {/* Avg Performance */}
        <div className="stat-card">
          <div style={{ marginRight: '12px' }}>
            <CircularProgress score={stats.avgScore} />
          </div>
          <div>
            <div className="stat-label" style={{ marginTop: '4px' }}>Avg Performance</div>
          </div>
        </div>

        {/* Top Department */}
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-mint)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: stats.topDept.length > 12 ? '1.5rem' : '2rem' }}>{stats.topDept}</div>
            <div className="stat-label">Top Department</div>
          </div>
        </div>

        {/* Promotion Eligible */}
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-amber)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
          </div>
          <div>
            <div className="stat-value">{stats.eligible}</div>
            <div className="stat-label">Promotion Eligible</div>
          </div>
        </div>
      </div>

      {/* Asymmetrical Layout Grid */}
      <div className="grid-asym-2">
        {/* Top Performers (Larger Panel) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Top Performers</h3>
            <span className="badge badge-green">Live Leaderboard</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            {ranking.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                No performance records mapped yet.
              </div>
            ) : (
              ranking.map((emp) => (
                <div key={emp.name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'var(--transition)',
                }}
                className="leaderboard-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Rank Badge */}
                    <span style={{
                      fontWeight: 900,
                      fontSize: '1.2rem',
                      color: emp.rank === 1 ? 'var(--accent-amber)' : emp.rank === 2 ? '#94a3b8' : '#b45309',
                      minWidth: '24px'
                    }}>
                      #{emp.rank}
                    </span>

                    {/* Initials Avatar */}
                    <div className="avatar-circle" style={{
                      width: '38px', height: '38px', fontSize: '0.85rem',
                      background: emp.rank === 1 ? 'var(--gradient-glow)' : 'rgba(2, 132, 199, 0.2)',
                      color: emp.rank === 1 ? '#030712' : 'var(--accent-cyan)',
                      border: '1px solid var(--border)'
                    }}>
                      {getInitials(emp.name)}
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{emp.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>{emp.department}</div>
                    </div>
                  </div>

                  <span className={`badge ${emp.performanceScore >= 80 ? 'badge-green' : 'badge-amber'}`}>
                    {emp.performanceScore}% Score
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions (Smaller Sidebar Card) */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Command Center</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/employees/add" className="btn btn-primary" style={{ width: '100%' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add New Profile</span>
            </Link>
            
            <Link to="/employees" className="btn btn-secondary" style={{ width: '100%' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="17" y1="8" x2="21" y2="12" />
                <line x1="21" y1="12" x2="17" y2="16" />
              </svg>
              <span>Manage Directory</span>
            </Link>
            
            <Link to="/ai" className="btn btn-secondary" style={{ width: '100%' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span>Evaluate Insights</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
