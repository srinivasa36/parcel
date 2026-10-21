import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CatalogProvider } from './context/CatalogContext';
import { ToastProvider } from './context/ToastContext';
import { UIProvider } from './context/UIContext';
import { WishlistProvider } from './context/WishlistContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CatalogProvider>
            <UIProvider>
              <CartProvider>
                <WishlistProvider>
                  <App />
                </WishlistProvider>
              </CartProvider>
            </UIProvider>
          </CatalogProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
