import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const baseHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(baseHtmlPath)) {
  console.error('dist/index.html not found! Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

const routes = [
  {
    path: '/',
    title: 'Calculando - Cálculos rápidos. Sin rodeos.',
    description: 'Suite web de herramientas de cálculo académico, financiero y de tiempo. 100% precisa, rápida y sin rodeos.',
    schemaType: 'SoftwareApplication',
    heading: 'Calculando - Cálculos matemáticos rápidos y sin rodeos técnicos',
    contentHtml: `
      <header>
        <h1>Calculando - Cálculos rápidos. Sin rodeos.</h1>
        <p>Suite web de herramientas de ingeniería, finanzas y cálculo académico con procesamiento 100% en tu navegador.</p>
      </header>
      <main>
        <h2>Herramientas destacadas:</h2>
        <ul>
          <li><a href="/calculadora-nota-final">Calculadora de Nota Final</a> - Cuánto necesitas sacar en el examen final para aprobar.</li>
          <li><a href="/promedio-ponderado-acumulado">Promedio Ponderado por Créditos</a> - Cálculo de PPS y PPA universitario.</li>
          <li><a href="/sumador-horas-minutos">Sumador y Restador de Horas</a> - Aritmética sexagesimal y conversión decimal.</li>
          <li><a href="/calculadora-igv-detracciones">Calculadora de IGV y Detracciones</a> - Base imponible, 18% IGV y tasas SPOT de SUNAT.</li>
          <li><a href="/calculadora-tea-tcea">Calculadora TEA / TCEA</a> - Simulación de cuotas bancarias en sistema francés.</li>
        </ul>
      </main>
    `,
  },
  {
    path: '/calculadora-nota-final',
    title: 'Calculadora de Nota Final Universitaria (Escala 0-20) - Calculando',
    description: 'Calcula con precisión matemática cuánto necesitas sacar en tu examen final para aprobar tu curso en escala vigesimal (0-20). Desglose paso a paso y redondeo institucional.',
    schemaType: 'MathSolver',
    heading: 'Calculadora de Nota Final Universitaria',
    contentHtml: `
      <article>
        <h1>Calculadora de Nota Final Universitaria (Escala 0-20)</h1>
        <p>Calcula con exactitud matemática el puntaje que requieres en tu examen final para aprobar la asignatura según el sílabo y la escala vigesimal peruana.</p>
        <section>
          <h2>Marco Normativo y Sistema Vigesimal</h2>
          <p>En el sistema universitario peruano (conforme a la Ley Universitaria N° 30220), la calificación de asignaturas se rige por la escala vigesimal (0 a 20), donde la nota mínima aprobatoria regular es 11 (u 10.5 en facultades con regla de redondeo favorable al estudiante).</p>
          <p>La suma ponderada de todas las evaluaciones (prácticas calificadas, laboratorios, talleres, examen parcial y examen final) debe equivaler estrictamente al 100% de la carga académica.</p>
        </section>
      </article>
    `,
    faqs: [
      {
        q: '¿Cómo se calcula cuánto necesito en el examen final?',
        a: 'Se multiplica cada nota obtenida por su peso porcentual correspondiente y se suman los resultados para obtener los puntos acumulados. Luego, esta suma se resta de la nota mínima aprobatoria. Finalmente, el puntaje restante se divide entre el porcentaje asignado al examen final.',
      },
      {
        q: '¿La nota 10.5 redondea a 11 en las universidades peruanas?',
        a: 'En la gran mayoría de universidades e institutos del Perú regulados por Sunedu, la fracción de 0.5 o superior favorece al alumno únicamente en el promedio final consolidado en actas.',
      },
    ],
  },
  {
    path: '/promedio-ponderado-acumulado',
    title: 'Calculadora de Promedio Ponderado por Créditos (PPA y PPS) - Calculando',
    description: 'Calcula con rigor tu Promedio Ponderado Semestral (PPS) y Acumulado (PPA) según créditos universitarios. Tabla interactiva, desglose formal y orden de mérito.',
    schemaType: 'MathSolver',
    heading: 'Calculadora de Promedio Ponderado por Créditos',
    contentHtml: `
      <article>
        <h1>Calculadora de Promedio Ponderado por Créditos (PPA y PPS)</h1>
        <p>Calcula tu promedio semestral y acumulado ponderando cada calificación por el valor de créditos de la asignatura conforme a la Ley Universitaria N° 30220.</p>
        <section>
          <h2>Créditos Universitarios y Orden de Mérito</h2>
          <p>El promedio ponderado multiplica la nota final de cada materia por su número de créditos, dividiendo la suma total de puntos entre el total de créditos matriculados.</p>
        </section>
      </article>
    `,
    faqs: [
      {
        q: '¿Cuál es la diferencia entre promedio simple y promedio ponderado?',
        a: 'El promedio ponderado toma en cuenta el peso crediticio de cada materia: un curso de 5 créditos impacta más en el récord que un electivo de 2 créditos.',
      },
    ],
  },
  {
    path: '/sumador-horas-minutos',
    title: 'Sumador y Restador de Horas y Minutos (Cálculo Sexagesimal) - Calculando',
    description: 'Suma y resta horas, minutos y segundos sexagesimales. Convierte a horas decimales para planillas laborales, horas extras y cálculo de hora de fin de turno.',
    schemaType: 'MathSolver',
    heading: 'Sumador y Restador de Horas y Minutos',
    contentHtml: `
      <article>
        <h1>Sumador y Restador de Horas y Minutos</h1>
        <p>Aritmética de tiempo sexagesimal (base 60) con conversión automática a horas decimales para liquidaciones laborales y cálculo de jornada de trabajo.</p>
        <section>
          <h2>Aritmética Sexagesimal y Planillas Laborales</h2>
          <p>30 minutos equivalen exactamente a 0.50 horas decimales. Sumar minutos como decimales directos distorsiona el cómputo de haberes en planillas.</p>
        </section>
      </article>
    `,
  },
  {
    path: '/calculadora-igv-detracciones',
    title: 'Calculadora de IGV 18% y Detracciones SUNAT (Perú) - Calculando',
    description: 'Calcula Base Imponible, 18% IGV y monto de detracción SPOT del Banco de la Nación para facturas en Perú. Desglose formal y tasas SUNAT vigentes.',
    schemaType: 'MathSolver',
    heading: 'Calculadora de IGV y Detracciones SUNAT',
    contentHtml: `
      <article>
        <h1>Calculadora de IGV 18% y Detracciones SUNAT (Perú)</h1>
        <p>Desglose instantáneo de Base Imponible, 18% IGV y retención del Sistema de Pago de Obligaciones Tributarias (SPOT) del Banco de la Nación.</p>
        <section>
          <h2>Normativa Tributaria: IGV y SPOT</h2>
          <p>Para desglosar el IGV del monto total se divide entre 1.18. La detracción aplica a servicios y contratos que superen el umbral legal de S/ 700 soles.</p>
        </section>
      </article>
    `,
  },
  {
    path: '/calculadora-tea-tcea',
    title: 'Calculadora TEA y Simulador de Préstamos TCEA (Perú) - Calculando',
    description: 'Simula cuotas mensuales de préstamos personales y bancarios en Perú (sistema francés). Convierte TEA a TEM, desglosa intereses, seguro de desgravamen y TCEA real.',
    schemaType: 'MathSolver',
    heading: 'Calculadora TEA / TCEA y Simulador de Préstamos',
    contentHtml: `
      <article>
        <h1>Calculadora TEA y Simulador de Préstamos TCEA (Perú)</h1>
        <p>Simulación de cuotas bancarias bajo el sistema de amortización francés, conversión exacta de TEA a TEM y proyección de seguro de desgravamen.</p>
        <section>
          <h2>Marco SBS: TEA vs TCEA</h2>
          <p>La Tasa Efectiva Mensual se calcula mediante la fórmula exponencial TEM = (1 + TEA)^(1/12) - 1. La TCEA representa el costo efectivo integral incluyendo seguros y comisiones.</p>
        </section>
      </article>
    `,
  },
  {
    path: '/sobre-nosotros',
    title: 'Sobre Nosotros - Calculando',
    description: 'Conoce Calculando: nuestra misión, compromiso con la privacidad absoluta sin recolección de datos, rigor matemático local y herramientas educativas.',
    schemaType: 'WebPage',
    heading: 'Sobre Calculando',
    contentHtml: `
      <article>
        <h1>Sobre Nosotros</h1>
        <p>Calculando es una suite web independiente de utilidades matemáticas, académicas y financieras con procesamiento en cliente sin recolección de datos personales.</p>
      </article>
    `,
  },
  {
    path: '/privacidad',
    title: 'Política de Privacidad y Cookies - Calculando',
    description: 'Política de privacidad de Calculando: procesamiento 100% local en tu navegador, sin recopilación de datos personales y divulgación de cookies de Google AdSense.',
    schemaType: 'WebPage',
    heading: 'Política de Privacidad',
    contentHtml: `
      <article>
        <h1>Política de Privacidad y Cookies</h1>
        <p>Procesamiento 100% local en tu navegador sin almacenamiento de variables ni datos personales en servidores. Información sobre cookies publicitarias de Google AdSense.</p>
      </article>
    `,
  },
  {
    path: '/terminos-condiciones',
    title: 'Términos y Condiciones de Uso - Calculando',
    description: 'Términos y condiciones de Calculando: herramientas matemáticas libres para uso educativo, descargo de responsabilidad y normas de uso.',
    schemaType: 'WebPage',
    heading: 'Términos y Condiciones',
    contentHtml: `
      <article>
        <h1>Términos y Condiciones de Uso</h1>
        <p>Condiciones generales de acceso, uso libre para fines educativos y exención de responsabilidad técnica de cálculos aritméticos.</p>
      </article>
    `,
  },
];

console.log('Generating pre-rendered static HTML files for all routes...');

for (const route of routes) {
  const canonicalUrl = `https://calculando.me${route.path === '/' ? '/' : route.path}`;

  // Replace Title
  let html = baseHtml.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);

  // Replace or Add Canonical
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
  if (html.includes('rel="canonical"')) {
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/i, canonicalTag);
  } else {
    html = html.replace('</head>', `  ${canonicalTag}\n</head>`);
  }

  // Replace Meta Description
  html = html.replace(
    /<meta name="description" content=".*?" \/>/i,
    `<meta name="description" content="${route.description}" />`
  );

  // Replace OpenGraph tags
  html = html.replace(
    /<meta property="og:title" content=".*?" \/>/i,
    `<meta property="og:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?" \/>/i,
    `<meta property="og:description" content="${route.description}" />`
  );
  html = html.replace(
    /<meta property="og:url" content=".*?" \/>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:title" content=".*?" \/>/i,
    `<meta name="twitter:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?" \/>/i,
    `<meta name="twitter:description" content="${route.description}" />`
  );

  // Inject Rich JSON-LD Schemas
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': route.schemaType,
      name: route.title,
      url: canonicalUrl,
      description: route.description,
      inLanguage: 'es-PE',
    },
  ];

  if (route.faqs && route.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: route.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    });
  }

  const schemaScript = `\n    <script type="application/ld+json">\n    ${JSON.stringify(schemas, null, 2)}\n    </script>\n`;
  html = html.replace('</head>', `${schemaScript}</head>`);

  // Inject fallback HTML in <div id="root">
  const preRenderContent = `<div id="root" class="min-h-full flex flex-col"><div class="sr-only" aria-hidden="true">${route.contentHtml}</div></div>`;
  html = html.replace('<div id="root" class="min-h-full flex flex-col"></div>', preRenderContent);

  // Write file
  if (route.path === '/') {
    fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf-8');
  } else {
    const routeDir = path.join(distDir, route.path.slice(1));
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf-8');
  }

  console.log(`✓ Pre-rendered: ${route.path} -> ${canonicalUrl}`);
}

console.log('Static pre-rendering complete successfully!');
