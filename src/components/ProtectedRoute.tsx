import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/" state={{ from: location }} replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'student' ? '/student/dashboard' : '/professor/dashboard'} replace />;
  }
  return <>{children}</>;
}

