/* ──────────────────────────────────────────────────────────────
   Datos de proyectos con contenido localizado (es · en · it · fr · pt).

   Los campos de texto orientados al lector se escriben como objetos
   { es, en, it, fr, pt }. Los nombres propios y datos técnicos
   (title, technologies, palette, colores, year…) se dejan como string.

   localize(node, lang) resuelve recursivamente cualquier estructura
   (objeto de proyecto, array de tags, features…) al idioma pedido,
   con español como fallback.
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
  analysis:   { es: 'Análisis',       en: 'Analysis',       it: 'Analisi',         fr: 'Analyse',         pt: 'Análise' },
}

export const featuredProjects = [
  {
    id: 'yukikun-pos',
    slug: 'yukikun-pos',
    title: 'Yukikun POS',
    subtitle: {
      es: 'Plataforma POS — Restaurante de sushi full-stack',
      en: 'POS Platform — Full-stack sushi restaurant',
      it: 'Piattaforma POS — Ristorante di sushi full-stack',
      fr: 'Plateforme POS — Restaurant de sushi full-stack',
      pt: 'Plataforma POS — Restaurante de sushi full-stack',
    },
    description: {
      es: 'Sistema POS completo para un negocio de sushi con cuatro interfaces en tiempo real: Admin, Camarero, Cocina (KDS) y Menú público. Monorepo TypeScript con Node.js + Fastify y React 18.',
      en: 'Complete POS system for a sushi business with four real-time interfaces: Admin, Waiter, Kitchen (KDS) and public Menu. TypeScript monorepo with Node.js + Fastify and React 18.',
      it: 'Sistema POS completo per un ristorante di sushi con quattro interfacce in tempo reale: Admin, Cameriere, Cucina (KDS) e Menù pubblico. Monorepo TypeScript con Node.js + Fastify e React 18.',
      fr: 'Système POS complet pour un restaurant de sushi avec quatre interfaces en temps réel : Admin, Serveur, Cuisine (KDS) et Menu public. Monorepo TypeScript avec Node.js + Fastify et React 18.',
      pt: 'Sistema POS completo para um negócio de sushi com quatro interfaces em tempo real: Admin, Garçom, Cozinha (KDS) e Menu público. Monorepo TypeScript com Node.js + Fastify e React 18.',
    },
    tags: ['TypeScript', 'Node.js', 'React', 'Socket.io', 'PWA'],
    year: '2025',
    color: '#52B788',
    colorDark: '#1B4332',
    role: {
      es: 'Desarrollador Full-Stack',
      en: 'Full-Stack Developer',
      it: 'Sviluppatore Full-Stack',
      fr: 'Développeur Full-Stack',
      pt: 'Desenvolvedor Full-Stack',
    },
    overview: {
      es: 'Yukikun POS es una plataforma de operaciones completa para un negocio de sushi con modalidades de salón, para llevar, delivery y menú web público. Construida como monorepo (pnpm workspaces) con TypeScript en toda la stack, ofrece comunicación en tiempo real vía Socket.io entre el panel de admin, las pantallas de camarero, la cocina KDS y el menú del cliente. Incluye gestión de mesas con floor plan drag & drop, arqueo de turnos de caja, analytics, impresión térmica ESC/POS y estructura lista para facturación electrónica.',
      en: 'Yukikun POS is a complete operations platform for a sushi business with dine-in, takeout, delivery and public web menu. Built as a monorepo (pnpm workspaces) with TypeScript across the whole stack, it provides real-time communication via Socket.io between the admin panel, waiter screens, the KDS kitchen and the customer menu. It includes table management with a drag & drop floor plan, cash-shift reconciliation, analytics, ESC/POS thermal printing and a structure ready for electronic invoicing.',
      it: 'Yukikun POS è una piattaforma operativa completa per un ristorante di sushi con servizio al tavolo, asporto, delivery e menù web pubblico. Costruita come monorepo (pnpm workspaces) con TypeScript su tutto lo stack, offre comunicazione in tempo reale via Socket.io tra il pannello admin, le schermate del cameriere, la cucina KDS e il menù del cliente. Include gestione dei tavoli con floor plan drag & drop, riconciliazione dei turni di cassa, analytics, stampa termica ESC/POS e una struttura pronta per la fatturazione elettronica.',
      fr: "Yukikun POS est une plateforme d'opérations complète pour un restaurant de sushi avec service sur place, à emporter, livraison et menu web public. Conçue comme un monorepo (pnpm workspaces) avec TypeScript sur toute la stack, elle offre une communication en temps réel via Socket.io entre le panneau d'admin, les écrans serveur, la cuisine KDS et le menu client. Elle inclut la gestion des tables avec un plan de salle drag & drop, le rapprochement des caisses, des analytics, l'impression thermique ESC/POS et une structure prête pour la facturation électronique.",
      pt: 'Yukikun POS é uma plataforma de operações completa para um negócio de sushi com salão, para viagem, delivery e menu web público. Construída como monorepo (pnpm workspaces) com TypeScript em toda a stack, oferece comunicação em tempo real via Socket.io entre o painel de admin, as telas de garçom, a cozinha KDS e o menu do cliente. Inclui gestão de mesas com floor plan drag & drop, fechamento de turnos de caixa, analytics, impressão térmica ESC/POS e estrutura pronta para faturação eletrónica.',
    },
    features: {
      es: ['4 interfaces en tiempo real (Admin, Camarero, Cocina, Menú)', 'Floor plan interactivo con drag & drop de mesas', 'Pedidos en tiempo real vía Socket.io', 'Gestión de turnos de caja con arqueo', 'Analytics y reportes avanzados', 'Impresión térmica ESC/POS'],
      en: ['4 real-time interfaces (Admin, Waiter, Kitchen, Menu)', 'Interactive floor plan with drag & drop tables', 'Real-time orders via Socket.io', 'Cash-shift management with reconciliation', 'Advanced analytics and reports', 'ESC/POS thermal printing'],
      it: ['4 interfacce in tempo reale (Admin, Cameriere, Cucina, Menù)', 'Floor plan interattivo con drag & drop dei tavoli', 'Ordini in tempo reale via Socket.io', 'Gestione dei turni di cassa con riconciliazione', 'Analytics e report avanzati', 'Stampa termica ESC/POS'],
      fr: ['4 interfaces en temps réel (Admin, Serveur, Cuisine, Menu)', 'Plan de salle interactif avec tables drag & drop', 'Commandes en temps réel via Socket.io', 'Gestion des caisses avec rapprochement', 'Analytics et rapports avancés', 'Impression thermique ESC/POS'],
      pt: ['4 interfaces em tempo real (Admin, Garçom, Cozinha, Menu)', 'Floor plan interativo com drag & drop de mesas', 'Pedidos em tempo real via Socket.io', 'Gestão de turnos de caixa com fecho', 'Analytics e relatórios avançados', 'Impressão térmica ESC/POS'],
    },
    technologies: ['TypeScript', 'Node.js', 'Fastify', 'React 18', 'Vite', 'Socket.io', 'Drizzle ORM', 'PostgreSQL', 'Tailwind CSS', 'Zustand', 'PWA', 'pnpm Workspaces'],
    palette: ['#1B4332', '#52B788', '#D8F3DC', '#FFFFFF'],
    typography: ['Inter', 'Satoshi'],
    github: null,
    private: true,
  },

  {
    id: 'god',
    slug: 'god',
    title: 'GOD',
    subtitle: {
      es: 'Gateway Ops Dashboard — Layer7 API Gateway',
      en: 'Gateway Ops Dashboard — Layer7 API Gateway',
      it: 'Gateway Ops Dashboard — Layer7 API Gateway',
      fr: 'Gateway Ops Dashboard — Layer7 API Gateway',
      pt: 'Gateway Ops Dashboard — Layer7 API Gateway',
    },
    description: {
      es: 'Aplicación de escritorio para operar gateways Layer7 API Gateway: gestiona APIs, usuarios y políticas desde una interfaz rápida, hablando con el gateway por Graphman (GraphQL) o RestMan (REST/XML).',
      en: 'Desktop application to operate Layer7 API Gateways: manage APIs, users and policies from a fast interface, talking to the gateway over Graphman (GraphQL) or RestMan (REST/XML).',
      it: "Applicazione desktop per operare gateway Layer7 API Gateway: gestisci API, utenti e policy da un'interfaccia veloce, dialogando con il gateway via Graphman (GraphQL) o RestMan (REST/XML).",
      fr: "Application de bureau pour opérer des gateways Layer7 API Gateway : gérez les API, les utilisateurs et les politiques depuis une interface rapide, en dialoguant avec le gateway via Graphman (GraphQL) ou RestMan (REST/XML).",
      pt: 'Aplicação de desktop para operar gateways Layer7 API Gateway: gere APIs, utilizadores e políticas a partir de uma interface rápida, comunicando com o gateway por Graphman (GraphQL) ou RestMan (REST/XML).',
    },
    tags: ['Flutter', 'Dart', 'Layer7', T.desktop],
    year: '2026',
    color: '#A8E6C1',
    colorDark: '#2D6A4F',
    role: {
      es: 'Desarrollador',
      en: 'Developer',
      it: 'Sviluppatore',
      fr: 'Développeur',
      pt: 'Desenvolvedor',
    },
    overview: {
      es: 'GOD (Gateway Ops Dashboard) es una herramienta de escritorio construida en Flutter para administrar entornos empresariales sobre Layer7 API Gateway. Centraliza la operación de múltiples gateways —listar y modificar APIs, gestionar usuarios e identidades, revisar políticas— con una arquitectura modular y un enfoque de doble protocolo: usa Graphman cuando el gateway lo tiene habilitado, y RestMan como alternativa universal. Soporta autenticación mTLS y Basic Auth de forma ortogonal y prueba de conexión por gateway.',
      en: 'GOD (Gateway Ops Dashboard) is a desktop tool built in Flutter to manage enterprise environments running on Layer7 API Gateway. It centralizes the operation of multiple gateways —listing and modifying APIs, managing users and identities, reviewing policies— with a modular architecture and a dual-protocol approach: it uses Graphman when the gateway has it enabled, and RestMan as a universal fallback. It supports mTLS and Basic Auth orthogonally and per-gateway connection testing.',
      it: 'GOD (Gateway Ops Dashboard) è uno strumento desktop costruito in Flutter per amministrare ambienti aziendali su Layer7 API Gateway. Centralizza la gestione di più gateway —elencare e modificare API, gestire utenti e identità, rivedere policy— con un\'architettura modulare e un approccio dual-protocol: usa Graphman quando il gateway lo ha abilitato e RestMan come alternativa universale. Supporta autenticazione mTLS e Basic Auth in modo ortogonale e il test di connessione per gateway.',
      fr: "GOD (Gateway Ops Dashboard) est un outil de bureau construit en Flutter pour administrer des environnements d'entreprise sur Layer7 API Gateway. Il centralise l'exploitation de plusieurs gateways —lister et modifier des API, gérer les utilisateurs et identités, réviser les politiques— avec une architecture modulaire et une approche dual-protocole : il utilise Graphman quand le gateway l'active, et RestMan comme alternative universelle. Il prend en charge mTLS et Basic Auth de façon orthogonale ainsi que le test de connexion par gateway.",
      pt: 'GOD (Gateway Ops Dashboard) é uma ferramenta de desktop construída em Flutter para administrar ambientes empresariais sobre Layer7 API Gateway. Centraliza a operação de múltiplos gateways —listar e modificar APIs, gerir utilizadores e identidades, rever políticas— com uma arquitetura modular e uma abordagem de duplo protocolo: usa Graphman quando o gateway o tem ativado, e RestMan como alternativa universal. Suporta autenticação mTLS e Basic Auth de forma ortogonal e teste de ligação por gateway.',
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
      es: 'Agente en Go que monitorea miles de microservicios y APIs en Kubernetes. Observa el estado de los Deployments vía la API de Kubernetes y publica métricas y alertas hacia Zabbix.',
      en: 'Go agent that monitors thousands of microservices and APIs on Kubernetes. It watches Deployment health through the Kubernetes API and publishes metrics and alerts to Zabbix.',
      it: 'Agente in Go che monitora migliaia di microservizi e API su Kubernetes. Osserva lo stato dei Deployment tramite la Kubernetes API e pubblica metriche e alert verso Zabbix.',
      fr: "Agent en Go qui surveille des milliers de microservices et API sur Kubernetes. Il observe l'état des Deployments via l'API Kubernetes et publie métriques et alertes vers Zabbix.",
      pt: 'Agente em Go que monitora milhares de microsserviços e APIs no Kubernetes. Observa o estado dos Deployments via API do Kubernetes e publica métricas e alertas para o Zabbix.',
    },
    tags: ['Go', 'Kubernetes', T.observ, 'Zabbix'],
    year: '2026',
    color: '#6366F1',
    colorDark: '#4F46E5',
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

  {
    id: 'velox-motors',
    slug: 'velox-motors',
    title: 'Velox Motors',
    subtitle: {
      es: 'Concesionario web — PHP full-stack',
      en: 'Web dealership — PHP full-stack',
      it: 'Concessionaria web — PHP full-stack',
      fr: 'Concession web — PHP full-stack',
      pt: 'Concessionária web — PHP full-stack',
    },
    description: {
      es: 'Sistema web completo para un concesionario de vehículos con panel de administración, galería de inventario, calculadora de valoración de usados y seguridad implementada en capas.',
      en: 'Complete web system for a vehicle dealership with an admin panel, inventory gallery, used-car valuation calculator and layered security.',
      it: 'Sistema web completo per una concessionaria di veicoli con pannello di amministrazione, galleria di inventario, calcolatrice di valutazione dell\'usato e sicurezza a più livelli.',
      fr: "Système web complet pour une concession de véhicules avec panneau d'administration, galerie d'inventaire, calculateur d'estimation de l'occasion et sécurité en couches.",
      pt: 'Sistema web completo para uma concessionária de veículos com painel de administração, galeria de inventário, calculadora de avaliação de usados e segurança em camadas.',
    },
    tags: ['PHP', 'MySQL', 'JavaScript', T.security],
    year: '2025',
    color: '#74C69D',
    colorDark: '#1B4332',
    role: {
      es: 'Desarrollador Full-Stack',
      en: 'Full-Stack Developer',
      it: 'Sviluppatore Full-Stack',
      fr: 'Développeur Full-Stack',
      pt: 'Desenvolvedor Full-Stack',
    },
    overview: {
      es: 'Velox Motors es un sistema web completo para un concesionario. Incluye un frontend responsivo con galería de vehículos y calculadora de valoración interactiva, un panel de administración PHP con roles (Admin, Editor, Viewer), auditoría de operaciones, API REST propia y múltiples capas de seguridad: protección CSRF, rate limiting en login, validación de subida de archivos y sesiones seguras.',
      en: 'Velox Motors is a complete web system for a dealership. It includes a responsive frontend with a vehicle gallery and an interactive valuation calculator, a PHP admin panel with roles (Admin, Editor, Viewer), operations auditing, its own REST API and multiple security layers: CSRF protection, login rate limiting, file-upload validation and secure sessions.',
      it: 'Velox Motors è un sistema web completo per una concessionaria. Include un frontend responsive con galleria di veicoli e calcolatrice di valutazione interattiva, un pannello di amministrazione PHP con ruoli (Admin, Editor, Viewer), audit delle operazioni, una propria REST API e più livelli di sicurezza: protezione CSRF, rate limiting al login, validazione degli upload e sessioni sicure.',
      fr: "Velox Motors est un système web complet pour une concession. Il inclut un frontend responsive avec galerie de véhicules et calculateur d'estimation interactif, un panneau d'administration PHP avec rôles (Admin, Editor, Viewer), l'audit des opérations, sa propre API REST et plusieurs couches de sécurité : protection CSRF, rate limiting au login, validation des téléversements et sessions sécurisées.",
      pt: 'Velox Motors é um sistema web completo para uma concessionária. Inclui um frontend responsivo com galeria de veículos e calculadora de avaliação interativa, um painel de administração PHP com papéis (Admin, Editor, Viewer), auditoria de operações, uma API REST própria e múltiplas camadas de segurança: proteção CSRF, rate limiting no login, validação de upload de ficheiros e sessões seguras.',
    },
    features: {
      es: ['Panel de administración con roles y permisos', 'Galería de vehículos con filtros dinámicos', 'Calculadora de valoración de usados', 'Auditoría completa de operaciones', 'Protección CSRF + rate limiting en login', 'Subida segura de imágenes con validación'],
      en: ['Admin panel with roles and permissions', 'Vehicle gallery with dynamic filters', 'Used-car valuation calculator', 'Full operations auditing', 'CSRF protection + login rate limiting', 'Secure image upload with validation'],
      it: ['Pannello di amministrazione con ruoli e permessi', 'Galleria di veicoli con filtri dinamici', 'Calcolatrice di valutazione dell\'usato', 'Audit completo delle operazioni', 'Protezione CSRF + rate limiting al login', 'Upload sicuro di immagini con validazione'],
      fr: ["Panneau d'administration avec rôles et permissions", 'Galerie de véhicules avec filtres dynamiques', "Calculateur d'estimation de l'occasion", 'Audit complet des opérations', 'Protection CSRF + rate limiting au login', "Téléversement sécurisé d'images avec validation"],
      pt: ['Painel de administração com papéis e permissões', 'Galeria de veículos com filtros dinâmicos', 'Calculadora de avaliação de usados', 'Auditoria completa de operações', 'Proteção CSRF + rate limiting no login', 'Upload seguro de imagens com validação'],
    },
    technologies: ['PHP 7.4+', 'MySQL / MariaDB', 'HTML5', 'CSS3', 'JavaScript', 'REST API', 'Composer'],
    palette: ['#0D1117', '#74C69D', '#F4A261', '#FFFFFF'],
    typography: ['Inter', 'Roboto'],
    github: 'https://github.com/roky146/Velox_Motors',
  },

  {
    id: 'api-gateway-scripts',
    slug: 'api-gateway-scripts',
    title: 'Gateway Inventory',
    subtitle: {
      es: 'Automatización — Layer7 API Gateway V9 & V11',
      en: 'Automation — Layer7 API Gateway V9 & V11',
      it: 'Automazione — Layer7 API Gateway V9 & V11',
      fr: 'Automatisation — Layer7 API Gateway V9 & V11',
      pt: 'Automação — Layer7 API Gateway V9 & V11',
    },
    description: {
      es: 'Scripts en Python para automatizar el inventario de servicios en Layer7 API Gateway. RESTPy opera contra RESTMAN (V9) y GraphPy usa Graphman/GraphQL (V11).',
      en: 'Python scripts to automate the inventory of services on Layer7 API Gateway. RESTPy works against RESTMAN (V9) and GraphPy uses Graphman/GraphQL (V11).',
      it: 'Script in Python per automatizzare l\'inventario dei servizi su Layer7 API Gateway. RESTPy opera contro RESTMAN (V9) e GraphPy usa Graphman/GraphQL (V11).',
      fr: "Scripts Python pour automatiser l'inventaire des services sur Layer7 API Gateway. RESTPy fonctionne contre RESTMAN (V9) et GraphPy utilise Graphman/GraphQL (V11).",
      pt: 'Scripts em Python para automatizar o inventário de serviços no Layer7 API Gateway. RESTPy opera contra RESTMAN (V9) e GraphPy usa Graphman/GraphQL (V11).',
    },
    tags: ['Python', 'REST API', 'GraphQL', T.automation],
    year: '2025',
    color: '#95D5B2',
    colorDark: '#1B4332',
    role: {
      es: 'Desarrollador & Automatización',
      en: 'Developer & Automation',
      it: 'Sviluppatore & Automazione',
      fr: 'Développeur & Automatisation',
      pt: 'Desenvolvedor & Automação',
    },
    overview: {
      es: 'Dos scripts de automatización —RESTPy y GraphPy— que inventarían todos los servicios expuestos en Layer7 API Gateway y generan reportes exportables. Cubren tanto la versión clásica (RESTMAN/V9) como la moderna (Graphman/GraphQL/V11), con autenticación y paginación automáticas.',
      en: 'Two automation scripts —RESTPy and GraphPy— that inventory every service exposed on Layer7 API Gateway and generate exportable reports. They cover both the classic version (RESTMAN/V9) and the modern one (Graphman/GraphQL/V11), with automatic authentication and pagination.',
      it: 'Due script di automazione —RESTPy e GraphPy— che inventariano tutti i servizi esposti su Layer7 API Gateway e generano report esportabili. Coprono sia la versione classica (RESTMAN/V9) sia quella moderna (Graphman/GraphQL/V11), con autenticazione e paginazione automatiche.',
      fr: "Deux scripts d'automatisation —RESTPy et GraphPy— qui inventorient tous les services exposés sur Layer7 API Gateway et génèrent des rapports exportables. Ils couvrent la version classique (RESTMAN/V9) et la moderne (Graphman/GraphQL/V11), avec authentification et pagination automatiques.",
      pt: 'Dois scripts de automação —RESTPy e GraphPy— que inventariam todos os serviços expostos no Layer7 API Gateway e geram relatórios exportáveis. Cobrem tanto a versão clássica (RESTMAN/V9) como a moderna (Graphman/GraphQL/V11), com autenticação e paginação automáticas.',
    },
    features: {
      es: ['Inventario automático de servicios Layer7', 'Soporte V9 (RESTMAN) y V11 (Graphman)', 'Exportación de reportes', 'Autenticación y paginación automática'],
      en: ['Automatic inventory of Layer7 services', 'V9 (RESTMAN) and V11 (Graphman) support', 'Report export', 'Automatic authentication and pagination'],
      it: ['Inventario automatico dei servizi Layer7', 'Supporto V9 (RESTMAN) e V11 (Graphman)', 'Esportazione dei report', 'Autenticazione e paginazione automatiche'],
      fr: ['Inventaire automatique des services Layer7', 'Prise en charge V9 (RESTMAN) et V11 (Graphman)', 'Export de rapports', 'Authentification et pagination automatiques'],
      pt: ['Inventário automático de serviços Layer7', 'Suporte V9 (RESTMAN) e V11 (Graphman)', 'Exportação de relatórios', 'Autenticação e paginação automáticas'],
    },
    technologies: ['Python', 'REST API', 'GraphQL', 'Layer7 Graphman', 'RESTMAN'],
    palette: ['#1B4332', '#95D5B2', '#D8F3DC', '#FFFFFF'],
    typography: ['Satoshi', 'Monospace'],
    github: 'https://github.com/roky146/Api-Gateway-Inventory-Scripts',
  },
]

export const moreProjects = [
  {
    id: 'phishing-scanner',
    slug: 'phishing-scanner',
    title: 'PhishingScanner',
    subtitle: {
      es: 'Ciberseguridad — Detección de phishing',
      en: 'Cybersecurity — Phishing detection',
      it: 'Cybersecurity — Rilevamento di phishing',
      fr: 'Cybersécurité — Détection de phishing',
      pt: 'Cibersegurança — Deteção de phishing',
    },
    description: {
      es: 'Detector de indicadores de phishing en archivos de texto y correos. Puntúa el nivel de riesgo basándose en patrones de amenaza conocidos.',
      en: 'Phishing indicator detector for text files and emails. It scores the risk level based on known threat patterns.',
      it: 'Rilevatore di indicatori di phishing in file di testo ed email. Assegna un punteggio di rischio in base a pattern di minaccia noti.',
      fr: 'Détecteur d\'indicateurs de phishing dans les fichiers texte et les emails. Il note le niveau de risque selon des schémas de menace connus.',
      pt: 'Detetor de indicadores de phishing em ficheiros de texto e emails. Pontua o nível de risco com base em padrões de ameaça conhecidos.',
    },
    tags: ['C#', '.NET', T.security, T.analysis],
    year: '2024',
    color: '#52B788',
    colorDark: '#081C15',
    role: {
      es: 'Desarrollador',
      en: 'Developer',
      it: 'Sviluppatore',
      fr: 'Développeur',
      pt: 'Desenvolvedor',
    },
    overview: {
      es: 'PhishingScanner es una herramienta de análisis de seguridad que detecta palabras y patrones comúnmente usados en ataques de phishing dentro de archivos de texto o correos electrónicos, generando una puntuación de riesgo y listando los indicadores encontrados. Desarrollada en C#/.NET como herramienta de línea de comandos.',
      en: 'PhishingScanner is a security-analysis tool that detects words and patterns commonly used in phishing attacks within text files or emails, generating a risk score and listing the indicators found. Built in C#/.NET as a command-line tool.',
      it: 'PhishingScanner è uno strumento di analisi di sicurezza che rileva parole e pattern comunemente usati negli attacchi di phishing all\'interno di file di testo o email, generando un punteggio di rischio ed elencando gli indicatori trovati. Sviluppato in C#/.NET come strumento da riga di comando.',
      fr: "PhishingScanner est un outil d'analyse de sécurité qui détecte les mots et schémas couramment utilisés dans les attaques de phishing au sein de fichiers texte ou d'emails, en générant un score de risque et en listant les indicateurs trouvés. Développé en C#/.NET comme outil en ligne de commande.",
      pt: 'PhishingScanner é uma ferramenta de análise de segurança que deteta palavras e padrões usados em ataques de phishing dentro de ficheiros de texto ou emails, gerando uma pontuação de risco e listando os indicadores encontrados. Desenvolvido em C#/.NET como ferramenta de linha de comandos.',
    },
    features: {
      es: ['Análisis de archivos de texto y correos', 'Puntuación de riesgo automática', 'Listado de indicadores encontrados', 'Herramienta de línea de comandos'],
      en: ['Analysis of text files and emails', 'Automatic risk scoring', 'Listing of found indicators', 'Command-line tool'],
      it: ['Analisi di file di testo ed email', 'Punteggio di rischio automatico', 'Elenco degli indicatori trovati', 'Strumento da riga di comando'],
      fr: ['Analyse de fichiers texte et emails', 'Score de risque automatique', 'Liste des indicateurs trouvés', 'Outil en ligne de commande'],
      pt: ['Análise de ficheiros de texto e emails', 'Pontuação de risco automática', 'Listagem de indicadores encontrados', 'Ferramenta de linha de comandos'],
    },
    technologies: ['C#', '.NET', 'File I/O', 'Pattern Matching'],
    palette: ['#081C15', '#52B788', '#95D5B2', '#F8F9FA'],
    typography: ['Inter', 'JetBrains Mono'],
    github: 'https://github.com/roky146/PhishingScanner',
  },
  {
    id: 'hs-autofiller',
    title: 'HSAutoFiller',
    slug: null,
    description: {
      es: 'Chrome Extension en TypeScript para autocompletar formularios de registro en HS Consulting.',
      en: 'TypeScript Chrome Extension to autofill registration forms at HS Consulting.',
      it: 'Estensione Chrome in TypeScript per compilare automaticamente i moduli di registrazione di HS Consulting.',
      fr: "Extension Chrome en TypeScript pour remplir automatiquement les formulaires d'inscription de HS Consulting.",
      pt: 'Chrome Extension em TypeScript para preencher automaticamente formulários de registo na HS Consulting.',
    },
    tags: ['TypeScript', 'Chrome Extension', T.automation],
    year: '2024',
    github: 'https://github.com/roky146/HSAutoFiller',
  },
  {
    id: 'portfolio',
    title: 'mrmerlo.com',
    slug: null,
    description: {
      es: 'Este mismo portafolio — diseñado y construido desde cero con Next.js, Framer Motion y GSAP.',
      en: 'This very portfolio — designed and built from scratch with Next.js, Framer Motion and GSAP.',
      it: 'Questo stesso portfolio — progettato e costruito da zero con Next.js, Framer Motion e GSAP.',
      fr: 'Ce portfolio même — conçu et construit de zéro avec Next.js, Framer Motion et GSAP.',
      pt: 'Este mesmo portefólio — desenhado e construído de raiz com Next.js, Framer Motion e GSAP.',
    },
    tags: ['Next.js', 'Styled Components', 'Framer Motion'],
    year: '2025',
    github: null,
  },
]

/* Slugs con página de detalle (tienen overview localizado) */
export const detailProjects = [...featuredProjects, ...moreProjects].filter(
  (p) => p.slug && p.overview
)

export function getProjectBySlug(slug) {
  return detailProjects.find((p) => p.slug === slug) || null
}
