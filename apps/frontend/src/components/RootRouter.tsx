import { Route, Routes } from 'react-router-dom';
import { Home } from './home/Home';
import { HOME_ROUTE } from '../constants/routes';
import { Layout } from './layouts/Layout';

export const RootRouter = () => {
  return (
    <Routes>
      <Route
        path={HOME_ROUTE}
        element={<Layout />}
      >
        <Route
          index
          element={<Home />}
        />
      </Route>
    </Routes>
  );
};
