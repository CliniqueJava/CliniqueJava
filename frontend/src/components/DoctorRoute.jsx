import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function DoctorRoute({ children }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth/sign-in" replace />;
  if (role !== 'DOCTOR') return <Navigate to="/" replace />;
  return children;
}
