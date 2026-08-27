import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from './ConfirmDialog';

const RocketIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const AddIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const WorkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    setConfirmLogout(false);
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/app/dashboard', icon: <DashboardIcon /> },
    { label: 'My Skills', path: '/app/skills', icon: <AddIcon /> },
    { label: 'Job Match', path: '/app/job-match', icon: <WorkIcon /> },
  ];

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <div className="nav-brand" onClick={() => navigate('/app/dashboard')}>
            <RocketIcon />
            <span>
              Skill<span style={{ color: '#bfdbfe' }}>Verse</span>
            </span>
          </div>

          <nav className="nav-links">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="nav-user">
            <button
              type="button"
              className="nav-user-chip"
              onClick={() => setConfirmLogout(true)}
              title="Account — click to log out"
            >
              <span className="nav-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              <span className="meta">
                <div className="name">{user?.name}</div>
                <div className="email">{user?.email}</div>
              </span>
            </button>
            <button className="btn-icon" onClick={() => setConfirmLogout(true)} title="Logout">
              <LogoutIcon />
            </button>
          </div>
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>

      <ConfirmDialog
        open={confirmLogout}
        title="Log out of SkillVerse?"
        message={`You will be signed out of ${user?.name || 'your account'}. You can log back in anytime.`}
        confirmText="Yes, log out"
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </>
  );
};

export default Navbar;