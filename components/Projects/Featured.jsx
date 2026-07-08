import styled from 'styled-components'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { featuredProjects, localize } from '../../data/projects'
import { useLang } from '../../contexts/LanguageContext'
import BentoMosaic from './BentoMosaic'

const Section = styled.section`
  padding: 8rem 4rem;

  @media (max-width: 768px) {
    padding: 5rem 1.5rem;
  }
`

const SectionHeading = styled(motion.h2)`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 5rem;
`

const ProjectBlock = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 8rem;
  align-items: start;

  &:last-child { margin-bottom: 0; }

  &.reversed {
    direction: rtl;
    > * { direction: ltr; }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    &.reversed { direction: ltr; }
  }
`

const ProjectInfo = styled.div`
  position: sticky;
  top: 30vh;
  align-self: start;

  @media (max-width: 768px) {
    position: static;
  }
`

const ProjectNumber = styled.span`
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 1rem;
`

const ProjectTitle = styled(motion.h3)`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: clamp(2rem, 5.5vw, 3rem);
  font-weight: 400;
  font-variation-settings: "wdth" 100, "wght" 400;
  letter-spacing: -0.03em;
  line-height: 1.0;
  margin-bottom: 1rem;
`

const ProjectSubtitle = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  letter-spacing: 0.04em;
`

const ProjectDesc = styled.p`
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 340px;
  margin-bottom: 2rem;
`

const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  list-style: none;
`

const Tag = styled.li`
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--border);
  color: var(--text-secondary);
`

const ExploreBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid var(--text-primary);
  border-radius: 8px;
  padding: 0.7rem 1.4rem;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-primary);
  transition: background 0.25s, color 0.25s, transform 0.2s;

  &:hover {
    background: var(--text-primary);
    color: var(--bg);
    transform: translateY(-2px);
  }
`

export default function FeaturedProjects() {
  const { lang, t } = useLang()

  return (
    <Section id="projects" aria-labelledby="projects-heading">
      <SectionHeading
        id="projects-heading"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t('featured_label')}
      </SectionHeading>

      {featuredProjects.map((raw, idx) => {
        const project = localize(raw, lang)
        return (
          <ProjectBlock as="article" key={project.id} className={idx % 2 === 1 ? 'reversed' : ''}>
            <ProjectInfo>
              <ProjectNumber>0{idx + 1}</ProjectNumber>
              <ProjectTitle
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {project.title}
              </ProjectTitle>
              <ProjectSubtitle>{project.subtitle}</ProjectSubtitle>
              <ProjectDesc>{project.description}</ProjectDesc>
              <Tags>
                {project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
              </Tags>
              {project.capability ? (
                <ExploreBtn as="a" href={project.cta}>{t('project_cta_talk')}</ExploreBtn>
              ) : (
                <ExploreBtn href={`/projects/${project.slug}`}>{t('project_cta')}</ExploreBtn>
              )}
            </ProjectInfo>

            <BentoMosaic project={project} />
          </ProjectBlock>
        )
      })}
    </Section>
  )
}
