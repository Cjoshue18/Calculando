import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  schemaType?: 'MathSolver' | 'SoftwareApplication' | 'WebPage';
  faqs?: FAQItem[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath,
  schemaType = 'MathSolver',
  faqs = [],
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Update document title
    const fullTitle = title.includes('Calculando') ? title : `${title} - Calculando`;
    document.title = fullTitle;

    // 2. Canonical URL
    const domain = 'https://calculando.me';
    const targetPath = canonicalPath || location.pathname;
    const cleanPath = targetPath.endsWith('/') && targetPath.length > 1 ? targetPath.slice(0, -1) : targetPath;
    const fullCanonicalUrl = `${domain}${cleanPath}`;

    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // 3. Meta Description
    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // 4. Open Graph Tags
    const updateOrCreateMeta = (property: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOrCreateMeta('og:title', fullTitle);
    updateOrCreateMeta('og:description', description);
    updateOrCreateMeta('og:url', fullCanonicalUrl);

    // 5. Twitter Meta Tags
    const updateOrCreateTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOrCreateTwitterMeta('twitter:title', fullTitle);
    updateOrCreateTwitterMeta('twitter:description', description);
    updateOrCreateTwitterMeta('twitter:url', fullCanonicalUrl);

    // 6. JSON-LD Dynamic Schema Injection
    const schemaScriptId = 'dynamic-seo-schema';
    let scriptTag = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaScriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemas: unknown[] = [
      {
        '@context': 'https://schema.org',
        '@type': schemaType,
        name: title,
        url: fullCanonicalUrl,
        description: description,
        inLanguage: 'es-PE',
        applicationCategory: 'EducationalApplication, UtilitiesApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ];

    if (faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }

    scriptTag.textContent = JSON.stringify(schemas);

    return () => {
      // Clean up dynamic schema if needed
    };
  }, [title, description, canonicalPath, location.pathname, schemaType, faqs]);

  return null;
};
