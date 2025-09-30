import { Navigate } from 'react-router';
import { Header } from '../../components/Header';

export const PrivateRouteProvider = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to={'/login'} />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
};
