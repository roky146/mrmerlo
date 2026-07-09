import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'

/* ──────────────────────────────────────────────────────────────
   Bento de 6 cards, cada una con un icono DISTINTO y representativo.
   - Desktop: grid rectangular 4×2 (cards anchas para variedad).
   - Móvil: mosaico condensado 2 columnas con alturas variadas.
   - Icono dentro de un círculo tintado (más presencia + diferenciado por color).
   - Colores legibles en claro y oscuro. Animación: entrada + float + hover.
   ────────────────────────────────────────────────────────────── */

const S = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" {...p} />
)

const IconApi     = () => <S><path d="M8 8l-4 4 4 4"/><path d="M16 8l4 4-4 4"/><path d="M13 5l-2 14"/></S>
const IconGraph   = () => <S><circle cx="12" cy="5" r="2"/><circle cx="5" cy="17" r="2"/><circle cx="19" cy="17" r="2"/><path d="M11 7 6 15M13 7l5 8M7 17h10"/></S>
const IconRest    = () => <S><path d="M4 9h13l-3-3"/><path d="M20 15H7l3 3"/></S>
const IconUsers   = () => <S><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5a3 3 0 0 1 0 6"/><path d="M21 20a5 5 0 0 0-3.5-4.7"/></S>
const IconSliders = () => <S><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="8" cy="18" r="2" fill="currentColor" stroke="none"/></S>
const IconShield  = () => <S><path d="M12 3 5 6v6c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6z"/><rect x="10" y="10.5" width="4" height="3.5" rx="0.6"/><path d="M10.7 10.5V9.4a1.3 1.3 0 0 1 2.6 0v1.1"/></S>
const IconK8s     = () => <S><path d="M12 3l7 4v6l-7 4-7-4V7z"/><circle cx="12" cy="10.5" r="2.4"/><path d="M12 3.2v2.7M5.4 7.2l3 1.8M18.6 7.2l-3 1.8M8.7 14.8l1-2.9M15.3 14.8l-1-2.9"/></S>
const IconWatch   = () => <S><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.4"/></S>
const IconShard   = () => <S><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></S>
const IconGauge   = () => <S><path d="M4 16a8 8 0 0 1 16 0"/><path d="M12 16l4.5-4.5"/><circle cx="12" cy="16" r="1.1" fill="currentColor" stroke="none"/></S>
const IconSignal  = () => <S><path d="M5 12a7 7 0 0 1 14 0"/><path d="M8 12a4 4 0 0 1 8 0"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></S>
const IconBox     = () => <S><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 21V12M12 12l8-4.5M12 12 4 7.5"/></S>
const IconAtom    = () => <S><circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></S>
const IconServer  = () => <S><path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M12 22V12"/><path d="m3 7 9 5 9-5"/></S>
const IconTs      = () => <S><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7.5 10.5h5M10 10.5v6"/><path d="M14.5 15.3c.2.8 1 1.2 1.9 1.2 1 0 1.8-.5 1.8-1.4 0-1.9-3.6-1-3.6-2.9 0-.8.7-1.4 1.7-1.4.8 0 1.5.4 1.7 1.1"/></S>
const IconFlutter = () => <S><path d="M14 3 6 11l2.5 2.5L19 3z"/><path d="M14 11 9.5 15.5 14 20h5l-4.5-4.5L19 11z"/></S>
const IconReceipt = () => <S><path d="M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1V3l-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 8h8M8 12h8M8 16h5"/></S>
const IconBolt    = () => <S><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></S>
const IconSpark   = () => <S><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></S>

/* Mapa exacto etiqueta → icono (cada concepto, su propio icono) */
const ICON = {
  'apis': IconApi, 'graphman': IconGraph, 'restman': IconRest,
  'usuarios': IconUsers, 'cluster-properties': IconSliders, 'mtls': IconShield,
  'kubernetes': IconK8s, 'informers': IconWatch, 'sharding': IconShard,
  'zabbix': IconGauge, 'opentelemetry': IconSignal, 'distroless': IconBox,
  'react': IconAtom, 'node.js': IconServer, 'typescript': IconTs,
  'flutter': IconFlutter, 'sistemas pos': IconReceipt,
  'automatización': IconBolt, 'automatizacion': IconBolt,
}

function pickIcon(label) {
  const l = label.toLowerCase()
  if (ICON[l]) return ICON[l]
  if (/(api|rest|graph)/.test(l)) return IconApi
  if (/(usuario|admin|panel)/.test(l)) return IconUsers
  if (/(mtls|tls|seguridad|distroless)/.test(l)) return IconShield
  if (/(kubernetes|k8s|cluster|pod)/.test(l)) return IconK8s
  if (/(zabbix|telemetr|observab|metric|monitor)/.test(l)) return IconGauge
  if (/(react)/.test(l)) return IconAtom
  if (/(node)/.test(l)) return IconServer
  if (/(pos|caja|venta)/.test(l)) return IconReceipt
  if (/(automat)/.test(l)) return IconBolt
  return IconSpark
}

const HUES = ['#10B981', '#6366F1', '#F59E0B', '#0EA5E9', '#8B5CF6', '#F43F5E']
const COLSPAN = [2, 1, 1, 1, 1, 2]   // desktop (4 columnas)
const ROWSPAN_M = [2, 1, 1, 2, 1, 1] // móvil (2 columnas, alturas variadas)

const floaty = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-4px); }
`

const Bento = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 128px;
  gap: 0.7rem;

  @media (max-width: 768px) { grid-auto-rows: 116px; }
  @media (max-width: 560px) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 86px;
    gap: 0.5rem;
  }
`

const Tile = styled(motion.div)`
  grid-column: span ${p => p.$c};
  background: ${p => p.$hue}17;
  border: 1px solid ${p => p.$hue}3a;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.9rem 0.7rem;
  text-align: center;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${p => p.$hue};
    background: ${p => p.$hue}28;
  }
  &:hover svg { transform: scale(1.14) rotate(-5deg); }

  @media (max-width: 560px) {
    grid-column: span 1;
    grid-row: span ${p => p.$rm};
    gap: 0.4rem;
    padding: 0.6rem 0.5rem;
  }
`

/* Icono dentro de un círculo tintado → más presencia */
const IconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${p => p.$hue}26;
  color: ${p => p.$hue};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${floaty} 3.6s ease-in-out infinite;
  animation-delay: ${p => p.$d}s;

  svg { width: 1.55rem; height: 1.55rem; transition: transform 0.25s ease; }

  @media (max-width: 560px) {
    width: 40px;
    height: 40px;
    svg { width: 1.3rem; height: 1.3rem; }
  }
`

const TileLabel = styled.span`
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.15;
  color: var(--text-primary);

  @media (max-width: 560px) { font-size: 0.72rem; }
`

const tileVariants = {
  offscreen: { opacity: 0, scale: 0.9, y: 12 },
  onscreen: (i) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function BentoMosaic({ project }) {
  const cards = (project.highlights || []).slice(0, 6)

  return (
    <Bento role="img" aria-label={`${project.title} — ${project.subtitle}`}>
      {cards.map((label, i) => {
        const Icon = pickIcon(label)
        const hue = HUES[i % HUES.length]
        return (
          <Tile
            key={label + i}
            $c={COLSPAN[i]}
            $rm={ROWSPAN_M[i]}
            $hue={hue}
            custom={i}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            variants={tileVariants}
          >
            <IconWrap $hue={hue} $d={(i % 6) * 0.25}><Icon /></IconWrap>
            <TileLabel>{label}</TileLabel>
          </Tile>
        )
      })}
    </Bento>
  )
}
