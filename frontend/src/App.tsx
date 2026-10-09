import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { usePageTracking } from '@/core/analytics/usePageTracking';

// Direct import for HomePage to ensure zero FCP delay
import { HomePage } from '@/pages/HomePage';

// Lazy loaded tool & static pages for optimal code splitting & Core Web Vitals
const FinalGradePage = lazy(() => import('@/pages/FinalGradePage'));
const GpaCalculatorPage = lazy(() => import('@/pages/GpaCalculatorPage'));
const HoursCalculatorPage = lazy(() => import('@/pages/HoursCalculatorPage'));
const IgvCalculatorPage = lazy(() => import('@/pages/IgvCalculatorPage'));
const TeaCalculatorPage = lazy(() => import('@/pages/TeaCalculatorPage'));
const RentaQuintaPage = lazy(() => import('@/pages/RentaQuintaPage'));
const GpaConverterPage = lazy(() => import('@/pages/GpaConverterPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const PageFallback: React.FC = () => (
  <div className="flex-1 flex items-center justify-center py-24">
    <div className="w-7 h-7 border-2 border-slate-300 border-t-[#234968] dark:border-zinc-700 dark:border-t-[#5d95b3] rounded-full animate-spin" />
  </div>
);

const AppContent: React.FC = () => {
  usePageTracking();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans transition-colors duration-150">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calculadora-nota-final" element={<FinalGradePage />} />
            <Route path="/promedio-ponderado-acumulado" element={<GpaCalculatorPage />} />
            <Route path="/sumador-horas-minutos" element={<HoursCalculatorPage />} />
            <Route path="/calculadora-igv-detracciones" element={<IgvCalculatorPage />} />
            <Route path="/calculadora-tea-tcea" element={<TeaCalculatorPage />} />
            <Route path="/calculadora-renta-quinta-categoria" element={<RentaQuintaPage />} />
            <Route path="/conversor-notas-gpa-vigesimal" element={<GpaConverterPage />} />
            <Route path="/sobre-nosotros" element={<AboutPage />} />
            <Route path="/terminos-condiciones" element={<TermsPage />} />
            <Route path="/privacidad" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
