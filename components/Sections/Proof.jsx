import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { motion, animate, useInView, useReducedMotion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext'
import { METRICS, TESTIMONIALS } from '../../data/showcase'
import { localize } from '../../data/projects'
import { Section, Eyebrow, reveal, spotlight } from './ui'

/* ── Métricas ── */
const Metrics = styled.dl`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin-bottom: 6rem;
  @media (max-width: 820px) { grid-template-columns: repeat(2, 1fr); }
`

const Metric = styled(motion.div)`
  padding: 2.2rem 1.4rem;
  /* dt antes que dd en el DOM (semántica), cifra arriba en pantalla */
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
  & + & { border-left: 1px solid var(--border); }
  @media (max-width: 820px) {
    &:nth-child(3) { border-left: none; }
    &:nth-child(n + 3) { border-top: 1px solid var(--border); }
  }
`

const Value = styled.dd`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: clamp(2.6rem, 6vw, 4.2rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
  color: ${(p) => (p.$pending ? 'var(--text-secondary)' : 'var(--text-primary)')};
  font-variant-numeric: tabular-nums;
  span { color: var(--accent); }
`

const Label = styled.dt`
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-top: 0.8rem;
`

function Count({ value, suffix, pendingLabel }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView || value == null) return
    if (reduce) { setN(value); return }
    const ctrl = animate(0, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: setN })
    return () => ctrl.stop()
  }, [inView, value, reduce])

  if (value == null) {
    return <Value ref={ref} $pending aria-label={pendingLabel}>—</Value>
  }
  const shown = Number.isInteger(value) ? Math.round(n) : n.toFixed(1)
  return <Value ref={ref}>{shown}<span>{suffix}</span></Value>
}

/* ── Testimonios ── */
const Quotes = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  @media (max-width: 960px) { grid-template-columns: 1fr; }
`

const Quote = styled(motion.figure)`
  position: relative;
  padding: 2rem 1.6rem 1.6rem;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  overflow: hidden;
  &:nth-child(2) { border-radius: 0 22px 0 0; }
  &:nth-child(3) { border-radius: 0 0 22px 0; }

  &::before {
    content: '“';
    position: absolute;
    top: -0.9rem;
    right: 1rem;
    font-family: 'Gilroy', serif;
    font-size: 7rem;
    line-height: 1;
    color: var(--accent);
    opacity: 0.18;
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%),
      color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  &:hover::after { opacity: 1; }
`

const QuoteText = styled.blockquote`
  font-size: 1rem;
  line-height: 1.7;
  color: ${(p) => (p.$pending ? 'var(--text-secondary)' : 'var(--text-primary)')};
  font-style: ${(p) => (p.$pending ? 'italic' : 'normal')};
  margin-bottom: 1.6rem;
`

const Who = styled.figcaption`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  strong { display: block; font-size: 0.9rem; }
  small { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary); }
`

const Tag = styled.span`
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
  border: 1px dashed var(--border);
  padding: 0.25rem 0.5rem;
  white-space: nowrap;
`

export default function Proof() {
  const { lang, t } = useLang()
  const metrics = METRICS.map((m) => localize(m, lang))
  const quotes = TESTIMONIALS.map((q) => localize(q, lang))

  return (
    <Section id="proof" aria-label={`${t('metrics_label')} · ${t('testi_label')}`}>
      <Eyebrow {...reveal(0)}>{t('metrics_label')}</Eyebrow>
      <Metrics>
        {metrics.map((m, i) => (
          <Metric key={i} {...reveal(i + 1)}>
            <Label>{m.label}</Label>
            <Count value={m.value} suffix={m.suffix} pendingLabel={t('metric_pending')} />
          </Metric>
        ))}
      </Metrics>

      <Eyebrow {...reveal(0)}>{t('testi_label')}</Eyebrow>
      <Quotes>
        {quotes.map((q, i) => (
          <Quote key={i} onMouseMove={spotlight} {...reveal(i + 1)}>
            <QuoteText $pending={q.placeholder}>{q.quote}</QuoteText>
            <Who>
              <div>
                <strong>{q.name}</strong>
                <small>{q.role}</small>
              </div>
              {q.placeholder && <Tag>{t('testi_pending')}</Tag>}
            </Who>
          </Quote>
        ))}
      </Quotes>
    </Section>
  )
}
