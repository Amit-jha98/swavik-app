import { useState, createContext, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from '@/components/luxury/Footer';
import { Navbar } from '@/components/luxury/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AIConcierge } from '@/components/ai-voice/AIConcierge';
import { Account } from '@/pages/Account';
import { AIConsultant } from '@/pages/AIConsultant';
import { Cart } from '@/pages/Cart';
import { Craftsmanship } from '@/pages/Craftsmanship';
import { Heritage } from '@/pages/Heritage';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { ProductDetail } from '@/pages/ProductDetail';
import { Shop } from '@/pages/Shop';
import { TrackOrder } from '@/pages/TrackOrder';
import { Wishlist } from '@/pages/Wishlist';
import { Dashboard } from '@/pages/admin/Dashboard';

export const CinematicContext = createContext(false);

export default function App() {
  const [cinematic, setCinematic] = useState(() => {
    return typeof window !== 'undefined' && !sessionStorage.getItem('swavik.welcomeSeen');
  });

  return (
    <CinematicContext.Provider value={cinematic}>
      <div className="min-h-svh bg-ink-950 text-cream-50">
        {cinematic && (
          <AIConcierge 
            isPopup={true} 
            onComplete={() => {
              setCinematic(false);
              sessionStorage.setItem('swavik.welcomeSeen', 'true');
            }} 
          />
        )}
        <Navbar hidden={cinematic} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collections" element={<Navigate to="/shop" replace />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Cart />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/account" element={<Account />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/heritage" element={<Heritage />} />
          <Route path="/about-heritage" element={<Navigate to="/heritage" replace />} />
          <Route path="/craftsmanship" element={<Craftsmanship />} />
          <Route path="/ai-consultant" element={<AIConsultant />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <FooterWrapper />
      </div>
    </CinematicContext.Provider>
  );
}

function FooterWrapper() {
  const location = useLocation();
  if (location.pathname === '/ai-consultant') {
    return null;
  }
  return <Footer />;
}
