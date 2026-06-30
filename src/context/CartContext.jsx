import { createContext, useContext, useMemo, useReducer } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: [],
  discount: 0,
  couponCode: ''
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((item) => item.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: 1 }]
      };
    }
    case 'quantity':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantity: Math.max(1, item.quantity + action.delta) } : item
        )
      };
    case 'remove':
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    case 'coupon':
      return { ...state, couponCode: action.code, discount: action.discount };
    case 'clear':
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - state.discount);

  const value = useMemo(
    () => ({
      ...state,
      subtotal,
      total,
      addToCart: (product) => dispatch({ type: 'add', product }),
      updateQuantity: (id, delta) => dispatch({ type: 'quantity', id, delta }),
      removeFromCart: (id) => dispatch({ type: 'remove', id }),
      applyCoupon: (code, discount) => dispatch({ type: 'coupon', code, discount }),
      clearCart: () => dispatch({ type: 'clear' })
    }),
    [state, subtotal, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
