import { SignInView } from '../pages/SignIn/SignIn.view';
import { SignUpView } from '../pages/SignUp/SignUp.view';
import { createBrowserRouter } from 'react-router';
import { PrivateRouteProvider } from './components/PrivateRouteProvider';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRouteProvider>
        <h1>Home</h1>
      </PrivateRouteProvider>
    ),
  },
  {
    path: '/login',
    element: <SignInView />,
  },
  {
    path: '/register',
    element: <SignUpView />,
  },
]);
