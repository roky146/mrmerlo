/* ──────────────────────────────────────────────────────────────
   Configuración central de SEO / GEO / LLMO.
   Fuente única de verdad para metadatos y datos estructurados (JSON-LD).
   Todo el contenido se deriva del portafolio real — nada inventado.
   ────────────────────────────────────────────────────────────── */

export const SITE = {
  url: 'https://mrmerlo.com',
  name: 'mrmerlo.com',
  authorName: 'Marcos Rodríguez Merlo',
  email: 'marcosrodriguezmerlo@gmail.com',
  twitter: '@roky146',
  locale: 'es_DO',
  lang: 'es',
  // Descripción canónica reutilizada en meta + schema
  description:
    'Marcos Rodríguez Merlo — Ingeniero de Producción TI, estudiante de Ciberseguridad y desarrollador con sede en Santo Domingo, RD.',
  image: 'https://mrmerlo.com/og-image.svg',
  sameAs: [
    'https://github.com/roky146',
    'https://x.com/roky146',
    'https://www.linkedin.com/in/marcos-rodríguez-merlo-367569224',
  ],
  // Áreas de conocimiento — alimentan Person.knowsAbout (clave para GEO/LLMO)
  knowsAbout: [
    'Ingeniería de Infraestructura TI',
    'Ingeniería en Ciberseguridad',
    'Automatización empresarial',
    'Desarrollo de software full-stack',
    'Kubernetes',
    'Observabilidad y monitoreo',
    'React',
    'Node.js',
    'TypeScript',
    'Go',
    'Flutter',
    'Sistemas POS',
    'Layer7 API Gateway',
    'APIs REST y GraphQL',
    'Consultoría tecnológica',
  ],
}

/* Datos de contacto (fuente única) */
export const CONTACT = {
  email: 'marcosrodriguezmerlo@gmail.com',
  mailto: 'mailto:marcosrodriguezmerlo@gmail.com',
  phone: '+1 829 587 0648',
  tel: 'tel:+18295870648',
  whatsapp: 'https://wa.me/18295870648',
}

const abs = (path = '/') => (path === '/' ? SITE.url : `${SITE.url}${path}`)

/* ── Person (identidad canónica — referenciada por @id en todo el grafo) ── */
export function personSchema() {
  return {
    '@type': 'Person',
    '@id': `${SITE.url}/#person`,
    name: SITE.authorName,
    alternateName: 'Marcos Rodríguez',
    url: SITE.url,
    image: SITE.image,
    email: `mailto:${SITE.email}`,
    jobTitle: ['Ingeniero de Producción TI', 'Desarrollador de software'],
    description: SITE.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Santo Domingo',
      addressCountry: 'DO',
    },
    knowsAbout: SITE.knowsAbout,
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Universidad del Caribe (UNICARIBE)' },
      { '@type': 'EducationalOrganization', name: 'INFOTEP' },
    ],
    sameAs: SITE.sameAs,
  }
}

/* ── WebSite ── */
export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.lang,
    publisher: { '@id': `${SITE.url}/#person` },
    author: { '@id': `${SITE.url}/#person` },
  }
}

/* ── ProfilePage (home = perfil profesional) ── */
export function profilePageSchema() {
  return {
    '@type': 'ProfilePage',
    '@id': `${SITE.url}/#profilepage`,
    url: SITE.url,
    name: `${SITE.authorName} — Portafolio`,
    inLanguage: SITE.lang,
    isPartOf: { '@id': `${SITE.url}/#website` },
    mainEntity: { '@id': `${SITE.url}/#person` },
  }
}

/* ── Servicio de desarrollo web/app (capacidad, no proyecto) ── */
export function webDevServiceSchema() {
  return {
    '@type': 'Service',
    '@id': `${SITE.url}/#servicio-desarrollo`,
    serviceType: 'Desarrollo de software y aplicaciones web',
    name: 'Desarrollo web y de aplicaciones',
    description:
      'Desarrollo de aplicaciones web y a medida full-stack: paneles de administración, sistemas POS, APIs y automatización, con React, Node.js, TypeScript y Flutter.',
    provider: { '@id': `${SITE.url}/#person` },
    areaServed: { '@type': 'Country', name: 'República Dominicana' },
    availableLanguage: ['es', 'en'],
  }
}

/* ── Proyecto de software (GOD, Reccon) ──
   value: proyecto ya localizado (strings resueltos) + path canónico. */
export function projectSchema(p, path) {
  return {
    '@type': ['SoftwareApplication', 'SoftwareSourceCode'],
    '@id': `${abs(path)}#software`,
    name: p.title,
    alternateName: p.subtitle,
    url: abs(path),
    description: p.overview || p.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: p.operatingSystem || 'Cross-platform',
    programmingLanguage: p.technologies,
    keywords: [...(p.tags || []), ...(p.technologies || [])].join(', '),
    inLanguage: SITE.lang,
    author: { '@id': `${SITE.url}/#person` },
    creator: { '@id': `${SITE.url}/#person` },
    isPartOf: { '@id': `${SITE.url}/#website` },
    mainEntityOfPage: abs(path),
    ...(p.github ? { codeRepository: p.github } : {}),
  }
}

/* ── Breadcrumbs ── */
export function breadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  }
}

/* ── FAQPage (deriva de contenido real; potencia respuestas de LLMs) ── */
export function faqSchema(faqs) {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE.url}/about#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

/* Envuelve varios nodos en un @graph con @context único */
export function graph(...nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) }
}
