import { Navigate } from 'react-router';

export const PrivateRouteProvider = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to={'/login'} />;
  }

  return children;
};
