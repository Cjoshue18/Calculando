import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { FinalGradePage } from '@/pages/FinalGradePage';
import { GpaCalculatorPage } from '@/pages/GpaCalculatorPage';
import { HoursCalculatorPage } from '@/pages/HoursCalculatorPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans transition-colors duration-150">
            <Navbar />
            <div className="flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/calculadora-nota-final" element={<FinalGradePage />} />
                <Route path="/promedio-ponderado-acumulado" element={<GpaCalculatorPage />} />
                <Route path="/sumador-horas-minutos" element={<HoursCalculatorPage />} />
                <Route path="/terminos-condiciones" element={<PrivacyPage />} />
                <Route path="/privacidad" element={<PrivacyPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
