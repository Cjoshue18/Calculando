import React from 'react';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { GpaCalculator } from '@/modules/academic/gpa-calculator/ui/GpaCalculator';

export const GpaCalculatorPage: React.FC = () => {
  return (
    <ToolLayout
      category="Académico"
      toolName="Promedio Ponderado por Créditos"
    >
      <GpaCalculator />
    </ToolLayout>
  );
};

export default GpaCalculatorPage;
