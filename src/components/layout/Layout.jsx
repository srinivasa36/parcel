import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CartDrawer from '../cart/CartDrawer';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer';
import Header from './Header';
import MobileMenu from './MobileMenu';
import { useUI } from '../../context/UIContext';

export default function Layout() {
  const { pathname } = useLocation();
  const { closeCart, closeMenu } = useUI();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    closeCart();
    closeMenu();
  }, [pathname, closeCart, closeMenu]);

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <MobileMenu />
    </div>
  );
}
