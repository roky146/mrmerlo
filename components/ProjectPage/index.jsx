import styled from 'styled-components'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { detailProjects, localize } from '../../data/projects'
import { useLang } from '../../contexts/LanguageContext'
import BentoMosaic from '../Projects/BentoMosaic'

const PageWrapper = styled.div`
  padding-top: 8rem;
`

const HeroWrap = styled.div`
  padding: 0 2.5rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) { padding: 0 1.5rem; }
`

const ContentArea = styled.div`
  padding: 0 2.5rem;
  max-width: 900px;

  @media (max-width: 768px) { padding: 0 1.5rem; }
`

const ProjectTitle = styled(motion.h1)`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: clamp(3rem, 7vw, 6rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 0.5rem;
`

const ProjectSubtitle = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  letter-spacing: 0.05em;
`

const MetaRow = styled.div`
  display: flex;
  gap: 3rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
`

const MetaItem = styled.div``

const MetaLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.3rem;
`

const MetaValue = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
`

const SectionLabel = styled.h2`
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 1rem;
`

const Overview = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 4rem;
  max-width: 680px;
`

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 4rem;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
`

const FeatureCard = styled(motion.div)`
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--border);
  border-left: 3px solid ${p => p.$color || 'var(--accent-dim)'};
`

const FeatureText = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
`

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 4rem;
`

const TechTag = styled.span`
  padding: 0.4rem 1rem;
  border: 1px solid var(--border);
  font-size: 0.85rem;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
`

const Palette = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 4rem;
  flex-wrap: wrap;
`

const Swatch = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`

const SwatchColor = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${p => p.$color};
  border: 1px solid rgba(0,0,0,0.08);
`

const SwatchHex = styled.span`
  font-size: 0.72rem;
  color: var(--text-secondary);
  font-family: monospace;
`

const RepoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 4rem;
`

const RepoLink = styled.a`
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

const PrivateBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  letter-spacing: 0.06em;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border);
  margin: 4rem 0 2rem;
`

const MoreSection = styled.section`
  padding: 2rem 2.5rem 5rem;

  @media (max-width: 768px) { padding: 2rem 1.5rem 4rem; }
`

const MoreHeading = styled.h3`
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 2rem;
`

const MoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`

const MoreCard = styled(Link)`
  display: block;
  padding: 1.5rem;
  border: 1px solid var(--border);
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    border-color: var(--accent-dim);
    background: var(--bg-secondary);
  }
`

const MoreCardTitle = styled.h4`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
`

const MoreCardDesc = styled.p`
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.5;
`

export default function ProjectPage({ project: raw }) {
  const { lang, t } = useLang()
  const project = localize(raw, lang)

  const relatedFinal = detailProjects
    .filter(p => p.id !== raw.id)
    .slice(0, 3)
    .map(p => localize(p, lang))

  return (
    <PageWrapper as="main" id="main-content">
      <HeroWrap>
        <BentoMosaic project={project} />
      </HeroWrap>

      <ContentArea>
        <ProjectTitle
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {project.title}
        </ProjectTitle>
        <ProjectSubtitle>{project.subtitle}</ProjectSubtitle>

        <MetaRow>
          <MetaItem>
            <MetaLabel>{t('proj_role')}</MetaLabel>
            <MetaValue>{project.role}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>{t('proj_year')}</MetaLabel>
            <MetaValue>{project.year}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>{t('proj_tags')}</MetaLabel>
            <MetaValue>{project.tags.join(', ')}</MetaValue>
          </MetaItem>
        </MetaRow>

        <SectionLabel>{t('proj_overview')}</SectionLabel>
        <Overview>{project.overview}</Overview>

        {project.features?.length > 0 && (
          <>
            <SectionLabel>{t('proj_features')}</SectionLabel>
            <FeatureGrid>
              {project.features.map((f, i) => (
                <FeatureCard
                  key={f}
                  $color={project.color}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <FeatureText>{f}</FeatureText>
                </FeatureCard>
              ))}
            </FeatureGrid>
          </>
        )}

        <SectionLabel>{t('proj_tech')}</SectionLabel>
        <TechStack>
          {project.technologies.map(tech => <TechTag key={tech}>{tech}</TechTag>)}
        </TechStack>

        <SectionLabel>{t('proj_typography')}</SectionLabel>
        <TechStack>
          {project.typography.map(tp => <TechTag key={tp}>{tp}</TechTag>)}
        </TechStack>

        <RepoRow>
          {project.github ? (
            <RepoLink href={project.github} target="_blank" rel="noopener noreferrer">
              {t('proj_view_repo')}
            </RepoLink>
          ) : project.private ? (
            <PrivateBadge>🔒 {t('proj_private')}</PrivateBadge>
          ) : null}
        </RepoRow>
      </ContentArea>

      <Divider />
      <MoreSection>
        <MoreHeading>{t('proj_more')}</MoreHeading>
        <MoreGrid>
          {relatedFinal.map(p => (
            <MoreCard key={p.id} href={`/projects/${p.slug}`}>
              <MoreCardTitle>{p.title}</MoreCardTitle>
              <MoreCardDesc>{p.description}</MoreCardDesc>
            </MoreCard>
          ))}
        </MoreGrid>
      </MoreSection>
    </PageWrapper>
  )
}
