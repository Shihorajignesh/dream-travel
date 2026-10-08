import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user } = useApp();
  const { pathname } = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: pathname }} replace />;
}
