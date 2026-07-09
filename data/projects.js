/* ──────────────────────────────────────────────────────────────
   Datos de proyectos con contenido localizado (es · en · it · fr · pt).

   Los campos de texto orientados al lector se escriben como objetos
   { es, en, it, fr, pt }. Los nombres propios y datos técnicos
   (title, technologies, palette, colores, year…) se dejan como string.

   localize(node, lang) resuelve recursivamente cualquier estructura
   al idioma pedido, con español como fallback.

   `highlights`: etiquetas cortas para el mosaico/bento de cada proyecto.
   ────────────────────────────────────────────────────────────── */

const LANGS = ['es', 'en', 'it', 'fr', 'pt']

function isLocalized(v) {
  return v && typeof v === 'object' && !Array.isArray(v) && typeof v.es !== 'undefined'
}

export function localize(node, lang) {
  if (Array.isArray(node)) return node.map((n) => localize(n, lang))
  if (isLocalized(node)) return node[lang] ?? node.es
  if (node && typeof node === 'object') {
    const out = {}
    for (const k in node) out[k] = localize(node[k], lang)
    return out
  }
  return node
}

/* tag corto reutilizable */
const T = {
  security:   { es: 'Seguridad',      en: 'Security',       it: 'Sicurezza',       fr: 'Sécurité',        pt: 'Segurança' },
  automation: { es: 'Automatización', en: 'Automation',     it: 'Automazione',     fr: 'Automatisation',  pt: 'Automação' },
  desktop:    { es: 'Escritorio',     en: 'Desktop',        it: 'Desktop',         fr: 'Bureau',          pt: 'Desktop' },
  observ:     { es: 'Observabilidad', en: 'Observability',  it: 'Osservabilità',   fr: 'Observabilité',   pt: 'Observabilidade' },
}

export const featuredProjects = [
  {
    id: 'god',
    slug: 'god',
    title: 'GOD',
    subtitle: {
      es: 'Gateway Ops Dashboard — Manejo avanzado de Broadcom API Gateways',
      en: 'Gateway Ops Dashboard — Advanced Broadcom API Gateway management',
      it: 'Gateway Ops Dashboard — Gestione avanzata dei Broadcom API Gateway',
      fr: 'Gateway Ops Dashboard — Gestion avancée des Broadcom API Gateway',
      pt: 'Gateway Ops Dashboard — Gestão avançada de Broadcom API Gateways',
    },
    description: {
      es: 'Aplicación de escritorio para operaciones en Broadcom (Layer7) API Gateway: gestiona APIs, usuarios y cluster-properties desde una interfaz rápida, intuitiva y ágil.',
      en: 'Desktop application for Broadcom (Layer7) API Gateway operations: manage APIs, users and cluster-properties from a fast, intuitive and agile interface.',
      it: "Applicazione desktop per operazioni su Broadcom (Layer7) API Gateway: gestisci API, utenti e cluster-properties da un'interfaccia rapida, intuitiva e agile.",
      fr: "Application de bureau pour les opérations sur Broadcom (Layer7) API Gateway : gérez les API, les utilisateurs et les cluster-properties depuis une interface rapide, intuitive et agile.",
      pt: 'Aplicação de desktop para operações em Broadcom (Layer7) API Gateway: gere APIs, utilizadores e cluster-properties a partir de uma interface rápida, intuitiva e ágil.',
    },
    tags: ['Flutter', 'Dart', 'Broadcom', T.desktop],
    year: '2026',
    color: '#A8E6C1',
    colorDark: '#2D6A4F',
    operatingSystem: 'Windows, macOS, Linux',
    highlights: ['APIs', 'Usuarios', 'Cluster-Properties', 'Graphman', 'RestMan', 'mTLS'],
    role: {
      es: 'Desarrollador',
      en: 'Developer',
      it: 'Sviluppatore',
      fr: 'Développeur',
      pt: 'Desenvolvedor',
    },
    overview: {
      es: 'GOD (Gateway Ops Dashboard) es una herramienta de escritorio construida en Flutter para operar entornos empresariales sobre Broadcom API Gateway (Layer7). Centraliza la operación de múltiples gateways —listar y modificar APIs, gestionar usuarios y cluster-properties, revisar políticas— con una arquitectura modular y doble protocolo: usa Graphman cuando el gateway lo tiene habilitado y RestMan como alternativa universal. Soporta mTLS y Basic Auth de forma ortogonal y prueba de conexión por gateway.',
      en: 'GOD (Gateway Ops Dashboard) is a desktop tool built in Flutter to operate enterprise environments on Broadcom API Gateway (Layer7). It centralizes the operation of multiple gateways —listing and modifying APIs, managing users and cluster-properties, reviewing policies— with a modular architecture and dual protocol: it uses Graphman when the gateway has it enabled and RestMan as a universal fallback. It supports mTLS and Basic Auth orthogonally and per-gateway connection testing.',
      it: "GOD (Gateway Ops Dashboard) è uno strumento desktop costruito in Flutter per operare ambienti aziendali su Broadcom API Gateway (Layer7). Centralizza la gestione di più gateway —elencare e modificare API, gestire utenti e cluster-properties, rivedere policy— con architettura modulare e doppio protocollo: usa Graphman quando il gateway lo ha abilitato e RestMan come alternativa universale. Supporta mTLS e Basic Auth in modo ortogonale e il test di connessione per gateway.",
      fr: "GOD (Gateway Ops Dashboard) est un outil de bureau construit en Flutter pour opérer des environnements d'entreprise sur Broadcom API Gateway (Layer7). Il centralise l'exploitation de plusieurs gateways —lister et modifier des API, gérer les utilisateurs et les cluster-properties, réviser les politiques— avec une architecture modulaire et un double protocole : Graphman quand le gateway l'active et RestMan comme alternative universelle. Il prend en charge mTLS et Basic Auth de façon orthogonale ainsi que le test de connexion par gateway.",
      pt: 'GOD (Gateway Ops Dashboard) é uma ferramenta de desktop construída em Flutter para operar ambientes empresariais sobre Broadcom API Gateway (Layer7). Centraliza a operação de múltiplos gateways —listar e modificar APIs, gerir utilizadores e cluster-properties, rever políticas— com arquitetura modular e duplo protocolo: usa Graphman quando o gateway o tem ativado e RestMan como alternativa universal. Suporta mTLS e Basic Auth de forma ortogonal e teste de ligação por gateway.',
    },
    features: {
      es: ['Gestión de APIs y servicios publicados', 'Administración de usuarios e identidades', 'Doble protocolo: Graphman (GraphQL) y RestMan (REST/XML)', 'Conmutación y prueba de conexión entre gateways', 'Autenticación mTLS y Basic Auth', 'Arquitectura modular y multiplataforma'],
      en: ['Management of APIs and published services', 'User and identity administration', 'Dual protocol: Graphman (GraphQL) and RestMan (REST/XML)', 'Switching and connection testing across gateways', 'mTLS and Basic Auth authentication', 'Modular, cross-platform architecture'],
      it: ['Gestione di API e servizi pubblicati', 'Amministrazione di utenti e identità', 'Doppio protocollo: Graphman (GraphQL) e RestMan (REST/XML)', 'Commutazione e test di connessione tra gateway', 'Autenticazione mTLS e Basic Auth', 'Architettura modulare e multipiattaforma'],
      fr: ['Gestion des API et services publiés', 'Administration des utilisateurs et identités', 'Double protocole : Graphman (GraphQL) et RestMan (REST/XML)', 'Bascule et test de connexion entre gateways', 'Authentification mTLS et Basic Auth', 'Architecture modulaire et multiplateforme'],
      pt: ['Gestão de APIs e serviços publicados', 'Administração de utilizadores e identidades', 'Duplo protocolo: Graphman (GraphQL) e RestMan (REST/XML)', 'Comutação e teste de ligação entre gateways', 'Autenticação mTLS e Basic Auth', 'Arquitetura modular e multiplataforma'],
    },
    technologies: ['Flutter', 'Dart', 'GraphQL', 'REST', 'Layer7 API Gateway', 'Material Design'],
    palette: ['#1A1A1A', '#A8E6C1', '#2D6A4F', '#F0FAF4'],
    typography: ['Gilroy', 'Inter'],
    github: null,
    private: true,
  },

  {
    id: 'reccon',
    slug: 'reccon',
    title: 'Reccon',
    subtitle: {
      es: 'Observabilidad cloud-native — APIs y microservicios en Kubernetes',
      en: 'Cloud-native observability — APIs and microservices on Kubernetes',
      it: 'Osservabilità cloud-native — API e microservizi su Kubernetes',
      fr: 'Observabilité cloud-native — API et microservices sur Kubernetes',
      pt: 'Observabilidade cloud-native — APIs e microsserviços no Kubernetes',
    },
    description: {
      es: 'Agente en Go que monitorea miles de microservicios y APIs en Kubernetes. Observa la salud de microservicios y APIs en gateways a través de la API de Kubernetes, publicando métricas y alertas normalizadas hacia Zabbix.',
      en: 'Go agent that monitors thousands of microservices and APIs on Kubernetes. It observes the health of microservices and APIs on gateways through the Kubernetes API, publishing normalized metrics and alerts to Zabbix.',
      it: 'Agente in Go che monitora migliaia di microservizi e API su Kubernetes. Osserva la salute di microservizi e API sui gateway tramite la Kubernetes API, pubblicando metriche e alert normalizzati verso Zabbix.',
      fr: "Agent en Go qui surveille des milliers de microservices et API sur Kubernetes. Il observe la santé des microservices et API sur les gateways via l'API Kubernetes, en publiant des métriques et alertes normalisées vers Zabbix.",
      pt: 'Agente em Go que monitora milhares de microsserviços e APIs no Kubernetes. Observa a saúde de microsserviços e APIs em gateways através da API do Kubernetes, publicando métricas e alertas normalizados para o Zabbix.',
    },
    tags: ['Go', 'Kubernetes', T.observ, 'Zabbix'],
    year: '2026',
    color: '#6366F1',
    colorDark: '#4F46E5',
    operatingSystem: 'Kubernetes, Linux',
    highlights: ['Kubernetes', 'Informers', 'Sharding', 'Zabbix', 'OpenTelemetry', 'Distroless'],
    role: {
      es: 'Desarrollador & Arquitecto',
      en: 'Developer & Architect',
      it: 'Sviluppatore & Architetto',
      fr: 'Développeur & Architecte',
      pt: 'Desenvolvedor & Arquiteto',
    },
    overview: {
      es: 'Reccon es una plataforma de observabilidad cloud-native escrita en Go, diseñada para vigilar entre 6.000 y 7.000 microservicios y APIs distribuidos en múltiples namespaces de Kubernetes. Su módulo de microservicios usa Informers de client-go (watch streaming, sin polling) para seguir replicas, reinicios, OOMKilled y disponibilidad por Deployment, y reparte la carga mediante sharding por hash de namespace en un StatefulSet. Se distribuye como un único binario distroless de mínima superficie de ataque y envía sus métricas y triggers a Zabbix mediante token.',
      en: 'Reccon is a cloud-native observability platform written in Go, designed to watch between 6,000 and 7,000 microservices and APIs spread across multiple Kubernetes namespaces. Its microservices module uses client-go Informers (watch streaming, no polling) to track replicas, restarts, OOMKilled and availability per Deployment, and spreads the load through namespace-hash sharding on a StatefulSet. It ships as a single distroless binary with minimal attack surface and sends its metrics and triggers to Zabbix via token.',
      it: 'Reccon è una piattaforma di osservabilità cloud-native scritta in Go, progettata per sorvegliare tra 6.000 e 7.000 microservizi e API distribuiti su più namespace Kubernetes. Il suo modulo microservizi usa Informers di client-go (watch streaming, senza polling) per seguire replicas, restart, OOMKilled e disponibilità per Deployment, e distribuisce il carico tramite sharding per hash di namespace su uno StatefulSet. Viene distribuito come singolo binario distroless con superficie di attacco minima e invia metriche e trigger a Zabbix tramite token.',
      fr: "Reccon est une plateforme d'observabilité cloud-native écrite en Go, conçue pour surveiller entre 6 000 et 7 000 microservices et API répartis sur plusieurs namespaces Kubernetes. Son module microservices utilise les Informers de client-go (watch streaming, sans polling) pour suivre replicas, redémarrages, OOMKilled et disponibilité par Deployment, et répartit la charge via un sharding par hash de namespace sur un StatefulSet. Il est distribué comme un binaire distroless unique à surface d'attaque minimale et envoie ses métriques et triggers vers Zabbix par token.",
      pt: 'Reccon é uma plataforma de observabilidade cloud-native escrita em Go, desenhada para vigiar entre 6.000 e 7.000 microsserviços e APIs distribuídos em múltiplos namespaces de Kubernetes. O seu módulo de microsserviços usa Informers do client-go (watch streaming, sem polling) para seguir replicas, reinícios, OOMKilled e disponibilidade por Deployment, e distribui a carga através de sharding por hash de namespace num StatefulSet. É distribuído como um único binário distroless de mínima superfície de ataque e envia as suas métricas e triggers para o Zabbix via token.',
    },
    features: {
      es: ['Monitoreo por Deployment (no por pod) de ~7.000 servicios', 'Informers de Kubernetes con watch streaming (sin polling)', 'Sharding por hash de namespace en StatefulSet', 'Métricas: replicas, reinicios, OOMKilled, disponibilidad', 'Alertas y triggers hacia Zabbix vía token', 'Binario único distroless de mínima superficie de ataque'],
      en: ['Per-Deployment monitoring (not per pod) of ~7,000 services', 'Kubernetes Informers with watch streaming (no polling)', 'Namespace-hash sharding on a StatefulSet', 'Metrics: replicas, restarts, OOMKilled, availability', 'Alerts and triggers to Zabbix via token', 'Single distroless binary with minimal attack surface'],
      it: ['Monitoraggio per Deployment (non per pod) di ~7.000 servizi', 'Informers di Kubernetes con watch streaming (senza polling)', 'Sharding per hash di namespace su uno StatefulSet', 'Metriche: replicas, restart, OOMKilled, disponibilità', 'Alert e trigger verso Zabbix tramite token', 'Singolo binario distroless con superficie di attacco minima'],
      fr: ['Surveillance par Deployment (pas par pod) de ~7 000 services', 'Informers Kubernetes avec watch streaming (sans polling)', 'Sharding par hash de namespace sur un StatefulSet', 'Métriques : replicas, redémarrages, OOMKilled, disponibilité', 'Alertes et triggers vers Zabbix par token', 'Binaire distroless unique à surface d\'attaque minimale'],
      pt: ['Monitoramento por Deployment (não por pod) de ~7.000 serviços', 'Informers do Kubernetes com watch streaming (sem polling)', 'Sharding por hash de namespace num StatefulSet', 'Métricas: replicas, reinícios, OOMKilled, disponibilidade', 'Alertas e triggers para o Zabbix via token', 'Binário único distroless de mínima superfície de ataque'],
    },
    technologies: ['Go', 'Kubernetes', 'client-go', 'Informers', 'Zabbix', 'OpenTelemetry', 'Docker', 'Azure AKS'],
    palette: ['#090A0F', '#6366F1', '#10B981', '#F3F4F6'],
    typography: ['Inter', 'JetBrains Mono'],
    github: null,
    private: true,
  },

  /* ── Capacidad (no proyecto): desarrollo web/app. Sin detalle, sin citar clientes. ── */
  {
    id: 'web-dev',
    capability: true,
    slug: null,
    title: {
      es: 'Desarrollo Web & Apps',
      en: 'Web & App Development',
      it: 'Sviluppo Web & App',
      fr: 'Développement Web & Apps',
      pt: 'Desenvolvimento Web & Apps',
    },
    subtitle: {
      es: 'Aplicaciones a medida — full-stack',
      en: 'Custom applications — full-stack',
      it: 'Applicazioni su misura — full-stack',
      fr: 'Applications sur mesure — full-stack',
      pt: 'Aplicações à medida — full-stack',
    },
    description: {
      es: 'Diseño y construyo aplicaciones web y de escritorio a medida: paneles de administración, sistemas POS, APIs e integraciones y automatización de procesos. Full-stack con React, Node.js, TypeScript y Flutter, con foco en rendimiento, seguridad y una UX limpia.',
      en: 'I design and build custom web and desktop applications: admin panels, POS systems, APIs and integrations, and process automation. Full-stack with React, Node.js, TypeScript and Flutter, focused on performance, security and clean UX.',
      it: 'Progetto e costruisco applicazioni web e desktop su misura: pannelli di amministrazione, sistemi POS, API e integrazioni e automazione dei processi. Full-stack con React, Node.js, TypeScript e Flutter, con focus su performance, sicurezza e UX pulita.',
      fr: "Je conçois et développe des applications web et de bureau sur mesure : panneaux d'administration, systèmes POS, API et intégrations, et automatisation des processus. Full-stack avec React, Node.js, TypeScript et Flutter, axé sur la performance, la sécurité et une UX soignée.",
      pt: 'Desenho e construo aplicações web e de desktop à medida: painéis de administração, sistemas POS, APIs e integrações e automação de processos. Full-stack com React, Node.js, TypeScript e Flutter, com foco em desempenho, segurança e uma UX limpa.',
    },
    tags: ['React', 'Node.js', 'TypeScript', 'Flutter'],
    color: '#40916C',
    colorDark: '#1B4332',
    highlights: ['React', 'Node.js', 'TypeScript', 'Flutter', 'Sistemas POS', 'Automatización', 'APIs', 'Paneles admin'],
    cta: 'mailto:marcosrodriguezmerlo@gmail.com',
  },
]

/* Compat: ya no hay sección "Más proyectos" */
export const moreProjects = []

/* Slugs con página de detalle (tienen overview localizado): solo GOD y Reccon */
export const detailProjects = featuredProjects.filter((p) => p.slug && p.overview)

export function getProjectBySlug(slug) {
  return detailProjects.find((p) => p.slug === slug) || null
}
