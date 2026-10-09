import React from 'react';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { FinalGradeCalculator } from '@/modules/academic/final-grade/ui/FinalGradeCalculator';
import { ToolEducationalSection } from '@/components/ui/ToolEducationalSection';
import { FAQItem } from '@/components/seo/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

const finalGradeFaqsEs: FAQItem[] = [
  {
    question: '¿Cómo se calcula cuánto necesito en el examen final para aprobar?',
    answer: 'Se multiplica cada nota obtenida por su peso porcentual correspondiente y se suman los resultados para obtener los puntos acumulados. Luego, esta suma se resta de la nota mínima aprobatoria (usualmente 11 o 10.5). Finalmente, el puntaje restante se divide entre el porcentaje asignado al examen final.',
  },
  {
    question: '¿La nota 10.5 redondea a 11 en las universidades peruanas?',
    answer: 'En la gran mayoría de universidades e institutos del Perú regulados por Sunedu y la Ley Universitaria N° 30220, la fracción de 0.5 o superior favorece al alumno únicamente en el promedio final consolidado en actas. Durante las evaluaciones parciales previas, el decimal se mantiene estricto.',
  },
  {
    question: '¿Qué significa si la calculadora indica que necesito más de 20?',
    answer: 'Significa que matemáticamente, incluso obteniendo la calificación máxima perfecta (20) en el examen final, la suma ponderada no alcanzará el mínimo aprobatorio requerido. En este caso, deberás verificar el reglamento de tu facultad para saber si calificas al examen sustitutorio o de aplazados.',
  },
  {
    question: '¿Cómo funciona el examen sustitutorio en la fórmula?',
    answer: 'En las instituciones donde aplica, el examen sustitutorio reemplaza la calificación más baja entre el examen parcial y el examen final. La fórmula se actualiza eliminando la nota más desfavorable e incorporando la nueva nota del sustitutorio con el peso de la evaluación reemplazada.',
  },
  {
    question: '¿Cómo influye la nota final en el Promedio Ponderado Semestral (PPS)?',
    answer: 'La nota final obtenida en cada curso se multiplica por el número de créditos de dicha asignatura. La suma de estos productos se divide entre el total de créditos matriculados en el ciclo para determinar el orden de mérito, tercio superior y becas.',
  },
];

const finalGradeFaqsEn: FAQItem[] = [
  {
    question: 'How is the required final exam score calculated?',
    answer: 'Each completed assignment score is multiplied by its weight and summed together. This cumulative score is subtracted from the minimum target passing grade. Finally, the remaining points needed are divided by the weight of the final exam.',
  },
  {
    question: 'Does a 0.5 decimal round up to the next integer?',
    answer: 'In many university grading regulations, standard arithmetic rounding (half-point rule) applies strictly to the official final course transcript grade, whereas intermediate assignment grades retain their exact decimal precision.',
  },
  {
    question: 'What does it mean if the calculator says I need over 100% or above scale maximum?',
    answer: 'It means that even with a perfect 100% or maximum possible score on the final exam, the accumulated points from prior coursework are not high enough to reach the passing threshold.',
  },
  {
    question: 'How do course credits factor into GPA calculation?',
    answer: 'Final course grades are multiplied by the credit hours of the respective course. The sum of these quality points is then divided by total credit hours taken to compute the semester GPA.',
  },
];

export const FinalGradePage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const faqs = isEn ? finalGradeFaqsEn : finalGradeFaqsEs;

  return (
    <ToolLayout
      category={isEn ? 'Academic' : 'Académico'}
      toolName={isEn ? 'Final Grade Calculator' : 'Calculadora de Nota Final'}
      seoTitle={isEn ? 'Final Grade Calculator (Scale 0-20 & Custom) - Calculando' : 'Calculadora de Nota Final Universitaria (Escala 0-20) - Calculando'}
      seoDescription={isEn ? 'Calculate the exact score needed on your final exam to pass the class. Step-by-step arithmetic breakdown, custom weights, and scale options.' : 'Calcula con precisión matemática cuánto necesitas sacar en tu examen final para aprobar tu curso en escala vigesimal (0-20). Desglose paso a paso y redondeo institucional.'}
      canonicalPath="/calculadora-nota-final"
      faqs={faqs}
    >
      <FinalGradeCalculator />

      <ToolEducationalSection
        badge={isEn ? 'Academic Guide & Methodology' : 'Marco Normativo y Metodología'}
        title={isEn ? 'How Final Course Grades are Calculated in Higher Education' : 'Cómo se calcula la Nota Final en el Sistema Universitario'}
        subtitle={isEn ? 'Understanding weighted evaluation structures, passing thresholds, and rounding mechanics.' : 'Explicación técnica del sistema vigesimal, ponderaciones porcentuales y reglas institucionales de aprobación.'}
        regulatoryFramework={{
          title: isEn ? 'Evaluation Weights and Official Regulations' : 'Sistema Vigesimal y Ley Universitaria N° 30220',
          description: isEn 
            ? 'In university and college courses, syllabi define evaluation weights that must total exactly 100%. Each assessment carries a specific portion of the overall grade.' 
            : 'En el sistema de educación superior del Perú (conforme a la Ley Universitaria N° 30220), la evaluación del aprendizaje se rige de forma general por la escala vigesimal (0 a 20), donde la nota mínima aprobatoria regular es 11 (u 10.5 con regla de redondeo al entero superior).',
          points: [
            isEn 
              ? 'Cumulative weighting: The sum of partial evaluations, labs, and final exam must equal 100%.' 
              : 'Ponderación acumulada: La suma de todas las prácticas, laboratorios, exámenes parciales y final debe sumar exactamente 100% de la carga del sílabo.',
            isEn
              ? 'Half-point rule (0.5): In many systems, half-point roundups apply only to the consolidated final transcript grade.'
              : 'Criterio de medio punto (0.5): La mayoría de universidades peruanas (URP, UNMSM, UNI, PUCP, UPC) aplican el redondeo al entero favorable exclusivamente en el acta final consolidada.',
            isEn
              ? 'Scale boundaries: Scores strictly bounded between 0 and 20; if required score exceeds 20, passing requires remedial examinations.'
              : 'Límites de escala: Si el despeje algebraico exige más de 20 puntos, el curso no puede aprobarse por la vía regular y requerirá sustitutorio o aplazados.',
          ],
        }}
        workedExample={{
          title: isEn ? 'Worked Real Example: 40% Final Exam Weight' : 'Caso de Estudio Resuelto: Examen Final con 40% de Peso',
          scenario: isEn
            ? 'Student scores: Midterm = 10 (Weight 30%), Continuous Labs = 13 (Weight 30%). Target grade: 11. Final Exam weight = 40%.'
            : 'Notas previas: Examen Parcial = 10 (Peso 30%), Prácticas Continuas = 13 (Peso 30%). Meta: Nota 11. Peso Examen Final = 40%.',
          steps: [
            {
              label: isEn ? 'Step 1 - Current Points' : 'Paso 1 - Puntos Acumulados',
              detail: '(10 × 0.30) + (13 × 0.30) = 3.0 + 3.9 = 6.9 puntos acumulados.',
            },
            {
              label: isEn ? 'Step 2 - Points Remaining' : 'Paso 2 - Puntos Faltantes',
              detail: '11.0 - 6.9 = 4.1 puntos requeridos sobre el total.',
            },
            {
              label: isEn ? 'Step 3 - Final Exam Target' : 'Paso 3 - Despeje sobre Examen Final',
              detail: '4.1 / 0.40 = 10.25 en el examen final.',
            },
          ],
          conclusion: isEn
            ? 'The student needs at least 10.25 (or 11 depending on rounding policy) on the final exam to secure a passing grade.'
            : 'El estudiante requiere una calificación mínima de 10.25 (o 11 si el examen no tiene decimales) para aprobar la materia.',
        }}
        faqs={faqs}
      />
    </ToolLayout>
  );
};

export default FinalGradePage;
