import React from 'react';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { GpaConverterCalculator } from '@/modules/academic/gpa-converter/ui/GpaConverterCalculator';
import { ToolEducationalSection } from '@/components/ui/ToolEducationalSection';
import { FAQItem } from '@/components/seo/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

const gpaFaqsEs: FAQItem[] = [
  {
    question: '¿Por qué convertir una nota de 0 a 20 con una simple regla de tres es un grave error?',
    answer: 'Una regla de tres directa (Nota / 5) distorsiona por completo la equivalencia académica: si tienes 10/20, la regla de tres arrojaría un GPA de 2.00 (calificación C aprobada en EE.UU.), cuando en realidad en el sistema vigesimal peruano 10 es una nota desaprobatoria (reprobado, GPA 0.00 / F). El rango aprobatorio peruano abarca de 11 a 20 (9 puntos), mientras que en Estados Unidos el rango aprobatorio universitario es de 2.00 a 4.00 (2 puntos).',
  },
  {
    question: '¿Qué GPA mínimo exigen las universidades extranjeras y becas internacionales?',
    answer: 'La mayoría de maestrías y programas de posgrado en EE.UU., Canadá y Europa (como becas Fulbright, Chevening, DAAD o Erasmus Mundus) exigen un GPA mínimo de 3.00 sobre 4.00, lo que en el sistema universitario peruano equivale a un promedio ponderado acumulado de entre 14.00 y 15.00 puntos.',
  },
  {
    question: '¿Cómo evalúa WES (World Education Services) los certificados de estudios peruanos?',
    answer: 'WES utiliza una tabla estandarizada de equivalencias para el Perú: notas de 16 a 20 corresponden a la letra A (GPA 4.00); de 14 a 15 a la letra B (GPA 3.00); de 11 a 13 a la letra C (GPA 2.00); y notas menores a 11 a la letra F (GPA 0.00).',
  },
  {
    question: '¿Qué es la Fórmula Bávara Modificada (Bayerische Formel) utilizada en Alemania?',
    answer: 'Es la fórmula oficial adoptada por las universidades alemanas y el DAAD para convalidar notas internacionales: N_Alemania = 1 + 3 × [(N_max - N) / (N_max - N_min)]. En Alemania la calificación 1.0 es la máxima excelencia (sehr gut) y 4.0 es la nota mínima para aprobar.',
  },
  {
    question: '¿A qué GPA equivale pertenecer al Quinto Superior o Décimo Superior?',
    answer: 'En facultades de ingeniería y ciencias peruanas, el Quinto Superior suele situarse a partir de un promedio de 15.5 a 16.5 (GPA 3.50 a 3.75), mientras que el Décimo Superior suele requerir promedios superiores a 17.0 (GPA 3.85 a 4.00).',
  },
];

const gpaFaqsEn: FAQItem[] = [
  {
    question: 'Why is linear division (Grade / 5) mathematically incorrect for 0-20 Peruvian grades?',
    answer: 'A linear ratio divides 10/20 to 2.00 (passing C in the US), ignoring that 10 is a failing mark in Peru. Passing in Peru spans 11 to 20, whereas passing in the US spans 2.0 to 4.0. Direct proportion drastically inflates failing marks and misrepresents academic performance.',
  },
  {
    question: 'What is the standard WES equivalence for Peruvian university transcripts?',
    answer: 'WES standard mapping assigns: 16-20 as Grade A (4.00 GPA), 14-15 as Grade B (3.00 GPA), 11-13 as Grade C (2.00 GPA), and below 11 as Failing F (0.00 GPA).',
  },
  {
    question: 'What is the German Modified Bavarian Formula used by DAAD?',
    answer: 'The Bavarian formula transforms the Peruvian vigesimal scale into the German 1.0-5.0 scale using: German Grade = 1 + 3 * [(N_max - Grade) / (N_max - N_min)], where 1.0 is highest distinction and 4.0 is minimum pass.',
  },
];

export const GpaConverterPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const faqs = isEn ? gpaFaqsEn : gpaFaqsEs;

  return (
    <ToolLayout
      category={isEn ? 'Academic & University' : 'Académico & Universidad'}
      toolName={isEn ? 'Vigesimal (0-20) to US GPA & ECTS Converter' : 'Conversor de Notas Vigesimal (0-20) a GPA y ECTS'}
      seoTitle={isEn ? 'Peruvian Vigesimal (0-20) to US GPA (4.0) & ECTS Converter - Calculando' : 'Conversor de Notas Vigesimal (0-20) a GPA (4.0) y ECTS Europeo - Calculando'}
      seoDescription={isEn ? 'Convert Peruvian university vigesimal grades (0-20) to US 4.0 GPA, European ECTS letter grades, and the German Bavarian scale (DAAD, WES, Fulbright standards).' : 'Convierte tu promedio de notas universitario peruano (escala 0 a 20) a GPA 4.0 (EE.UU.), sistema europeo ECTS y escala alemana DAAD según estándares oficiales WES y Fulbright.'}
      canonicalPath="/conversor-notas-gpa-vigesimal"
      faqs={faqs}
    >
      <GpaConverterCalculator />

      <ToolEducationalSection
        badge={isEn ? 'International Standards & Admissions' : 'Estándares Internacionales de Admisión'}
        title={isEn ? 'Conversion Methodology for Peruvian University Transcripts' : 'Metodología Oficial de Conversión de Notas Universitarias en el Perú'}
        subtitle={isEn ? 'How international admission committees and scholarship bodies evaluate the vigesimal scale.' : 'Explicación técnica de por qué no se usa regla de tres y cómo homologan WES, Fulbright y comités de posgrado.'}
        regulatoryFramework={{
          title: isEn ? 'Evaluation Standards (WES, Fulbright & Bologna Process)' : 'Criterios de Homologación (WES, Fulbright, DAAD y Proceso de Bolonia)',
          description: isEn
            ? 'The Peruvian university grading system is strictly vigesimal (0 to 20, passing at 11 or 10.5). Foreign universities employ non-linear standardizations to preserve merit and rigor.'
            : 'El sistema universitario peruano emplea la escala vigesimal (0 a 20, con nota mínima aprobatoria de 11 o 10.5 según la Ley Universitaria N° 30220). Para postular a becas y posgrados en el extranjero, los certificados deben traducirse a sistemas estandarizados.',
          points: [
            isEn
              ? 'WES Standard: Grades 16-20 are mapped to US Grade A (4.00), recognizing the exceptional difficulty of achieving top vigesimal marks in Peru.'
              : 'Criterio WES (World Education Services): Las notas de 16 a 20 se homologan con la letra A (GPA 4.00), reconociendo la alta exigencia académica de la escala vigesimal en carreras de ingeniería y ciencias.',
            isEn
              ? 'ECTS Grading Scale: Maps performance into statistical cohorts: A (top 10%), B (next 25%), C (next 30%), D (next 25%), E (lowest 10% passing), and F (fail).'
              : 'Escala Europea ECTS: Clasifica a los aprobados en percentiles de rendimiento: A (10% superior), B (25% siguiente), C (30% siguiente), D (25% siguiente) y E (10% inferior aprobatorio).',
            isEn
              ? 'Bavarian Formula: Used across German and Austrian universities (DAAD) to linearly interpolate the passing interval onto the 1.0 to 4.0 German scale.'
              : 'Fórmula Bávara Modificada: Utilizada por el DAAD y universidades de habla alemana para mapear exactamente el intervalo de notas aprobadas (11 a 20) en el intervalo alemán (1.0 a 4.0).',
          ],
        }}
        workedExample={{
          title: isEn ? 'Worked Real Example: Cumulative Average 16.40 in Peruvian Engineering' : 'Caso de Estudio Resuelto: Alumno con Promedio Vigesimal de 16.40',
          scenario: isEn
            ? 'A Peruvian university student with a cumulative weighted average of 16.40 applies for an international master scholarship requiring a minimum 3.00 GPA.'
            : 'Un estudiante de ingeniería en Lima tiene un promedio ponderado acumulado de 16.40 sobre 20.00 y desea postular a una beca de maestría en el extranjero que exige un GPA mínimo de 3.00.',
          steps: [
            {
              label: isEn ? 'Step 1 - WES Equivalence Lookup' : 'Paso 1 - Ubicación en Escala WES',
              detail: 'La nota de 16.40 se ubica en el tramo 15.00 a 16.49, que corresponde a una calificación estadounidense de B+ con GPA de 3.33 / 4.00 (Notable / Distinguido).',
            },
            {
              label: isEn ? 'Step 2 - European ECTS Assignment' : 'Paso 2 - Asignación ECTS Europea',
              detail: 'Corresponde a un Grado ECTS B, situando al estudiante en el Quinto / Tercio Superior de su promoción.',
            },
            {
              label: isEn ? 'Step 3 - German Bavarian Formula' : 'Paso 3 - Cálculo con Fórmula Bávara (Alemania)',
              detail: 'N_Alemania = 1 + 3 × [(20 - 16.40) / (20 - 11)] = 1 + 3 × (3.60 / 9) = 1 + 1.20 = 2.20 (Calificación "Gut" - Bueno).',
            },
            {
              label: isEn ? 'Step 4 - Scholarship Eligibility' : 'Paso 4 - Cumplimiento de Requisitos',
              detail: 'Con un GPA de 3.33 / 4.00, el estudiante supera holgadamente el requisito de 3.00 GPA de la beca internacional.',
            },
          ],
          conclusion: isEn
            ? 'The student qualifies with a strong 3.33 US GPA, an ECTS Grade B, and a German grade of 2.20, fully eligible for competitive foreign graduate admissions.'
            : 'El estudiante califica con un sólido GPA de 3.33 / 4.00, Grado ECTS B y nota alemana de 2.20, superando ampliamente el corte de postulación.',
        }}
        faqs={faqs}
      />
    </ToolLayout>
  );
};

export default GpaConverterPage;
