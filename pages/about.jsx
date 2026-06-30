import Head from 'next/head'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
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

const SectionLabel = styled.h3`
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 2rem;
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

const LINE_VARIANTS = {
  hidden: { y: '110%' },
  visible: (i) => ({
    y: 0,
    transition: { duration: 0.75, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function About() {
  const { t } = useLang()

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
      <Head>
        <title>Sobre mí — Marcos Rodríguez</title>
        <meta name="description" content="Ingeniero de Producción TI y estudiante de Ciberseguridad. Desarrollador de herramientas y aplicaciones." />
      </Head>

      <PageWrapper>

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

        <Footer />
      </PageWrapper>
    </>
  )
}
