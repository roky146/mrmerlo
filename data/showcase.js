/* ──────────────────────────────────────────────────────────────
   Contenido editable de las secciones de la home.
   Todo lo marcado como placeholder se muestra como "pendiente"
   (nunca como dato real). Para publicar: rellena los campos.
   ────────────────────────────────────────────────────────────── */

/* Proyectos web visuales con demo en vivo.
   url: enlace a la demo · image: captura (/public/...) o null */
export const WEB_PROJECTS = [
  {
    id: 'web-1',
    title: { es: 'Proyecto web 01', en: 'Web project 01', it: 'Progetto web 01', fr: 'Projet web 01', pt: 'Projeto web 01' },
    desc: {
      es: 'Espacio reservado para un sitio con demo en vivo: qué problema resuelve y para quién.',
      en: 'Reserved for a site with a live demo: what it solves and for whom.',
      it: 'Spazio riservato a un sito con demo dal vivo: quale problema risolve e per chi.',
      fr: 'Emplacement réservé pour un site avec démo en ligne : ce qu’il résout et pour qui.',
      pt: 'Espaço reservado para um site com demo ao vivo: que problema resolve e para quem.',
    },
    stack: ['Next.js', 'React', 'Styled Components'],
    url: null,
    image: null,
  },
  {
    id: 'web-2',
    title: { es: 'Proyecto web 02', en: 'Web project 02', it: 'Progetto web 02', fr: 'Projet web 02', pt: 'Projeto web 02' },
    desc: {
      es: 'Espacio reservado para una app web con demo: funcionalidad clave y resultado.',
      en: 'Reserved for a web app with a demo: key feature and outcome.',
      it: 'Spazio riservato a una web app con demo: funzionalità chiave e risultato.',
      fr: 'Emplacement réservé pour une application web avec démo : fonctionnalité clé et résultat.',
      pt: 'Espaço reservado para uma web app com demo: funcionalidade chave e resultado.',
    },
    stack: ['React', 'Node.js', 'TypeScript'],
    url: null,
    image: null,
  },
]

/* Métricas. value: número (anima al entrar en pantalla) o null (pendiente) */
export const METRICS = [
  { value: null, suffix: '+', label: { es: 'Proyectos entregados', en: 'Projects delivered', it: 'Progetti consegnati', fr: 'Projets livrés', pt: 'Projetos entregues' } },
  { value: null, suffix: '',  label: { es: 'Clientes', en: 'Clients', it: 'Clienti', fr: 'Clients', pt: 'Clientes' } },
  { value: null, suffix: '+', label: { es: 'Servicios monitoreados', en: 'Services monitored', it: 'Servizi monitorati', fr: 'Services supervisés', pt: 'Serviços monitorizados' } },
  { value: null, suffix: '%', label: { es: 'Disponibilidad', en: 'Uptime', it: 'Disponibilità', fr: 'Disponibilité', pt: 'Disponibilidade' } },
]

/* Testimonios. placeholder: true → se muestra como pendiente */
const PH_QUOTE = {
  es: 'Aquí irá el testimonio de un cliente: qué necesitaba y qué resultado obtuvo.',
  en: 'A client testimonial goes here: what they needed and what they got.',
  it: 'Qui andrà la testimonianza di un cliente: di cosa aveva bisogno e quale risultato ha ottenuto.',
  fr: 'Ici, le témoignage d’un client : son besoin et le résultat obtenu.',
  pt: 'Aqui vai o testemunho de um cliente: o que precisava e que resultado obteve.',
}
const PH_ROLE = { es: 'Cargo · Empresa', en: 'Role · Company', it: 'Ruolo · Azienda', fr: 'Poste · Entreprise', pt: 'Cargo · Empresa' }

export const TESTIMONIALS = [
  { placeholder: true, quote: PH_QUOTE, name: 'Nombre Apellido', role: PH_ROLE },
  { placeholder: true, quote: PH_QUOTE, name: 'Nombre Apellido', role: PH_ROLE },
  { placeholder: true, quote: PH_QUOTE, name: 'Nombre Apellido', role: PH_ROLE },
]
