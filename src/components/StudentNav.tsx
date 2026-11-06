import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { DEMO_ANNOUNCEMENTS } from '../data';

export default function StudentNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  if (!user || user.role !== 'student') return null;

  const student = user;
  const unreadCount = DEMO_ANNOUNCEMENTS.filter(a => !a.isRead).length;

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Announcements', path: '/student/announcements' },
    { label: 'Exams', path: '/student/exams' },
    { label: 'Results', path: '/student/results' },
    { label: 'Notes', path: '/student/notes' },
    { label: 'Materials', path: '/student/materials' },
    { label: 'Timetable', path: '/student/timetable' },
    { label: 'Attendance', path: '/student/attendance' },
    { label: 'Complaints', path: '/student/complaints' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 shadow-header" style={{ background: 'linear-gradient(135deg, #500000 0%, #650000 60%, #7a0000 100%)' }}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        <img src="/logo.png" alt="Sir MV" className="h-9 w-9 object-contain rounded" />
        <div className="hidden md:block">
          <span className="text-white font-bold text-sm">SIR MV GROUP OF INSTITUTIONS</span>
          <p className="text-xs" style={{ color: '#FFE59A' }}>Student Academic Portal</p>
        </div>
        <div className="flex-1" />

        {/* Student info */}
        <div className="hidden md:flex flex-col items-end text-xs text-white/80 mr-2">
          <span className="font-semibold text-white">{student.name}</span>
          <span>{(student as any).rollNumber} &nbsp;•&nbsp; Sem {(student as any).semester}</span>
        </div>

        {/* Notification */}
        <button
          className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={() => navigate('/student/announcements')}
        >
          <Bell size={18} className="text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-gold text-institutional-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold" style={{ background: '#E5BD55' }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setProfileOpen(o => !o)}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: '#E5BD55', color: '#500000' }}>
              {student.name.charAt(0)}
            </div>
            <ChevronDown size={14} className="text-white" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-institutional-border w-52 py-2 z-50">
              <div className="px-4 py-2 border-b border-institutional-border">
                <p className="font-semibold text-sm text-institutional-black">{student.name}</p>
                <p className="text-xs text-gray-500">{(student as any).rollNumber}</p>
              </div>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-institutional-bg text-institutional-black">
                <User size={14} /> My Profile
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 text-red-600">
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 text-white" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="bg-black/30 border-t border-white/10 hidden md:flex overflow-x-auto">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              location.pathname === item.path
                ? 'bg-crimson text-white'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            style={location.pathname === item.path ? { background: '#A60000' } : {}}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-maroon-dark border-t border-white/10 flex flex-col" style={{ background: '#500000' }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="px-4 py-3 text-sm text-white/90 hover:bg-white/10 border-b border-white/5"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="px-4 py-3 text-sm text-red-300 hover:bg-white/10 text-left flex items-center gap-2">
            <LogOut size={14} /> Logout
          </button>
        </div>
      )}
    </header>
  );
}

