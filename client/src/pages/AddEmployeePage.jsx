

import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';

const AddEmployeePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ paddingTop: '20px', maxWidth: '800px' }}>
      <div className="page-header">
        <h1 className="page-title">Add New Employee</h1>
        <p className="page-subtitle">Register a new employee into the system</p>
      </div>
      <EmployeeForm onSuccess={() => setTimeout(() => navigate('/employees'), 1500)} />
    </div>
  );
};

export default AddEmployeePage;
