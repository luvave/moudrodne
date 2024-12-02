import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CreateSaying } from './pages/CreateSaying';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/prislovi', element: <CreateSaying /> },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
