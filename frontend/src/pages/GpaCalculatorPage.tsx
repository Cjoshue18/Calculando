import React from 'react';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { GpaCalculator } from '@/modules/academic/gpa-calculator/ui/GpaCalculator';
import { ToolEducationalSection } from '@/components/ui/ToolEducationalSection';
import { FAQItem } from '@/components/seo/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

const gpaFaqsEs: FAQItem[] = [
  {
    question: '¿Cuál es la diferencia entre promedio simple y promedio ponderado?',
    answer: 'El promedio simple suma todas las notas y las divide entre el número de materias, tratando a todos los cursos por igual. El promedio ponderado multiplica la nota de cada asignatura por su número de créditos académicos: un curso de 5 créditos tiene un impacto mucho mayor en tu récord que uno de 2 créditos.',
  },
  {
    question: '¿Qué es el PPS y qué es el PPA?',
    answer: 'El PPS (Promedio Ponderado Semestral) mide exclusivamente tu rendimiento durante el ciclo lectivo vigente. El PPA (Promedio Ponderado Acumulado) integra todas las asignaturas aprobadas y desaprobadas cursadas desde tu primer ciclo universitario.',
  },
  {
    question: '¿Cómo afecta jalar o desaprobar un curso a mi promedio ponderado?',
    answer: 'En el sistema universitario peruano, la nota desaprobatoria (por ejemplo, 08 o 09) se multiplica por los créditos del curso y se divide entre el total de créditos, bajando drásticamente el PPA acumulado. Al cursarlo de nuevo, la nueva calificación se añade al récord según el reglamento de tu universidad.',
  },
  {
    question: '¿Cómo se determina el Tercio Superior y el Quinto Superior?',
    answer: 'Las facultades ordenan a los estudiantes según su PPA en orden descendente. El primer 33.3% integra el Tercio Superior y el primer 20% el Quinto Superior. Este indicador es indispensable para postular a becas Pronabec, convenios de intercambio y prácticas preprofesionales.',
  },
];

const gpaFaqsEn: FAQItem[] = [
  {
    question: 'What is the difference between simple GPA and credit-weighted GPA?',
    answer: 'A simple average weights all courses equally regardless of length or difficulty. A credit-weighted GPA multiplies each letter or numeric grade by the course credit hours, ensuring higher-credit courses exert proportional influence on your cumulative academic standing.',
  },
  {
    question: 'What is the difference between Semester GPA and Cumulative GPA?',
    answer: 'Semester GPA measures your performance solely within the current academic term. Cumulative GPA represents the total weighted average of all credits earned across all enrolled terms throughout your degree.',
  },
  {
    question: 'How do failed courses affect cumulative GPA?',
    answer: 'Failed course credit hours are usually included in the total attempted credits denominator with zero or low grade points, directly pulling down the cumulative GPA until retaken and updated per institutional repeat policy.',
  },
];

export const GpaCalculatorPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const faqs = isEn ? gpaFaqsEn : gpaFaqsEs;

  return (
    <ToolLayout
      category={isEn ? 'Academic' : 'Académico'}
      toolName={isEn ? 'Weighted GPA Calculator' : 'Promedio Ponderado por Créditos'}
      seoTitle={isEn ? 'Weighted GPA Calculator (Semester & Cumulative) - Calculando' : 'Calculadora de Promedio Ponderado por Créditos (PPA y PPS) - Calculando'}
      seoDescription={isEn ? 'Calculate your semester and cumulative GPA weighted by course credits. Interactive grade table, quality points breakdown, and degree honors tracker.' : 'Calcula con rigor tu Promedio Ponderado Semestral (PPS) y Acumulado (PPA) según créditos universitarios. Tabla interactiva, desglose formal y orden de mérito.'}
      canonicalPath="/promedio-ponderado-acumulado"
      faqs={faqs}
    >
      <GpaCalculator />

      <ToolEducationalSection
        badge={isEn ? 'Academic Regulations & Credits' : 'Marco Crediticio y Orden de Mérito'}
        title={isEn ? 'Understanding Credit-Weighted Grade Point Averages' : 'Cómo funciona el Promedio Ponderado por Créditos Universitarios'}
        subtitle={isEn ? 'The mathematics behind credit weightings, quality points, and academic honors ranking.' : 'Fundamentos matemáticos del cálculo crediticio, puntos de calidad y clasificación en tercio superior.'}
        regulatoryFramework={{
          title: isEn ? 'The Academic Credit System (Law & Standards)' : 'El Sistema de Créditos Académicos (Ley Universitaria N° 30220)',
          description: isEn
            ? 'Higher education uses the academic credit hour as a standardized metric of student workload. Theory and laboratory hours translate into course credits that determine grade weight.'
            : 'En el Perú, la Ley Universitaria N° 30220 define el crédito académico como la unidad de medida del trabajo académico. Un crédito suele equivaler a 16 horas de teoría o 32 horas de práctica por semestre.',
          points: [
            isEn
              ? 'Quality Points: Calculated as Course Grade multiplied by Course Credits.'
              : 'Puntos de calidad o crédito-nota: Es el producto algebraico de la calificación final obtenida por el número de créditos asignados al curso.',
            isEn
              ? 'PPS vs PPA: Semester vs. Cumulative metrics govern prerequisites and honors standing.'
              : 'Orden de mérito: El PPA acumulado define la ubicación en tercio superior, décimo superior y prioridad de matrícula por rendimiento académico.',
            isEn
              ? 'Institutional scales: Standard Peruvian vigesimal (0-20), international 4.0 scale, and percentage scales are mathematically convertible.'
              : 'Impacto de cursos de alto crédito: Una asignatura de 5 créditos (como Cálculo o Física) incide 2.5 veces más en el ponderado que un electivo de 2 créditos.',
          ],
        }}
        workedExample={{
          title: isEn ? 'Worked Real Example: 4-Course Semester' : 'Caso de Estudio Resuelto: Semestre de 4 Cursos',
          scenario: isEn
            ? 'Courses taken: Calculus II (5 credits, Grade 14), Physics I (4 credits, Grade 16), Algorithms (4 credits, Grade 18), English (2 credits, Grade 15).'
            : 'Cursos matriculados: Cálculo II (5 créditos, Nota 14), Física I (4 créditos, Nota 16), Algoritmos (4 créditos, Nota 18), Taller (2 créditos, Nota 15).',
          steps: [
            {
              label: isEn ? 'Step 1 - Quality Points' : 'Paso 1 - Puntos de Crédito-Nota',
              detail: '(14 × 5) + (16 × 4) + (18 × 4) + (15 × 2) = 70 + 64 + 72 + 30 = 236 puntos de calidad.',
            },
            {
              label: isEn ? 'Step 2 - Total Credits' : 'Paso 2 - Total de Créditos',
              detail: '5 + 4 + 4 + 2 = 15 créditos académicos totales.',
            },
            {
              label: isEn ? 'Step 3 - Weighted Division' : 'Paso 3 - División Ponderada',
              detail: '236 / 15 = 15.7333...',
            },
          ],
          conclusion: isEn
            ? 'The final semester weighted GPA is 15.73 on the 0-20 scale.'
            : 'El Promedio Ponderado Semestral (PPS) resultante es exactamente 15.73.',
        }}
        faqs={faqs}
      />
    </ToolLayout>
  );
};

export default GpaCalculatorPage;
