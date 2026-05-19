

import { useState, useEffect, useCallback } from 'react';
import EmployeeList   from '../components/EmployeeList';
import SearchFilter   from '../components/SearchFilter';
import AIRecommendation from '../components/AIRecommendation';
import api from '../api/axios';

const EmployeesPage = () => {
  const [employees,   setEmployees]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filters,     setFilters]     = useState({ name: '', department: '', minScore: '' });
  const [aiTarget,    setAiTarget]    = useState(null);   

  
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const hasFilter = filters.name || filters.department || filters.minScore;
      const params    = new URLSearchParams();
      if (filters.name)       params.set('name',       filters.name);
      if (filters.department) params.set('department',  filters.department);
      if (filters.minScore)   params.set('minScore',    filters.minScore);

      const url = hasFilter ? `/employees/search?${params}` : '/employees';
      const res = await api.get(url);
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  
  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 400);  
    return () => clearTimeout(timer);
  }, [fetchEmployees]);

  const handleDelete = (id) => {
    setEmployees((prev) => prev.filter((e) => e._id !== id));
  };

  const clearFilters = () => {
    setFilters({ name: '', department: '', minScore: '' });
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div className="page-header">
        <h1 className="page-title">Employee Directory</h1>
        <p className="page-subtitle">
          {employees.length} employee{employees.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {}
      <SearchFilter filters={filters} onChange={setFilters} onClear={clearFilters} />

      {}
      <EmployeeList
        employees={employees}
        loading={loading}
        onDelete={handleDelete}
        onRefresh={fetchEmployees}
        onAI={setAiTarget}
      />

      {}
      {aiTarget && (
        <AIRecommendation
          preloadEmployee={aiTarget}
          onClose={() => setAiTarget(null)}
        />
      )}
    </div>
  );
};

export default EmployeesPage;
