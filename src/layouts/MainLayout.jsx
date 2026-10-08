import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Toaster from '../components/Toaster.jsx';

export default function MainLayout() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-sun-500 focus:px-4 focus:py-2">Skip to content</a>
      <Navbar isHome={pathname === '/'} />
      <main id="main" className={pathname === '/' ? '' : 'pt-16'}><Outlet /></main>
      <Footer />
      <Toaster />
    </>
  );
}
