import styled from 'styled-components'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import JsonLd from '../components/JsonLd'
import { graph, faqSchema } from '../data/site'
import { useLang } from '../contexts/LanguageContext'

/* ─── Layout ─────────────────────────────────────────────── */

const PageWrapper = styled.div`
  padding-top: 7rem;
`

const PageHero = styled.div`
  padding: 0 4rem;
  margin-bottom: 7rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
    margin-bottom: 4rem;
  }
`

const Eyebrow = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 1.4rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;

  &::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 1px;
    background: var(--text-secondary);
    flex-shrink: 0;
  }
`

const BigName = styled(motion.h1)`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 400;
  font-variation-settings: "wdth" 100, "wght" 400;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: var(--text-primary);
  margin-bottom: 2.5rem;
`

const HeroLead = styled(motion.p)`
  font-size: clamp(1rem, 1.6vw, 1.15rem);
  line-height: 1.85;
  color: var(--text-secondary);
  max-width: 600px;

  strong { color: var(--text-primary); font-weight: 500; }
`

/* ─── Section base ────────────────────────────────────────── */

const Section = styled.div`
  padding: 0 4rem;
  margin-bottom: 5rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
    margin-bottom: 3.5rem;
  }
`

const SectionLabel = styled.h2`
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 2rem;
`

/* ── FAQ (accesible con <details>/<summary>; potencia SEO/GEO/LLMO) ── */
const FaqList = styled.div`
  max-width: 780px;
  border-top: 1px solid var(--border);
`
const FaqItem = styled.details`
  border-bottom: 1px solid var(--border);
  padding: 1.25rem 0;
  &[open] summary::after { content: '−'; }
`
const FaqQ = styled.summary`
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  &::-webkit-details-marker { display: none; }
  &::after { content: '+'; color: var(--text-secondary); margin-left: auto; }
`
const FaqA = styled.p`
  margin-top: 0.85rem;
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 680px;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border);
  margin-bottom: 2rem;
`

/* ─── Bio / two-col grid ─────────────────────────────────── */

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  max-width: 1100px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`

const BioText = styled(motion.p)`
  font-size: 1rem;
  line-height: 1.9;
  color: var(--text-secondary);

  & + & { margin-top: 1.25rem; }
  strong { color: var(--text-primary); font-weight: 500; }
`

/* ─── Photo placeholder (circular) ──────────────────────── */

const PhotoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`

const PhotoPlaceholder = styled(motion.div)`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 2px dashed var(--border);
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-shrink: 0;
`

const PhotoIcon = styled.span`
  font-size: 2rem;
  color: var(--border);
  line-height: 1;
`

const PhotoLabel = styled.span`
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  text-align: center;
  max-width: 100px;
`

/* ─── Skills ─────────────────────────────────────────────── */

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem 3rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const SkillGroup = styled.div``

const SkillGroupTitle = styled.h4`
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-dim);
  margin-bottom: 0.75rem;
`

const SkillList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

const SkillItem = styled(motion.li)`
  font-size: 0.92rem;
  color: var(--text-primary);
  font-weight: 400;

  &::before {
    content: '— ';
    color: var(--text-secondary);
  }
`

/* ─── Experience timeline ────────────────────────────────── */

const Timeline = styled.div`
  max-width: 780px;
  display: flex;
  flex-direction: column;
  gap: 0;
`

const TimelineRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 2rem;
  padding: 1.75rem 0;
  border-bottom: 1px solid var(--border);

  &:first-child { border-top: 1px solid var(--border); }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`

const TimelineYear = styled.span`
  font-size: 0.8rem;
  color: var(--text-secondary);
  letter-spacing: 0.06em;
  padding-top: 0.15rem;
`

const TimelineContent = styled.div``

const TimelineTitle = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`

const TimelineOrg = styled.p`
  font-size: 0.82rem;
  color: var(--accent-dim);
  letter-spacing: 0.04em;
  margin-bottom: 0.6rem;
`

const TimelineDesc = styled.p`
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.7;
`

/* ─── Static data (BHD only appears here, in experience) ── */

const skills = {
  languages:  ['Python', 'C#  /.NET', 'Dart / Flutter', 'TypeScript', 'HTML · CSS · JS'],
  platforms:  ['Layer7 API Gateway', 'REST API / GraphQL', 'Graphman · RESTMAN', 'Chrome Extensions'],
  security:   ['Análisis de amenazas', 'Detección de phishing', 'Reducción de superficie', 'Seguridad en redes'],
  tools:      ['Git / GitHub', 'Android Studio', 'VS Code', 'Jupyter Notebooks'],
}

const experience = [
  {
    period: '2023 → presente',
    title: 'Ingeniero de Producción TI',
    org: 'Banco BHD — Santo Domingo, RD',
    desc: 'Administración y soporte de infraestructura TI en producción. Gestión de servicios en Layer7 API Gateway, automatización de inventarios y mantenimiento de plataformas críticas del banco.',
  },
  {
    period: '2022 → presente',
    title: 'Ingeniería en Ciberseguridad',
    org: 'Universidad del Caribe — Santo Domingo, RD',
    desc: 'Carrera de grado enfocada en seguridad de sistemas, criptografía, ethical hacking, redes seguras y gestión de incidentes.',
  },
  {
    period: '2024',
    title: 'Tecnicatura en Ciberseguridad',
    org: 'INFOTEP / MACROSeguridad — 310 horas',
    desc: 'Programa técnico intensivo en fundamentos de ciberseguridad, análisis de vulnerabilidades, hardening de sistemas y respuesta a incidentes.',
  },
  {
    period: '2024',
    title: 'Desarrollo de Aplicaciones',
    org: 'INFOTEP / TEOREMA',
    desc: 'Formación en desarrollo web (HTML, CSS, JS) y programación orientada a objetos. Backend y frontend aplicados a proyectos reales.',
  },
]

/* Preguntas frecuentes — respuestas derivadas del contenido real del portafolio */
const FAQS = [
  {
    q: {
      es: '¿Quién es Marcos Rodríguez Merlo?',
      en: 'Who is Marcos Rodríguez Merlo?',
      it: 'Chi è Marcos Rodríguez Merlo?',
      fr: 'Qui est Marcos Rodríguez Merlo ?',
      pt: 'Quem é Marcos Rodríguez Merlo?',
    },
    a: {
      es: 'Marcos Rodríguez Merlo (Marcos Merlo) es Ingeniero de Producción TI y estudiante de Ingeniería en Ciberseguridad en Santo Domingo, República Dominicana. Construye herramientas empresariales, automatización y aplicaciones full-stack.',
      en: 'Marcos Rodríguez Merlo (Marcos Merlo) is an IT Production Engineer and Cybersecurity Engineering student in Santo Domingo, Dominican Republic. He builds enterprise tools, automation and full-stack applications.',
      it: 'Marcos Rodríguez Merlo (Marcos Merlo) è un Ingegnere di Produzione IT e studente di Ingegneria della Cybersecurity a Santo Domingo, Repubblica Dominicana. Costruisce strumenti aziendali, automazione e applicazioni full-stack.',
      fr: "Marcos Rodríguez Merlo (Marcos Merlo) est ingénieur de production IT et étudiant en ingénierie de la cybersécurité à Saint-Domingue, République dominicaine. Il construit des outils d'entreprise, de l'automatisation et des applications full-stack.",
      pt: 'Marcos Rodríguez Merlo (Marcos Merlo) é Engenheiro de Produção TI e estudante de Engenharia em Cibersegurança em Santo Domingo, República Dominicana. Constrói ferramentas empresariais, automação e aplicações full-stack.',
    },
  },
  {
    q: {
      es: '¿En qué se especializa Marcos Merlo?',
      en: 'What does Marcos Merlo specialize in?',
      it: 'In cosa è specializzato Marcos Merlo?',
      fr: 'Dans quoi Marcos Merlo est-il spécialisé ?',
      pt: 'Em que se especializa Marcos Merlo?',
    },
    a: {
      es: 'En infraestructura TI y operaciones en producción, ciberseguridad y desarrollo de software full-stack. Trabaja con Kubernetes, Go, Flutter, React, Node.js y Layer7 API Gateway.',
      en: 'In IT infrastructure and production operations, cybersecurity and full-stack software development. He works with Kubernetes, Go, Flutter, React, Node.js and Layer7 API Gateway.',
      it: "In infrastruttura IT e operazioni in produzione, cybersecurity e sviluppo software full-stack. Lavora con Kubernetes, Go, Flutter, React, Node.js e Layer7 API Gateway.",
      fr: "Dans l'infrastructure IT et les opérations en production, la cybersécurité et le développement logiciel full-stack. Il travaille avec Kubernetes, Go, Flutter, React, Node.js et Layer7 API Gateway.",
      pt: 'Em infraestrutura TI e operações em produção, cibersegurança e desenvolvimento de software full-stack. Trabalha com Kubernetes, Go, Flutter, React, Node.js e Layer7 API Gateway.',
    },
  },
  {
    q: {
      es: '¿Marcos Merlo trabaja con Kubernetes?',
      en: 'Does Marcos Merlo work with Kubernetes?',
      it: 'Marcos Merlo lavora con Kubernetes?',
      fr: 'Marcos Merlo travaille-t-il avec Kubernetes ?',
      pt: 'Marcos Merlo trabalha com Kubernetes?',
    },
    a: {
      es: 'Sí. Desarrolló Reccon, un agente de observabilidad cloud-native en Go que monitorea miles de microservicios en Kubernetes y envía métricas y alertas a Zabbix.',
      en: 'Yes. He built Reccon, a cloud-native observability agent in Go that monitors thousands of microservices on Kubernetes and sends metrics and alerts to Zabbix.',
      it: 'Sì. Ha sviluppato Reccon, un agente di osservabilità cloud-native in Go che monitora migliaia di microservizi su Kubernetes e invia metriche e alert a Zabbix.',
      fr: "Oui. Il a développé Reccon, un agent d'observabilité cloud-native en Go qui surveille des milliers de microservices sur Kubernetes et envoie métriques et alertes vers Zabbix.",
      pt: 'Sim. Desenvolveu o Reccon, um agente de observabilidade cloud-native em Go que monitora milhares de microsserviços no Kubernetes e envia métricas e alertas para o Zabbix.',
    },
  },
  {
    q: {
      es: '¿Desarrolla herramientas de automatización empresarial?',
      en: 'Does he build enterprise automation tools?',
      it: 'Sviluppa strumenti di automazione aziendale?',
      fr: "Développe-t-il des outils d'automatisation d'entreprise ?",
      pt: 'Desenvolve ferramentas de automação empresarial?',
    },
    a: {
      es: 'Sí. Construyó GOD (Gateway Ops Dashboard) para operar Layer7 API Gateway, además de integraciones y scripts de automatización de procesos.',
      en: 'Yes. He built GOD (Gateway Ops Dashboard) to operate Layer7 API Gateway, along with integrations and process-automation scripts.',
      it: 'Sì. Ha costruito GOD (Gateway Ops Dashboard) per operare Layer7 API Gateway, oltre a integrazioni e script di automazione dei processi.',
      fr: "Oui. Il a construit GOD (Gateway Ops Dashboard) pour opérer Layer7 API Gateway, ainsi que des intégrations et des scripts d'automatisation de processus.",
      pt: 'Sim. Construiu o GOD (Gateway Ops Dashboard) para operar Layer7 API Gateway, além de integrações e scripts de automação de processos.',
    },
  },
  {
    q: {
      es: '¿Desarrolla sistemas POS y aplicaciones web?',
      en: 'Does he build POS systems and web applications?',
      it: 'Sviluppa sistemi POS e applicazioni web?',
      fr: 'Développe-t-il des systèmes POS et des applications web ?',
      pt: 'Desenvolve sistemas POS e aplicações web?',
    },
    a: {
      es: 'Sí. Desarrolla aplicaciones web y de escritorio a medida —incluidos sistemas POS, paneles de administración y APIs— con React, Node.js, TypeScript y Flutter.',
      en: 'Yes. He builds custom web and desktop applications —including POS systems, admin panels and APIs— with React, Node.js, TypeScript and Flutter.',
      it: 'Sì. Sviluppa applicazioni web e desktop su misura —inclusi sistemi POS, pannelli di amministrazione e API— con React, Node.js, TypeScript e Flutter.',
      fr: "Oui. Il développe des applications web et de bureau sur mesure —y compris des systèmes POS, des panneaux d'administration et des API— avec React, Node.js, TypeScript et Flutter.",
      pt: 'Sim. Desenvolve aplicações web e de desktop à medida —incluindo sistemas POS, painéis de administração e APIs— com React, Node.js, TypeScript e Flutter.',
    },
  },
  {
    q: {
      es: '¿Está disponible para proyectos freelance o consultoría?',
      en: 'Is he available for freelance projects or consulting?',
      it: 'È disponibile per progetti freelance o consulenza?',
      fr: 'Est-il disponible pour des projets freelance ou du conseil ?',
      pt: 'Está disponível para projetos freelance ou consultoria?',
    },
    a: {
      es: 'Sí. Está disponible para proyectos freelance y consultoría tecnológica —desarrollo web y de apps, automatización e infraestructura— desde República Dominicana. Escríbele a iroky146@gmail.com.',
      en: 'Yes. He is available for freelance projects and technology consulting —web and app development, automation and infrastructure— from the Dominican Republic. Reach him at iroky146@gmail.com.',
      it: 'Sì. È disponibile per progetti freelance e consulenza tecnologica —sviluppo web e app, automazione e infrastruttura— dalla Repubblica Dominicana. Scrivi a iroky146@gmail.com.',
      fr: "Oui. Il est disponible pour des projets freelance et du conseil technologique —développement web et apps, automatisation et infrastructure— depuis la République dominicaine. Contactez-le à iroky146@gmail.com.",
      pt: 'Sim. Está disponível para projetos freelance e consultoria tecnológica —desenvolvimento web e apps, automação e infraestrutura— a partir da República Dominicana. Contacte iroky146@gmail.com.',
    },
  },
]

const LINE_VARIANTS = {
  hidden: { y: '110%' },
  visible: (i) => ({
    y: 0,
    transition: { duration: 0.75, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function About() {
  const { t, lang } = useLang()
  const loc = (o) => o[lang] ?? o.es

  const skillGroups = [
    { key: 'languages', items: skills.languages },
    { key: 'platforms', items: skills.platforms },
    { key: 'security',  items: skills.security  },
    { key: 'tools',     items: skills.tools     },
  ]

  const currently = [
    { label: t('currently_working'),  value: t('currently_work_val')  },
    { label: t('currently_studying'), value: t('currently_study_val') },
    { label: t('currently_building'), value: t('currently_build_val') },
    { label: t('currently_location'), value: t('currently_loc_val')   },
    { label: t('currently_contact'),  value: 'iroky146@gmail.com'      },
  ]

  return (
    <>
      <Seo
        title="Sobre mí"
        description="Marcos Rodríguez Merlo — Ingeniero de Producción TI y estudiante de Ingeniería en Ciberseguridad en Santo Domingo, RD. Kubernetes, automatización empresarial, desarrollo full-stack y consultoría tecnológica."
        path="/about/"
      />
      <JsonLd data={graph(faqSchema(FAQS.map((f) => ({ q: f.q.es, a: f.a.es }))))} />

      <PageWrapper as="main" id="main-content">

        {/* ── Hero ── */}
        <PageHero>
          <Eyebrow
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('about_eyebrow')}
          </Eyebrow>

          <BigName>
            {[t('about_title1'), t('about_title2')].map((line, i) => (
              <div key={i} style={{ overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
                <motion.span
                  style={{ display: 'block' }}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={LINE_VARIANTS}
                >
                  {line}
                </motion.span>
              </div>
            ))}
          </BigName>

          <HeroLead
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            dangerouslySetInnerHTML={{ __html: t('about_lead') }}
          />
        </PageHero>

        {/* ── Bio + Photo + Skills ── */}
        <Section>
          <SectionLabel>{t('about_who_label')}</SectionLabel>
          <TwoCol>
            {/* Left: bio text */}
            <div>
              {['about_bio1', 'about_bio2', 'about_bio3'].map((key, i) => (
                <BioText
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  dangerouslySetInnerHTML={{ __html: t(key) }}
                />
              ))}
            </div>

            {/* Right: photo placeholder + skills */}
            <PhotoCol>
              {/* ── Circular photo placeholder — replace src with your photo ── */}
              <PhotoPlaceholder
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <PhotoIcon>👤</PhotoIcon>
                <PhotoLabel>{t('about_photo_placeholder')}</PhotoLabel>
              </PhotoPlaceholder>

              <SkillsGrid>
                {skillGroups.map(({ key, items }, gi) => (
                  <SkillGroup key={key}>
                    <SkillGroupTitle>{t(`skill_${key}`)}</SkillGroupTitle>
                    <SkillList>
                      {items.map((skill, i) => (
                        <SkillItem
                          key={skill}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: gi * 0.05 + i * 0.04 }}
                        >
                          {skill}
                        </SkillItem>
                      ))}
                    </SkillList>
                  </SkillGroup>
                ))}
              </SkillsGrid>
            </PhotoCol>
          </TwoCol>
        </Section>

        {/* ── Experience & Education ── */}
        <Section>
          <SectionLabel>{t('exp_label')}</SectionLabel>
          <Timeline>
            {experience.map((item, i) => (
              <TimelineRow
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <TimelineYear>{item.period}</TimelineYear>
                <TimelineContent>
                  <TimelineTitle>{item.title}</TimelineTitle>
                  <TimelineOrg>{item.org}</TimelineOrg>
                  <TimelineDesc>{item.desc}</TimelineDesc>
                </TimelineContent>
              </TimelineRow>
            ))}
          </Timeline>
        </Section>

        {/* ── Currently ── */}
        <Section>
          <SectionLabel>{t('currently_label')}</SectionLabel>
          <Divider />
          {currently.map((row, i) => (
            <motion.div
              key={row.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 0',
                borderBottom: '1px solid var(--border)',
                gap: '1rem',
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <span style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                {row.label}
              </span>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right' }}>
                {row.value}
              </span>
            </motion.div>
          ))}
        </Section>

        {/* ── FAQ ── */}
        <Section>
          <SectionLabel>{t('faq_label')}</SectionLabel>
          <FaqList>
            {FAQS.map((f, i) => (
              <FaqItem key={i}>
                <FaqQ>{loc(f.q)}</FaqQ>
                <FaqA>{loc(f.a)}</FaqA>
              </FaqItem>
            ))}
          </FaqList>
        </Section>

        <Footer />
      </PageWrapper>
    </>
  )
}
