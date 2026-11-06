import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function ProfessorNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user || user.role !== 'professor') return null;
  const prof = user;

  const navItems = [
    { label: 'Dashboard', path: '/professor/dashboard' },
    { label: 'Announcements', path: '/professor/announcements' },
    { label: 'Live Exams', path: '/professor/exams' },
    { label: 'Question Bank', path: '/professor/questions' },
    { label: 'Notes Upload', path: '/professor/notes' },
    { label: 'Materials Upload', path: '/professor/materials' },
    { label: 'Student Results', path: '/professor/results' },
    { label: 'Attendance', path: '/professor/attendance' },
    { label: 'Timetable', path: '/professor/timetable' },
    { label: 'Feedback', path: '/professor/feedback' },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="sticky top-0 z-50 shadow-header" style={{ background: 'linear-gradient(135deg, #343434 0%, #1a1a1a 100%)' }}>
      <div className="flex items-center gap-3 px-4 py-2.5">
        <img src="/logo.png" alt="Sir MV" className="h-9 w-9 object-contain rounded" />
        <div className="hidden md:block">
          <span className="text-white font-bold text-sm">SIR MV GROUP OF INSTITUTIONS</span>
          <p className="text-xs" style={{ color: '#FFE59A' }}>Faculty Academic Portal</p>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex flex-col items-end text-xs text-white/80 mr-2">
          <span className="font-semibold text-white">{prof.name}</span>
          <span>{(prof as any).designation} &nbsp;•&nbsp; {(prof as any).department}</span>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: '#E5BD55', color: '#500000' }}>
          {prof.name.charAt(0)}
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors">
          <LogOut size={14} /> Logout
        </button>
        <button className="md:hidden p-2 text-white" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <nav className="bg-black/30 border-t border-white/10 hidden md:flex overflow-x-auto">
        {navItems.map(item => (
          <Link key={item.path} to={item.path}
            className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              location.pathname === item.path ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            style={location.pathname === item.path ? { background: '#A60000' } : {}}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {menuOpen && (
        <div className="md:hidden bg-institutional-darkgrey border-t border-white/10 flex flex-col" style={{ background: '#343434' }}>
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className="px-4 py-3 text-sm text-white/90 hover:bg-white/10 border-b border-white/5" onClick={() => setMenuOpen(false)}>{item.label}</Link>
          ))}
          <button onClick={handleLogout} className="px-4 py-3 text-sm text-red-300 hover:bg-white/10 text-left flex items-center gap-2"><LogOut size={14} /> Logout</button>
        </div>
      )}
    </header>
  );
}

