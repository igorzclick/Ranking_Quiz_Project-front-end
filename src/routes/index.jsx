import { SignInView } from '../pages/SignIn/SignIn.view';
import { SignUpView } from '../pages/SignUp/SignUp.view';
import { HomeView } from '../pages/Home/Home.view';
import { createBrowserRouter } from 'react-router';
import { PrivateRouteProvider } from './components/PrivateRouteProvider';
import { CreateAndUpdateThemeView } from '../pages/CreateAndUpdateTheme/Create-and-update-theme.view';
import { ListThemesView } from '../pages/ListThemes/List-themes.view';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <SignInView />,
  },
  {
    path: '/register',
    element: <SignUpView />,
  },
  {
    path: '/',
    element: (
      <PrivateRouteProvider>
        <HomeView />
      </PrivateRouteProvider>
    ),
  },
  {
    path: '/themes',
    element: (
      <PrivateRouteProvider>
        <ListThemesView />
      </PrivateRouteProvider>
    ),
  },
  {
    path: '/themes/create',
    element: (
      <PrivateRouteProvider>
        <CreateAndUpdateThemeView />
      </PrivateRouteProvider>
    ),
  },
  {
    path: '/themes/update/:themeId',
    element: (
      <PrivateRouteProvider>
        <CreateAndUpdateThemeView />
      </PrivateRouteProvider>
    ),
  },
]);
