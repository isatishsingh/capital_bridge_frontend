import { Outlet } from 'react-router-dom';
import { Header } from '../components/navigation/Header';
import { Footer } from '../components/navigation/Footer';

export const AppLayout = () => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.08),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#f5f7fb_100%)]">
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);
