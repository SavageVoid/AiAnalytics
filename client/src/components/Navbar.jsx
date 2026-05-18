// client/src/components/Navbar.jsx — Top navigation bar

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
 const { user, logout } = useAuth();
 const navigate = useNavigate();

 const handleLogout = () => {
 logout();
 navigate('/login');
 };

 return (
 <nav className="navbar">
 <NavLink to="/dashboard" className="navbar-brand">
 <span className="brand-icon"></span>
 AI Analytics
 </NavLink>

 {user && (
 <>
 <div className="navbar-links">
 <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
 <NavLink to="/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Employees</NavLink>
 <NavLink to="/employees/add" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Add Employee</NavLink>
 <NavLink to="/ai" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>AI Insights</NavLink>
 </div>

 <div className="nav-user">
 <span> {user.name}</span>
 <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
 </div>
 </>
 )}
 </nav>
 );
};

export default Navbar;
