import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Provider } from './components/ui/provider';
import { Toaster } from './components/ui/toaster';
import { Container } from '@chakra-ui/react';

function App() {
  return (
    <Provider>
      <Toaster />
      <Container>
        <RouterProvider router={router} />
      </Container>
    </Provider>
  );
}

export default App;
