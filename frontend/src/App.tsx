import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AppRoutes } from './routes/AppRoutes';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1029384756-crazypdf-demo.apps.googleusercontent.com';

export const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-800 dark:bg-[#0b0f19] dark:text-slate-100 transition-colors selection:bg-brand-500 selection:text-white">
              <Header />
              <main className="flex-1">
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
