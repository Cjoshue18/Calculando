import React from 'react';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { TeaCalculator } from '@/modules/finance/tea-simulator/ui/TeaCalculator';
import { ToolEducationalSection } from '@/components/ui/ToolEducationalSection';
import { FAQItem } from '@/components/seo/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

const teaFaqsEs: FAQItem[] = [
  {
    question: '¿Cuál es la diferencia entre TEA y TCEA?',
    answer: 'La TEA (Tasa Efectiva Anual) mide únicamente el interés compensatorio que cobra el banco por el dinero prestado. La TCEA (Tasa de Costo Efectivo Anual) mide el costo real total del crédito, incluyendo la TEA más el seguro de desgravamen, seguros del bien, comisiones de mantenimiento y gastos administrativos. Para comparar ofertas de diferentes bancos (BCP, BBVA, Interbank, Scotiabank), siempre debes guiarte por la TCEA más baja.',
  },
  {
    question: '¿Por qué la TEA no se divide simplemente entre 12 meses?',
    answer: 'Porque en finanzas con interés compuesto, las tasas no son proporcionales sino equivalentes. Dividir la TEA entre 12 produce una tasa nominal y no efectiva. La fórmula matemáticamente exacta aprobada por la SBS es TEM = (1 + TEA)^(1/12) - 1, la cual toma en cuenta la capitalización mensual de los intereses.',
  },
  {
    question: '¿Qué es el seguro de desgravamen y por qué se cobra mensualmente?',
    answer: 'El seguro de desgravamen cancela la deuda pendiente ante la entidad bancaria en caso de fallecimiento o invalidez total y permanente del titular, evitando que la deuda se traslade a sus herederos. La póliza se calcula mensualmente como un porcentaje pequeño (típicamente entre 0.05% y 0.10%) aplicado sobre el saldo deudor insoluto de cada mes.',
  },
  {
    question: '¿Cómo funciona la amortización francesa de los bancos peruanos?',
    answer: 'En el sistema francés, la cuota periódica (capital + interés) se mantiene constante a lo largo de todo el plazo. En las primeras cuotas, el saldo insoluto es alto, por lo que la mayor parte del pago corresponde a intereses; conforme pasan los meses, el interés disminuye y una mayor porción de la cuota amortiza el capital.',
  },
  {
    question: '¿Conviene amortizar o realizar pagos anticipados en un préstamo bancario?',
    answer: 'Sí. Por ley de la SBS, todo usuario tiene derecho a realizar pagos anticipados (prepago total o parcial) sin penalidades. Puedes elegir entre reducir el monto de la cuota mensual futura manteniendo el plazo, o reducir el número de cuotas (plazo restante), siendo esta última opción la que mayor ahorro genera en intereses acumulados.',
  },
];

const teaFaqsEn: FAQItem[] = [
  {
    question: 'What is the difference between APR (TEA) and Total Effective Cost (TCEA)?',
    answer: 'The TEA (Annual Effective Rate) covers pure interest charges. The TCEA reflects the true total cost of credit including life insurance (desgravamen), servicing fees, and mandatory banking costs.',
  },
  {
    question: 'Why is French amortization the banking standard?',
    answer: 'The French amortization method ensures identical level monthly installment payments across the entire repayment schedule, offering predictable monthly household budgeting for borrowers.',
  },
  {
    question: 'How does credit life insurance (desgravamen) work?',
    answer: 'It covers outstanding loan principal in the event of disability or death, calculated on remaining unpaid balance at each monthly billing cycle.',
  },
];

export const TeaCalculatorPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const faqs = isEn ? teaFaqsEn : teaFaqsEs;

  return (
    <ToolLayout
      category={isEn ? 'Finance & Loans' : 'Finanzas & Préstamos'}
      toolName={isEn ? 'TEA / TCEA Loan Simulator' : 'Calculadora TEA / TCEA'}
      seoTitle={isEn ? 'TEA / TCEA Loan Calculator & Amortization Simulator - Calculando' : 'Calculadora TEA y Simulador de Préstamos TCEA (Perú) - Calculando'}
      seoDescription={isEn ? 'Simulate personal and bank loan payments in Peru (French amortization). Convert TEA to monthly TEM, break down interest, desgravamen insurance, and true TCEA.' : 'Simula cuotas mensuales de préstamos personales y bancarios en Perú (sistema francés). Convierte TEA a TEM, desglosa intereses, seguro de desgravamen y TCEA real.'}
      canonicalPath="/calculadora-tea-tcea"
      faqs={faqs}
    >
      <TeaCalculator />

      <ToolEducationalSection
        badge={isEn ? 'Banking Regulations & SBS' : 'Normativa SBS y Conducta de Mercado'}
        title={isEn ? 'Mastering Effective Interest Rates: TEA, TEM, and TCEA' : 'Cómo funcionan los Préstamos Bancarios y Tasas en el Perú'}
        subtitle={isEn ? 'Financial mathematics, French amortization formulas, and regulatory SBS standards.' : 'Matemática financiera del sistema francés, equivalencia de tasas y cálculo transparente de cuotas.'}
        regulatoryFramework={{
          title: isEn ? 'Regulatory Framework (SBS Market Conduct Standards)' : 'Reglamento de Gestión de Conducta de Mercado del Sistema Financiero (SBS)',
          description: isEn
            ? 'Regulated by the Superintendency of Banking and Insurance of Peru (SBS), financial institutions must provide clear, unbundled disclosures of capital amortization, compensatory interest, and insurance premiums.'
            : 'En el Perú, la Superintendencia de Banca, Seguros y AFP (SBS) establece que las entidades financieras deben entregar una Hoja Resumen y cronograma detallado que diferencie el interés compensatorio del costo efectivo total.',
          points: [
            isEn
              ? 'Rate compounding equivalence: TEM = (1 + TEA)^(1/12) - 1. Nominal monthly division is prohibited in effective interest accounting.'
              : 'Equivalencia de tasas compuestas: La TEM se calcula con la raíz doceava de (1 + TEA). Dividir entre 12 distorsiona el costo financiero real.',
            isEn
              ? 'TCEA as the true comparison benchmark: Reflects nominal payments, life insurance, and maintenance surcharges.'
              : 'La TCEA es la brújula del consumidor: Para comparar préstamos entre entidades financieras (BCP, Interbank, BBVA, cajas municipales), siempre se debe comparar la TCEA y no la TEA aislada.',
            isEn
              ? 'French system mechanics: Early installments pay higher interest portions; later installments accelerate principal reduction.'
              : 'Dinámica de amortización francesa: Las primeras cuotas pagan mayor proporción de intereses por el alto saldo deudor, amortizando poco capital al inicio.',
          ],
        }}
        workedExample={{
          title: isEn ? 'Worked Real Example: S/ 5,000 Personal Loan over 12 Months' : 'Caso de Estudio Resuelto: Préstamo Personal de S/ 5,000 a 12 Meses',
          scenario: isEn
            ? 'Principal: S/ 5,000.00. TEA: 24.50% annual. Term: 12 months. Monthly credit life insurance: 0.075% on outstanding balance.'
            : 'Monto: S/ 5,000.00. TEA pactada: 24.50% anual. Plazo: 12 meses. Seguro de desgravamen: 0.075% mensual sobre saldo.',
          steps: [
            {
              label: isEn ? 'Step 1 - Monthly TEM Rate' : 'Paso 1 - Conversión a TEM',
              detail: 'TEM = (1 + 0.2450)^(1/12) - 1 = 1.848% mensual.',
            },
            {
              label: isEn ? 'Step 2 - Base Monthly Installment' : 'Paso 2 - Cuota Base (Sistema Francés)',
              detail: 'C = 5,000 × [0.01848 × (1.01848)^12] / [(1.01848)^12 - 1] = S/ 468.96.',
            },
            {
              label: isEn ? 'Step 3 - Initial Desgravamen' : 'Paso 3 - Seguro de Desgravamen Mes 1',
              detail: '5,000 × 0.00075 = S/ 3.75.',
            },
            {
              label: isEn ? 'Step 4 - Total Installment' : 'Paso 4 - Cuota Total Estimada Mes 1',
              detail: 'S/ 468.96 + S/ 3.75 = S/ 472.71 mensuales.',
            },
          ],
          conclusion: isEn
            ? 'The borrower pays approximately S/ 472 per month. Total financing interest and fees equal approximately S/ 650 over the year.'
            : 'El prestatario paga una cuota mensual aproximada de S/ 472. El costo total en intereses y seguros durante el año es de ~S/ 650.',
        }}
        faqs={faqs}
      />
    </ToolLayout>
  );
};

export default TeaCalculatorPage;
