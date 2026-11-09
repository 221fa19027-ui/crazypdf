import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { AllTools } from '../pages/AllTools';
import { ToolDetailPage } from '../pages/ToolDetailPage';
import { Dashboard } from '../pages/Dashboard';
import { Login } from '../pages/Login';
import { Security } from '../pages/Security';
import { Pricing } from '../pages/Pricing';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { Privacy } from '../pages/Privacy';
import { Terms } from '../pages/Terms';
import { FAQ } from '../pages/FAQ';
import { NotFound } from '../pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tools" element={<AllTools />} />
      <Route path="/tools/:slug" element={<ToolDetailPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/security" element={<Security />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
