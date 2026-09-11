import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Kartu NFC', path: '/dashboard/cards', icon: '📇' },
    { name: 'Statistik', path: '/dashboard/stats', icon: '📊' },
    { name: 'Customer', path: '/dashboard/customers', icon: '👤' },
    { name: 'Pengaturan', path: '/dashboard/settings', icon: '⚙' },
  ];

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.logo}>MARI SYSTEM</h3>
      <div style={styles.menuList}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div 
              key={item.name} 
              onClick={() => navigate(item.path)}
              style={{ ...styles.menuItem, background: isActive ? '#1a73e8' : 'transparent', color: isActive ? '#fff' : '#333' }}
            >
              <span>{item.icon}</span> {item.name}
            </div>
          );
        })}
      </div>
      <div onClick={handleLogout} style={styles.logoutBtn}>
        <span>🚪</span> Logout
      </div>
    </div>
  );
}

const styles = {
  sidebar: { width: '250px', background: '#fff', height: '100vh', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, boxSizing: 'border-box' },
  logo: { padding: '20px', borderBottom: '1px solid #eee', margin: 0, color: '#1a73e8', textAlign: 'center' },
  menuList: { padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 },
  menuItem: { padding: '12px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold', fontSize: '14px', transition: '0.2s' },
  logoutBtn: { padding: '15px 20px', borderTop: '1px solid #eee', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', color: '#c62828', fontWeight: 'bold', fontSize: '14px' }
};