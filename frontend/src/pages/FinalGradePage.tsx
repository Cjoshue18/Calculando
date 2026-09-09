import React from 'react';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { FinalGradeCalculator } from '@/modules/academic/final-grade/ui/FinalGradeCalculator';

export const FinalGradePage: React.FC = () => {
  return (
    <ToolLayout
      category="Académico"
      toolName="Calculadora de Nota Final"
    >
      <FinalGradeCalculator />
    </ToolLayout>
  );
};
