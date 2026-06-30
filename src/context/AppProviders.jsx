import { AuthProvider } from './AuthContext.jsx';
import { CartProvider } from './CartContext.jsx';
import { AISessionProvider } from './AISessionContext.jsx';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <AISessionProvider>{children}</AISessionProvider>
      </CartProvider>
    </AuthProvider>
  );
}
