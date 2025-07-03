import type { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface RequireAuthProps {
  role: 'Cliente' | 'Produtor';
}

export const RequireAuth: FC<RequireAuthProps> = ({ role }) => {
  const { token, loading, role: userRole } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!token || userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
