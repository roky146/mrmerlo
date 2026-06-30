import styled from 'styled-components'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { moreProjects, localize } from '../../data/projects'
import { useLang } from '../../contexts/LanguageContext'

const Section = styled.section`
  padding: 4rem 4rem 8rem;

  @media (max-width: 768px) { padding: 3rem 1.5rem 5rem; }
`

const SectionHeading = styled.h3`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 2rem;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border);
  margin: 0;
`

const ArrowCircle = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1.5px solid var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--text-primary);
  flex-shrink: 0;
  transition: background 0.25s, color 0.25s;
`

const ArrowCircleDim = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--text-secondary);
  flex-shrink: 0;
`

/* ── Row is now a block-level element wrapping everything ── */
const ProjectRowLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.75rem 0;
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  &:hover ${ArrowCircle} {
    background: var(--text-primary);
    color: var(--bg);
  }
`

const ProjectRowStatic = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.75rem 0;
  cursor: default;
`

const RowLeft = styled.div``

const ProjectName = styled.h4`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`

const RowMeta = styled.span`
  font-size: 0.8rem;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
`

const rowAnim = (i) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, delay: i * 0.08 },
})

export default function MoreProjects() {
  const { lang, t } = useLang()

  return (
    <Section>
      <SectionHeading>{t('more_label')}</SectionHeading>
      <Divider />
      {moreProjects.map((raw, i) => {
        const project = localize(raw, lang)
        const href = project.slug
          ? `/projects/${project.slug}`
          : project.github || null

        const inner = (
          <>
            <RowLeft>
              <ProjectName>{project.title}</ProjectName>
              <RowMeta>{project.description} · {project.year}</RowMeta>
            </RowLeft>
            {href ? <ArrowCircle>{project.github && !project.slug ? '↗' : '→'}</ArrowCircle> : <ArrowCircleDim>→</ArrowCircleDim>}
          </>
        )

        return (
          <div key={project.id}>
            {href ? (
              <ProjectRowLink
                href={href}
                target={project.github && !project.slug ? '_blank' : undefined}
                rel={project.github && !project.slug ? 'noopener noreferrer' : undefined}
                {...rowAnim(i)}
              >
                {inner}
              </ProjectRowLink>
            ) : (
              <ProjectRowStatic {...rowAnim(i)}>
                {inner}
              </ProjectRowStatic>
            )}
            <Divider />
          </div>
        )
      })}
    </Section>
  )
}
