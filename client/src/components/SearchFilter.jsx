// client/src/components/SearchFilter.jsx — High-fidelity Search & Filter Deck

const DEPARTMENTS = ['', 'Development', 'Design', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales'];

const SearchFilter = ({ filters, onChange, onClear }) => {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (val) => {
    onChange({ ...filters, minScore: val });
  };

  return (
    <div className="card" style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Search & Filter Index</span>
        </h3>
        
        <button className="btn btn-secondary btn-sm" onClick={onClear}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid-3" style={{ alignItems: 'flex-end' }}>
        {/* Name search */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="search-name">Employee Name</label>
          <div style={{ position: 'relative' }}>
            <input
              id="search-name" name="name" type="text"
              className="form-input" placeholder="Search by name..."
              value={filters.name} onChange={handleChange}
              style={{ paddingLeft: '38px' }}
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Department filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="search-department">Department</label>
          <select
            id="search-department" name="department"
            className="form-select"
            value={filters.department} onChange={handleChange}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d || 'All Departments'}</option>
            ))}
          </select>
        </div>

        {/* Min performance score range slider */}
        <div className="form-group slider-container" style={{ marginBottom: 0 }}>
          <div className="slider-header">
            <label className="form-label" htmlFor="search-min-score">Minimum Score</label>
            <span className="slider-value">{filters.minScore || 0}%</span>
          </div>
          <input
            id="search-min-score" name="minScore" type="range"
            className="form-slider" min="0" max="100"
            value={filters.minScore || 0}
            onChange={(e) => handleSliderChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
