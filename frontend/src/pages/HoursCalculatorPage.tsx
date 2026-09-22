import React from 'react';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { HoursCalculator } from '@/modules/time/hours-adder/ui/HoursCalculator';

export const HoursCalculatorPage: React.FC = () => {
  return (
    <ToolLayout
      category="Tiempo & Horas"
      toolName="Sumador y Restador de Horas"
    >
      <HoursCalculator />
    </ToolLayout>
  );
};

export default HoursCalculatorPage;
