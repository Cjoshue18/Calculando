import React from 'react';
import { 
  GraduationCap, 
  Clock, 
  Landmark, 
  Receipt, 
  Layers, 
  Code2 
} from 'lucide-react';

export type ToolCategory = 'all' | 'academic' | 'finance' | 'time' | 'dev';

export interface ToolMetadata {
  id: string;
  slug: string;
  nameKey: string;
  defaultNameEs: string;
  defaultNameEn: string;
  descriptionKey: string;
  defaultDescriptionEs: string;
  defaultDescriptionEn: string;
  category: ToolCategory;
  icon: React.ComponentType<{ className?: string }>;
  isAvailable: boolean;
  badge?: string;
  badgeEn?: string;
  keywords: string[];
}

export const toolRegistry: ToolMetadata[] = [
  {
    id: 'final-grade',
    slug: '/calculadora-nota-final',
    nameKey: 'finalGrade.title',
    defaultNameEs: 'Calculadora de Nota Final',
    defaultNameEn: 'Final Grade Calculator',
    descriptionKey: 'finalGrade.description',
    defaultDescriptionEs: 'Calcula con precisión cuánto necesitas sacar en el examen final para aprobar.',
    defaultDescriptionEn: 'Calculate the exact score needed on your final exam to pass the course.',
    category: 'academic',
    icon: GraduationCap,
    isAvailable: true,
    badge: 'Popular',
    badgeEn: 'Popular',
    keywords: ['nota', 'promedio', 'examen final', 'universidad', 'urp', 'grade', 'passing'],
  },
  {
    id: 'gpa-calculator',
    slug: '/promedio-ponderado-acumulado',
    nameKey: 'gpa.title',
    defaultNameEs: 'Promedio Ponderado por Créditos',
    defaultNameEn: 'GPA Weighted Average Calculator',
    descriptionKey: 'gpa.description',
    defaultDescriptionEs: 'Cálculo de promedio semestral y acumulado considerando créditos de cada curso.',
    defaultDescriptionEn: 'Calculate your semester and cumulative GPA weighted by course credits.',
    category: 'academic',
    icon: Layers,
    isAvailable: true,
    badge: 'Nuevo',
    badgeEn: 'New',
    keywords: ['gpa', 'creditos', 'ponderado', 'semestre', 'cursos', 'promedio'],
  },
  {
    id: 'hours-adder',
    slug: '/sumador-horas-minutos',
    nameKey: 'hours.title',
    defaultNameEs: 'Sumador y Restador de Horas',
    defaultNameEn: 'Hours and Minutes Calculator',
    descriptionKey: 'hours.description',
    defaultDescriptionEs: 'Operaciones sexagesimales precisas con duraciones de tiempo y horas de reloj.',
    defaultDescriptionEn: 'Sexagesimal math operations for time durations and clock finish times.',
    category: 'time',
    icon: Clock,
    isAvailable: true,
    badge: 'Nuevo',
    badgeEn: 'New',
    keywords: ['tiempo', 'horas', 'minutos', 'reloj', 'duracion'],
  },
  {
    id: 'tea-simulator',
    slug: '/calculadora-tea-tcea',
    nameKey: 'tea.title',
    defaultNameEs: 'Calculadora TEA / TCEA / TREA',
    defaultNameEn: 'TEA / TCEA Loan Simulator',
    descriptionKey: 'tea.description',
    defaultDescriptionEs: 'Simula cuotas bancarias en soles/dólares, seguro de desgravamen y cronograma.',
    defaultDescriptionEn: 'Simulate loan payments, insurance fees, and amortization schedules.',
    category: 'finance',
    icon: Landmark,
    isAvailable: false,
    keywords: ['prestamo', 'tea', 'tcea', 'banco', 'bcp', 'interbank', 'interes'],
  },
  {
    id: 'igv-calculator',
    slug: '/calculadora-igv-detracciones',
    nameKey: 'igv.title',
    defaultNameEs: 'Calculadora de IGV y Detracciones',
    defaultNameEn: 'Peru IGV 18% & Detractions',
    descriptionKey: 'igv.description',
    defaultDescriptionEs: 'Desglose instantáneo de Base Imponible + 18% IGV y porcentaje de detracción Sunat.',
    defaultDescriptionEn: 'Instant breakdown of taxable amount + 18% IGV and Sunat detraction withholdings.',
    category: 'finance',
    icon: Receipt,
    isAvailable: false,
    keywords: ['igv', 'sunat', 'detraccion', 'factura', 'impuestos', 'peru'],
  },
  {
    id: 'mock-generator',
    slug: '/generador-datos-mock',
    nameKey: 'mock.title',
    defaultNameEs: 'Dynamic Mock Data Generator',
    defaultNameEn: 'Dynamic Mock Data Generator',
    descriptionKey: 'mock.description',
    defaultDescriptionEs: 'Generador de esquemas JSON/SQL y datos de prueba masivos en streaming.',
    defaultDescriptionEn: 'Generate JSON/SQL schemas and test mock data with streaming.',
    category: 'dev',
    icon: Code2,
    isAvailable: false,
    keywords: ['mock', 'json', 'sql', 'database', 'c#', 'api'],
  },
];
