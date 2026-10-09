import React from 'react';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { IgvCalculator } from '@/modules/finance/igv-calculator/ui/IgvCalculator';
import { ToolEducationalSection } from '@/components/ui/ToolEducationalSection';
import { FAQItem } from '@/components/seo/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

const igvFaqsEs: FAQItem[] = [
  {
    question: '¿Cómo se desglosa el IGV del monto total facturado?',
    answer: 'Para extraer la Base Imponible a partir del total facturado, se divide el monto total entre 1.18: Base = Total / 1.18. Luego, el IGV es la diferencia: IGV = Total - Base. Es un error muy común calcular el 18% del total y restarlo, lo que produce un resultado contable inexacto.',
  },
  {
    question: '¿A partir de qué monto aplica la detracción en el Perú?',
    answer: 'De acuerdo con el Sistema de Pago de Obligaciones Tributarias (SPOT - D.L. 940 de SUNAT), la gran mayoría de servicios y contratos comerciales están sujetos a detracción cuando el importe total del comprobante de pago supera los S/ 700.00 (Setecientos Soles).',
  },
  {
    question: '¿La detracción se calcula sobre la Base Imponible o sobre el Total facturado?',
    answer: 'La detracción de SUNAT se calcula SIEMPRE sobre el Importe Total Facturado (Base Imponible + IGV), no sobre la base imponible sola. Por ejemplo, en una factura total de S/ 1,000 con tasa del 12%, el depósito al Banco de la Nación es de S/ 120.00.',
  },
  {
    question: '¿Qué sucede si el adquirente no realiza el depósito de la detracción?',
    answer: 'Si el cliente no deposita la detracción en la cuenta del Banco de la Nación del proveedor, no podrá ejercer el derecho al crédito fiscal del IGV de esa factura en su declaración mensual hasta que subsane el depósito correspondiente, además de exponerse a multas tributarias.',
  },
  {
    question: '¿Cuál es la tasa de detracción para servicios empresariales y profesionales?',
    answer: 'La tasa general establecida en el Anexo 3 de la Resolución de Superintendencia N° 183-2004/SUNAT para "Demás servicios gravados con el IGV" y mantenimiento es del 12%. El transporte de bienes tributa con el 4% y el arrendamiento de bienes con el 10%.',
  },
];

const igvFaqsEn: FAQItem[] = [
  {
    question: 'How is Peru 18% IGV extracted from the total invoice amount?',
    answer: 'The taxable base is calculated by dividing the gross total by 1.18: Base = Total / 1.18. The 18% IGV tax is the remainder: IGV = Total - Base. Subtracting 18% directly from the gross total is an arithmetic error.',
  },
  {
    question: 'What is the Sunat SPOT detraction threshold?',
    answer: 'Under Peruvian tax regulation SPOT (D.L. 940), transactions exceeding PEN 700.00 (soles) in eligible service categories require withholding a percentage deposited directly into the suppliers state Banco de la Nacion tax account.',
  },
  {
    question: 'Is the detraction withholding computed over the pre-tax base or gross total?',
    answer: 'Sunat detractions are strictly computed against the gross invoice total (including the 18% IGV), rounded to the nearest integer.',
  },
];

export const IgvCalculatorPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const faqs = isEn ? igvFaqsEn : igvFaqsEs;

  return (
    <ToolLayout
      category={isEn ? 'Finance & Taxes' : 'Finanzas & Impuestos'}
      toolName={isEn ? 'Peru IGV 18% & Detractions' : 'Calculadora de IGV y Detracciones'}
      seoTitle={isEn ? 'Peru IGV 18% & Sunat Detractions Calculator - Calculando' : 'Calculadora de IGV 18% y Detracciones SUNAT (Perú) - Calculando'}
      seoDescription={isEn ? 'Calculate taxable base, 18% IGV, and Sunat SPOT Banco de la Nacion detraction withholdings for Peruvian invoices. Real-time arithmetic and official tax rates.' : 'Calcula Base Imponible, 18% IGV y monto de detracción SPOT del Banco de la Nación para facturas en Perú. Desglose formal y tasas SUNAT vigentes.'}
      canonicalPath="/calculadora-igv-detracciones"
      faqs={faqs}
    >
      <IgvCalculator />

      <ToolEducationalSection
        badge={isEn ? 'Tax Regulations & Sunat SPOT' : 'Normativa Tributaria y SPOT SUNAT'}
        title={isEn ? 'Understanding Peru Value-Added Tax (IGV 18%) and Detraction Withholdings' : 'Cómo funciona el IGV (18%) y el Régimen de Detracciones en el Perú'}
        subtitle={isEn ? 'Clear arithmetic rules for taxable bases, VAT extraction, and Banco de la Nación deposits.' : 'Reglas contables para cálculo de base imponible, desglose inverso y depósitos SPOT conforme a ley.'}
        regulatoryFramework={{
          title: isEn ? 'Legal Framework (Decreto Legislativo N° 821 & D.L. 940)' : 'Marco Legal: TUO de la Ley del IGV (D.S. 055-99-EF) y D.L. 940',
          description: isEn
            ? 'The Peruvian Value Added Tax (IGV) consists of a 16% base tax plus a 2% Municipal Promotion Tax (IPM), totaling an effective statutory rate of 18%. The SPOT system enforces advance VAT compliance.'
            : 'En el Perú, el IGV grava el valor agregado en la venta de bienes y prestación de servicios. Está compuesto por una tasa del 16% más un 2% del Impuesto de Promoción Municipal (IPM), consolidando la alícuota del 18%.',
          points: [
            isEn
              ? 'Inverse base calculation: Taxable Base = Total / 1.18. Direct percentage subtraction produces erroneous amounts.'
              : 'Desglose inverso formal: La Base Imponible se obtiene dividiendo el total entre 1.18. Restar el 18% directamente sobre el total disminuye indebidamente la base imponible.',
            isEn
              ? 'SPOT Detraction System: Obligates the buyer to withhold a percentage of gross total into the sellers Banco de la Nación account.'
              : 'Sistema de Detracciones (SPOT): Mecanismo que obliga al adquirente a detraer un porcentaje del total facturado y depositarlo en la cuenta corriente del proveedor en el Banco de la Nación.',
            isEn
              ? 'Threshold: Mandatory for operations exceeding S/ 700.00 in designated services.'
              : 'Umbral legal de S/ 700: Para la gran mayoría de servicios comerciales, la detracción aplica únicamente si el comprobante supera los S/ 700 soles.',
          ],
        }}
        workedExample={{
          title: isEn ? 'Worked Real Example: Consulting Invoice Total S/ 1,500' : 'Caso de Estudio Resuelto: Factura de Servicios por S/ 1,500',
          scenario: isEn
            ? 'A professional consulting invoice is issued for a total of S/ 1,500.00. The applicable Sunat service detraction rate is 12%.'
            : 'Una empresa emite una factura por servicios de asesoría comercial por un importe total de S/ 1,500.00. La tasa de detracción aplicable por servicios es 12%.',
          steps: [
            {
              label: isEn ? 'Step 1 - Taxable Base' : 'Paso 1 - Base Imponible (Subtotal)',
              detail: '1,500.00 / 1.18 = S/ 1,271.19.',
            },
            {
              label: isEn ? 'Step 2 - 18% IGV' : 'Paso 2 - IGV (18%)',
              detail: '1,500.00 - 1,271.19 = S/ 228.81.',
            },
            {
              label: isEn ? 'Step 3 - Sunat Detraction (12%)' : 'Paso 3 - Detracción SPOT (12%)',
              detail: 'Al superar S/ 700: 1,500.00 × 0.12 = S/ 180.00 (depositado en Banco de la Nación).',
            },
            {
              label: isEn ? 'Step 4 - Net to Supplier' : 'Paso 4 - Saldo Neto al Proveedor',
              detail: '1,500.00 - 180.00 = S/ 1,320.00 pagado a la cuenta comercial.',
            },
          ],
          conclusion: isEn
            ? 'The client deposits S/ 180.00 into Sunat Banco de la Nación account and transfers S/ 1,320.00 directly to the supplier.'
            : 'El cliente abona S/ 180.00 a la cuenta de detracciones de SUNAT y transfiere S/ 1,320.00 directamente a la cuenta del proveedor.',
        }}
        faqs={faqs}
      />
    </ToolLayout>
  );
};

export default IgvCalculatorPage;
