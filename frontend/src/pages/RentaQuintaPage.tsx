import React from 'react';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { RentaQuintaCalculator } from '@/modules/finance/renta-quinta/ui/RentaQuintaCalculator';
import { ToolEducationalSection } from '@/components/ui/ToolEducationalSection';
import { FAQItem } from '@/components/seo/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

const rentaQuintaFaqsEs: FAQItem[] = [
  {
    question: '¿A partir de qué sueldo mensual se retiene impuesto a la renta de 5ta categoría?',
    answer: 'Para el ejercicio tributario con UIT de S/ 5,150, la deducción inafecta obligatoria de 7 UIT equivale a S/ 36,050 al año. En un régimen común (12 sueldos ordinarios más 2 gratificaciones con bonificación del 9%), se empieza a retener a partir de un sueldo mensual aproximado de S/ 2,542. Por debajo de ese ingreso, la retención en boleta es de S/ 0.00.',
  },
  {
    question: '¿Cuáles son los tramos y tasas progresivas del impuesto a la renta de 5ta categoría?',
    answer: 'La Ley del Impuesto a la Renta (Art. 53) fija una escala progresiva acumulativa: Tramo 1 (hasta 5 UIT): 8%; Tramo 2 (más de 5 hasta 20 UIT): 14%; Tramo 3 (más de 20 hasta 35 UIT): 17%; Tramo 4 (más de 35 hasta 45 UIT): 20%; y Tramo 5 (más de 45 UIT): 30%. Solo pagas la tasa superior por el excedente de cada tramo.',
  },
  {
    question: '¿Qué gastos adicionales permiten deducir hasta 3 UIT adicionales?',
    answer: 'Conforme a la normativa de SUNAT, los trabajadores pueden deducir hasta 3 UIT adicionales (S/ 15,450) por consumos acreditados con DNI en boletas electrónicas: 15% en restaurantes, bares y hoteles; 30% en servicios profesionales o de oficios (4ta categoría); 30% en servicios médicos y odontológicos; 30% en alquiler de inmuebles; y 100% de aportaciones a EsSalud por trabajadoras del hogar.',
  },
  {
    question: '¿Por qué la retención en mi boleta cambia a lo largo de los meses?',
    answer: 'El empleador no retiene una cuota fija, sino que aplica el procedimiento de retención mensual progresivo fijado en el Artículo 40 del Reglamento del Impuesto a la Renta: entre enero y marzo el impuesto proyectado se divide entre 12; en abril se descuenta lo retenido y se divide entre 9; en mayo-julio entre 8; en agosto entre 5; en setiembre-noviembre entre 4; y en diciembre se efectúa la regularización final.',
  },
  {
    question: '¿Las gratificaciones legales y las utilidades están afectas a 5ta categoría?',
    answer: 'Sí. Tanto las gratificaciones ordinarias de Fiestas Patrias y Navidad como la participación en utilidades de la empresa forman parte de la renta bruta anual de quinta categoría y se computan para el cálculo del impuesto del ejercicio.',
  },
];

const rentaQuintaFaqsEn: FAQItem[] = [
  {
    question: 'What is the salary threshold for 5th category payroll tax in Peru?',
    answer: 'Under Peruvian tax law, employees enjoy an initial statutory tax-free exemption of 7 UIT (PEN 36,050 for a PEN 5,150 UIT). For workers receiving 14 monthly wages plus the 9% healthcare bonus, tax withholding begins above approximately PEN 2,542 gross per month.',
  },
  {
    question: 'How do progressive tax brackets work for Peruvian employees?',
    answer: 'Tax rates scale progressively: 8% for the first 5 UIT of net taxable income, 14% between 5 and 20 UIT, 17% between 20 and 35 UIT, 20% between 35 and 45 UIT, and 30% above 45 UIT.',
  },
  {
    question: 'What additional deductions can workers claim up to 3 UIT?',
    answer: 'Peruvian tax agency SUNAT allows deducting up to 3 additional UITs for expenses registered with National ID (DNI): 15% on restaurants and hotels, 30% on professional independent services, 30% on dental/medical fees, and 30% on housing rent.',
  },
];

export const RentaQuintaPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const faqs = isEn ? rentaQuintaFaqsEn : rentaQuintaFaqsEs;

  return (
    <ToolLayout
      category={isEn ? 'Finance & Taxes' : 'Finanzas & Impuestos'}
      toolName={isEn ? '5th Category Income Tax Calculator' : 'Calculadora de Renta de 5ta Categoría'}
      seoTitle={isEn ? 'Peru 5th Category Income Tax Calculator (SUNAT) - Calculando' : 'Calculadora de Renta de 5ta Categoría 2026 (Planilla SUNAT) - Calculando'}
      seoDescription={isEn ? 'Calculate your Peruvian 5th category payroll tax withholdings, 7 UIT deductions, progressive brackets (8%-30%), and net take-home salary according to SUNAT rules.' : 'Calcula la retención mensual del Impuesto a la Renta de 5ta categoría en boleta de pago (Perú). Deducción de 7 UIT, tramos progresivos del 8% al 30% y gratificaciones de ley.'}
      canonicalPath="/calculadora-renta-quinta-categoria"
      faqs={faqs}
    >
      <RentaQuintaCalculator />

      <ToolEducationalSection
        badge={isEn ? 'Tax Regulations & SUNAT' : 'Normativa Tributaria y SUNAT'}
        title={isEn ? 'How Peru 5th Category Payroll Tax Works' : 'Cómo funciona el Impuesto a la Renta de Quinta Categoría en el Perú'}
        subtitle={isEn ? 'Clear rules for projected income, legal deductions, and monthly payroll tax withholdings.' : 'Guía práctica para entender la deducción de 7 UIT, tramos escalonados y descuentos en tu boleta de pago.'}
        regulatoryFramework={{
          title: isEn ? 'Legal Framework (Decreto Supremo N° 179-2004-EF & D.L. 728)' : 'Marco Legal: TUO de la Ley del Impuesto a la Renta (D.S. 179-2004-EF)',
          description: isEn
            ? 'Fifth category tax applies to dependent employment income earned under a subordination contract in the private or public sector in Peru.'
            : 'El Impuesto a la Renta de Quinta Categoría grava las remuneraciones obtenidas por el trabajo dependiente en relación de subordinación, incluyendo sueldos, gratificaciones, horas extras y bonificaciones.',
          points: [
            isEn
              ? 'Statutory Deduction: The first 7 UIT of annual gross income are completely exempt from tax under Article 46.'
              : 'Deducción inafecta de 7 UIT: El Artículo 46 de la Ley otorga a todo trabajador dependiente una deducción fija automática equivalente a 7 UIT anuales (S/ 36,050 para UIT de S/ 5,150).',
            isEn
              ? 'Progressive Brackets: Tax applies incrementally only to the income exceeding the 7 UIT threshold across 5 tax brackets (8% to 30%).'
              : 'Escala Progresiva Acumulativa: De conformidad con el Artículo 53, el impuesto se aplica de forma escalonada. Quien entra al segundo tramo solo paga el 14% por la porción que supera las 5 UIT.',
            isEn
              ? 'Monthly Withholding Algorithm: Employers project annual income each month and adjust withholdings incrementally under Article 40 regulations.'
              : 'Algoritmo de retención mensual en boleta: Conforme al Artículo 40 del Reglamento, el empleador efectúa retenciones fraccionadas según el mes del año para evitar cobros abruptos en un solo periodo.',
          ],
        }}
        workedExample={{
          title: isEn ? 'Worked Real Example: Monthly Salary S/ 4,500 with Gratifications' : 'Caso de Estudio Resuelto: Sueldo Bruto Mensual de S/ 4,500 en Planilla',
          scenario: isEn
            ? 'An employee earns S/ 4,500 gross per month with legal July and December gratifications (including the 9% EsSalud extraordinary bonus) and a UIT of S/ 5,150.'
            : 'Un trabajador en planilla percibe un sueldo bruto mensual de S/ 4,500.00 con derecho a dos gratificaciones legales completas (Julio y Diciembre con bonificación extraordinaria del 9% según Ley 30334).',
          steps: [
            {
              label: isEn ? 'Step 1 - Projected Annual Gross Income' : 'Paso 1 - Renta Bruta Anual Proyectada',
              detail: '(12 × 4,500) + (2 × 4,500 × 1.09) = 54,000 + 9,810 = S/ 63,810.00.',
            },
            {
              label: isEn ? 'Step 2 - 7 UIT Statutory Deduction' : 'Paso 2 - Deducción Inafecta de 7 UIT',
              detail: '7 × S/ 5,150 = S/ 36,050.00.',
            },
            {
              label: isEn ? 'Step 3 - Net Taxable Income' : 'Paso 3 - Renta Neta Imponible',
              detail: '63,810.00 - 36,050.00 = S/ 27,760.00 sujeta a impuesto.',
            },
            {
              label: isEn ? 'Step 4 - Progressive Bracket Breakdown' : 'Paso 4 - Aplicación de Tramos Progresivos',
              detail: 'Tramo 1 (hasta 5 UIT = S/ 25,750 al 8%): S/ 2,060.00. Tramo 2 (exceso de S/ 2,010 al 14%): S/ 281.40. Impuesto Anual Total: S/ 2,341.40.',
            },
            {
              label: isEn ? 'Step 5 - Average Monthly Withholding' : 'Paso 5 - Retención Mensual en Boleta',
              detail: 'S/ 2,341.40 ÷ 12 meses = S/ 195.12 promedio mensual descontado en la boleta de pago.',
            },
          ],
          conclusion: isEn
            ? 'The employee has an annual tax liability of S/ 2,341.40 (an effective tax rate of only 3.67% over gross earnings), withheld at approximately S/ 195.12 per month.'
            : 'El trabajador paga S/ 2,341.40 de impuesto anual (una tasa efectiva de solo 3.67% sobre sus ingresos brutos totales), lo que equivale a un descuento promedio en boleta de S/ 195.12 al mes.',
        }}
        faqs={faqs}
      />
    </ToolLayout>
  );
};

export default RentaQuintaPage;
