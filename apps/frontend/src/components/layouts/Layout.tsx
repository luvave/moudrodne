import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div>
      This is the layout
      <main>
        <Outlet />
      </main>
    </div>
  );
};
