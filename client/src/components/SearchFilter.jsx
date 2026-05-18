// client/src/components/SearchFilter.jsx — Q1: Search & Filter Section

const DEPARTMENTS = ['', 'Development', 'Design', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales'];

const SearchFilter = ({ filters, onChange, onClear }) => {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>🔍 Search & Filter</h3>
        <button className="btn btn-secondary btn-sm" onClick={onClear}>Clear</button>
      </div>

      <div className="grid-3">
        {/* Name search */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="search-name">Employee Name</label>
          <input
            id="search-name" name="name" type="text"
            className="form-input" placeholder="Search by name..."
            value={filters.name} onChange={handleChange}
          />
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

        {/* Min performance score */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="search-min-score">Min Score</label>
          <input
            id="search-min-score" name="minScore" type="number"
            className="form-input" placeholder="e.g. 70"
            min="0" max="100"
            value={filters.minScore} onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
