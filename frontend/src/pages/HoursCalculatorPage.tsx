import React from 'react';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { HoursCalculator } from '@/modules/time/hours-adder/ui/HoursCalculator';
import { ToolEducationalSection } from '@/components/ui/ToolEducationalSection';
import { FAQItem } from '@/components/seo/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

const hoursFaqsEs: FAQItem[] = [
  {
    question: '¿Por qué 7 horas y 30 minutos no equivale a 7.30 horas decimales?',
    answer: 'Porque el tiempo opera en base 60 (sexagesimal) y no en base 10 (decimal). 30 minutos representan la mitad de una hora (30 / 60 = 0.50). Por lo tanto, 7 horas y 30 minutos equivalen exactamente a 7.50 horas decimales. Multiplicar 7.30 en una planilla de sueldos genera un déficit salarial para el trabajador.',
  },
  {
    question: '¿Cómo se convierten los minutos a horas decimales para la planilla?',
    answer: 'La fórmula matemática es directa: Horas Decimales = Horas + (Minutos / 60) + (Segundos / 3600). Por ejemplo, 8 horas y 15 minutos = 8 + (15 / 60) = 8.25 horas decimales.',
  },
  {
    question: '¿Cómo se calculan las horas extras según la ley laboral peruana?',
    answer: 'Bajo el D.S. 007-2002-TR (TUO de la Ley de Jornada de Trabajo), el valor de la hora ordinaria se obtiene dividiendo el sueldo mensual entre 30 días y luego entre 8 horas. Las dos primeras horas extras del día se pagan con un recargo del 25%, y de la tercera hora extra en adelante con un recargo del 35%.',
  },
  {
    question: '¿Cómo calcula la herramienta si el turno cruza la medianoche?',
    answer: 'En el modo de Horas de Reloj, el cálculo aplica aritmética modular en base 24: (Hora de Inicio + Duración) mod 24 horas. Si entras a trabajar a las 22:00 horas y laboras 8 horas, la herramienta proyecta con precisión tu salida a las 06:00 AM del día siguiente.',
  },
];

const hoursFaqsEn: FAQItem[] = [
  {
    question: 'Why is 7 hours and 30 minutes not equal to 7.30 decimal hours?',
    answer: 'Time is counted in base-60 (sexagesimal), whereas money and payroll software operate in base-10 (decimal). 30 minutes is 30/60 = 0.50 hours. Therefore, 7 hours and 30 minutes is 7.50 decimal hours.',
  },
  {
    question: 'How do you convert minutes into decimal hours for billing or timesheets?',
    answer: 'Divide the number of minutes by 60 and add the result to the full hours. For instance, 4 hours and 45 minutes = 4 + (45 / 60) = 4.75 decimal hours.',
  },
  {
    question: 'How does time arithmetic handle midnight shifts?',
    answer: 'When calculating clock finish times across overnight shifts, 24-hour modular arithmetic is applied. If a shift starts at 21:30 and lasts 8 hours, it wraps past 24:00 to finish at 05:30 the next morning.',
  },
];

export const HoursCalculatorPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const faqs = isEn ? hoursFaqsEn : hoursFaqsEs;

  return (
    <ToolLayout
      category={isEn ? 'Time & Hours' : 'Tiempo & Horas'}
      toolName={isEn ? 'Hours & Minutes Calculator' : 'Sumador y Restador de Horas'}
      seoTitle={isEn ? 'Hours and Minutes Calculator (Sexagesimal & Timesheet) - Calculando' : 'Sumador y Restador de Horas y Minutos (Cálculo Sexagesimal) - Calculando'}
      seoDescription={isEn ? 'Add and subtract hours, minutes, and seconds. Instant sexagesimal duration totals, decimal hours for payroll timesheets, and clock wrap calculator.' : 'Suma y resta horas, minutos y segundos sexagesimales. Convierte a horas decimales para planillas laborales, horas extras y cálculo de hora de fin de turno.'}
      canonicalPath="/sumador-horas-minutos"
      faqs={faqs}
    >
      <HoursCalculator />

      <ToolEducationalSection
        badge={isEn ? 'Time Arithmetic & Timesheets' : 'Aritmética Sexagesimal y Planillas'}
        title={isEn ? 'Sexagesimal Time Addition and Decimal Payroll Conversion' : 'Aritmética de Tiempo y Conversión a Horas Decimales'}
        subtitle={isEn ? 'Mastering base-60 duration calculations, timesheet logs, and labor hour rates.' : 'Fundamentos matemáticos del sistema sexagesimal, registro de asistencia laboral y cálculo de horas extras.'}
        regulatoryFramework={{
          title: isEn ? 'Base-60 Math and Labor Regulations' : 'Sistema Sexagesimal y Normativa Laboral (D.L. 728)',
          description: isEn
            ? 'Unlike the decimal system, time arithmetic relies on base-60. Minutes and seconds cannot simply be added as decimal fractions without explicit base conversion.'
            : 'El tiempo se mide en el sistema sexagesimal (base 60). En el ámbito laboral formal del Perú (D.L. 728 y D.S. 007-2002-TR), la jornada ordinaria máxima es de 8 horas diarias o 48 horas semanales, requiriendo registro estricto de minutos para nómina.',
          points: [
            isEn
              ? 'Carry-over rule: Every 60 seconds roll into 1 minute; every 60 minutes roll into 1 hour.'
              : 'Regla de acarreo sexagesimal: Al sumar minutos, cada múltiplo de 60 se convierte en 1 hora adicional y el resto permanece como minutos.',
            isEn
              ? 'Decimal hours conversion: Crucial for multiplying hours by hourly pay rates in accounting software.'
              : 'Conversión decimal obligatoria: Las planillas salariales multiplican horas decimales por la remuneración por hora. 15m = 0.25h, 30m = 0.50h, 45m = 0.75h.',
            isEn
              ? 'Overtime pay tiers: Peruvian labor law stipulates +25% pay for first 2 overtime hours, +35% thereafter.'
              : 'Sobretasa de horas extras: Las 2 primeras horas extras se pagan con 25% de sobretasa y las subsiguientes con 35% sobre el valor hora ordinario.',
          ],
        }}
        workedExample={{
          title: isEn ? 'Worked Real Example: 3-Day Shift Timesheet' : 'Caso de Estudio Resuelto: Registro de Turnos de 3 Días',
          scenario: isEn
            ? 'Shift records: Day 1 (8h 45m), Day 2 (7h 50m), Day 3 (9h 15m). Calculate total duration and decimal hours.'
            : 'Turnos registrados: Lunes (8h 45m), Martes (7h 50m), Miércoles (9h 15m). Calcular tiempo total y horas decimales.',
          steps: [
            {
              label: isEn ? 'Step 1 - Sum Raw Hours' : 'Paso 1 - Suma de Horas Base',
              detail: '8h + 7h + 9h = 24 horas.',
            },
            {
              label: isEn ? 'Step 2 - Sum Minutes' : 'Paso 2 - Suma y Acarreo de Minutos',
              detail: '45m + 50m + 15m = 110 minutos = 1 hora y 50 minutos.',
            },
            {
              label: isEn ? 'Step 3 - Sexagesimal Total' : 'Paso 3 - Tiempo Total Sexagesimal',
              detail: '24h + 1h 50m = 25 horas y 50 minutos (25:50:00).',
            },
            {
              label: isEn ? 'Step 4 - Decimal Conversion' : 'Paso 4 - Conversión Decimal',
              detail: '25 + (50 / 60) = 25 + 0.833 = 25.83 horas decimales.',
            },
          ],
          conclusion: isEn
            ? 'Total time is 25 hours and 50 minutes, representing 25.83 decimal hours for invoicing or payroll.'
            : 'El total acumulado es 25 horas y 50 minutos, equivalente a 25.83 horas decimales para el cálculo de haberes.',
        }}
        faqs={faqs}
      />
    </ToolLayout>
  );
};

export default HoursCalculatorPage;
