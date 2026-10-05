import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext'
import { WEB_PROJECTS } from '../../data/showcase'
import { localize } from '../../data/projects'
import { Section, Eyebrow, Title, reveal, spotlight, isoPattern } from './ui'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  @media (max-width: 820px) { grid-template-columns: 1fr; }
`

const Card = styled(motion.article)`
  position: relative;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  overflow: hidden;
  transition: border-color 0.3s, transform 0.3s;
  &:nth-child(odd)  { border-radius: 0 0 22px 0; }
  &:nth-child(even) { border-radius: 22px 0 0 0; }

  /* foco que sigue al puntero */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%),
      color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  &:hover { border-color: var(--accent-dim); transform: translateY(-4px); }
  &:hover::after { opacity: 1; }
`

const Shot = styled.div`
  aspect-ratio: 16 / 10;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
  background: var(--bg) ${isoPattern};
  display: grid;
  place-items: center;

  img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
  ${Card}:hover & img { transform: scale(1.04); }
`

const Pending = styled.span`
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  border: 1px dashed var(--border);
  padding: 0.45rem 0.8rem;
`

const Body = styled.div`
  padding: 1.6rem 1.6rem 1.8rem;
  position: relative;
  z-index: 1;
`

const Name = styled.h3`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
`

const Desc = styled.p`
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--text-secondary);
  margin-bottom: 1.2rem;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`

const Stack = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  li {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-secondary);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0.25rem 0.6rem;
  }
`

const Demo = styled.a`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  padding: 0.6rem 1.1rem;
  border: 2px solid var(--text-primary);
  background: var(--btn-primary);
  color: var(--bg);
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
  &[aria-disabled='true'] {
    background: none;
    color: var(--text-secondary);
    border-color: var(--border);
    pointer-events: none;
  }
`

export default function WebShowcase() {
  const { lang, t } = useLang()
  const items = WEB_PROJECTS.map((p) => localize(p, lang))

  return (
    <Section id="web" aria-labelledby="web-title">
      <Eyebrow {...reveal(0)}>{t('web_label')}</Eyebrow>
      <Title id="web-title" {...reveal(1)}>{t('web_title')}</Title>

      <Grid>
        {items.map((p, i) => (
          <Card key={p.id} onMouseMove={spotlight} {...reveal(i + 2)}>
            <Shot>
              {p.image
                ? <img src={p.image} alt={p.title} loading="lazy" decoding="async" />
                : <Pending>{t('media_pending')}</Pending>}
            </Shot>
            <Body>
              <Name>{p.title}</Name>
              <Desc>{p.desc}</Desc>
              <Row>
                <Stack>{p.stack.map((s) => <li key={s}>{s}</li>)}</Stack>
                {p.url
                  ? <Demo href={p.url} target="_blank" rel="noopener noreferrer">{t('web_demo')} ↗</Demo>
                  : <Demo as="span" aria-disabled="true">{t('web_soon')}</Demo>}
              </Row>
            </Body>
          </Card>
        ))}
      </Grid>
    </Section>
  )
}
