import styled from 'styled-components'
import { motion } from 'framer-motion'

/* ──────────────────────────────────────────────────────────────
   Bento de 6 tiles con TRATAMIENTOS DISTINTOS (no una rejilla de
   tarjetas iguales): type-led, sólido invertido, icono suelto,
   regla, ghost y línea. Un ÚNICO hue por proyecto usado con
   moderación, radios mixtos (incluidas esquinas rectas) y
   jerarquía tipográfica real. Sin iconos en círculo tintado.

   Para meter capturas más adelante: si un highlight se define como
   { label, src }, el tile 'shot' pinta la imagen a sangre.
   ────────────────────────────────────────────────────────────── */

const S = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
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
const IconSpark   = () => <S><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5-2.5 2.5"/></S>

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
  if (/react/.test(l)) return IconAtom
  if (/node/.test(l)) return IconServer
  if (/(pos|caja|venta)/.test(l)) return IconReceipt
  if (/automat/.test(l)) return IconBolt
  return IconSpark
}

/* ── Texturas de fondo: patrones SVG generados, temáticos de cada
   concepto (sin stock, sin licencias, peso ~0). Algunas con grano. ── */
const enc = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
const svgWrap = (w, h, inner, noise) =>
  `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
  (noise
    ? `<filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter>` +
      `<rect width='100%' height='100%' filter='url(#g)' opacity='0.35'/>`
    : '') +
  inner + '</svg>'

const TEX = {
  /* malla de nodos: clusters, kubernetes, sharding */
  nodes: (c, n) => svgWrap(120, 120,
    `<g fill='none' stroke='${c}' stroke-width='1.1' opacity='0.85'>` +
    `<path d='M20 22 60 44 100 22M20 22 20 66M60 44 60 98M100 22 100 66M20 66 60 98M100 66 60 98'/></g>` +
    `<g fill='${c}'><circle cx='20' cy='22' r='3.2'/><circle cx='60' cy='44' r='3.2'/><circle cx='100' cy='22' r='3.2'/>` +
    `<circle cx='20' cy='66' r='3.2'/><circle cx='100' cy='66' r='3.2'/><circle cx='60' cy='98' r='3.2'/></g>`, n),
  /* flujo bidireccional: APIs, Graphman, RestMan */
  flow: (c, n) => svgWrap(120, 90,
    `<g fill='none' stroke='${c}' stroke-width='1.3' stroke-linecap='round' opacity='0.9'>` +
    `<path d='M10 26h72l-12-11M110 62H38l12 11'/><path d='M10 62h14M96 26h14'/></g>`, n),
  /* celosía blindada: mTLS, seguridad, distroless */
  shield: (c, n) => svgWrap(90, 90,
    `<g fill='none' stroke='${c}' stroke-width='1.1' opacity='0.85'>` +
    `<path d='M45 12 22 22v20c0 14 10 22 23 27 13-5 23-13 23-27V22z'/><path d='M36 44l7 7 13-14'/>` +
    `<path d='M0 0l90 90M90 0L0 90' opacity='0.15'/></g>`, n),
  /* telemetría: Zabbix, OpenTelemetry, métricas */
  wave: (c, n) => svgWrap(140, 70,
    `<g fill='none' stroke='${c}' stroke-width='1.4' stroke-linejoin='round' opacity='0.9'>` +
    `<path d='M4 50 24 50 34 26 46 58 58 38 70 44 84 18 96 50 116 50 136 34'/></g>` +
    `<g stroke='${c}' stroke-width='0.6' opacity='0.25'><path d='M0 50h140M0 26h140'/></g>`, n),
  /* trazas de circuito: React, Node, TypeScript, Flutter */
  circuit: (c, n) => svgWrap(110, 110,
    `<g fill='none' stroke='${c}' stroke-width='1.1' opacity='0.85'>` +
    `<path d='M8 20h34v34h30V22h30M8 78h26v18h44V62h24'/></g>` +
    `<g fill='${c}'><circle cx='42' cy='54' r='2.8'/><circle cx='72' cy='22' r='2.8'/><circle cx='34' cy='96' r='2.8'/><circle cx='78' cy='62' r='2.8'/></g>`, n),
  /* recibo: sistemas POS */
  receipt: (c, n) => svgWrap(100, 100,
    `<g stroke='${c}' stroke-width='1.2' opacity='0.8'><path d='M18 16h64M18 34h64M18 52h44M18 70h56'/></g>` +
    `<path d='M10 6v88l6-4 6 4 6-4 6 4' fill='none' stroke='${c}' stroke-width='1' opacity='0.5'/>`, n),
  /* impulso: automatización */
  bolt: (c, n) => svgWrap(100, 100,
    `<g fill='none' stroke='${c}' stroke-width='1.3' stroke-linejoin='round' opacity='0.85'>` +
    `<path d='M52 12 30 56h20l-6 34 26-46H50z'/></g>` +
    `<g stroke='${c}' stroke-width='0.7' opacity='0.25'><path d='M0 82h100M0 24h100'/></g>`, n),
  dots: (c, n) => svgWrap(60, 60, `<g fill='${c}' opacity='0.7'><circle cx='12' cy='12' r='2'/><circle cx='42' cy='30' r='2'/><circle cx='12' cy='48' r='2'/></g>`, n),
}

function textureFor(label, hue, noise) {
  const l = label.toLowerCase()
  let key = 'dots'
  if (/(kubernetes|k8s|cluster|shard|informer|pod)/.test(l)) key = 'nodes'
  else if (/(api|rest|graph)/.test(l)) key = 'flow'
  else if (/(mtls|tls|segur|distroless|usuario)/.test(l)) key = 'shield'
  else if (/(zabbix|telemetr|observab|metric|monitor)/.test(l)) key = 'wave'
  else if (/(react|node|typescript|flutter)/.test(l)) key = 'circuit'
  else if (/(pos|caja|venta)/.test(l)) key = 'receipt'
  else if (/automat/.test(l)) key = 'bolt'
  return enc(TEX[key](hue, noise))
}

/* Cada tile: [colspan, rowspan-móvil, tratamiento, radio] */
const LAYOUT = [
  { c: 2, rm: 2, kind: 'type',   radius: '0',          tex: true, noise: true },
  { c: 1, rm: 1, kind: 'solid',  radius: '16px' },
  { c: 1, rm: 2, kind: 'icon',   radius: '2px',        tex: true },
  { c: 2, rm: 1, kind: 'rule',   radius: '0' },
  { c: 1, rm: 1, kind: 'ghost',  radius: '12px' },
  { c: 2, rm: 1, kind: 'inline', radius: '0 0 20px 0', tex: true, noise: true },
]

const Bento = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 128px;
  gap: 0.65rem;

  @media (max-width: 768px) { grid-auto-rows: 116px; }
  @media (max-width: 560px) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 88px;
    gap: 0.5rem;
  }
`

const Tile = styled(motion.div)`
  grid-column: span ${p => p.$c};
  container-type: size;
  border-radius: ${p => p.$radius};
  padding: clamp(0.6rem, 10cqmin, 1.15rem);
  display: flex;
  overflow: hidden;
  position: relative;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;

  /* Textura temática al fondo, atenuada para que el texto contraste */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: ${p => p.$tex || 'none'};
    background-repeat: repeat;
    opacity: ${p => (p.$tex ? 0.3 : 0)};
    pointer-events: none;
  }
  /* El contenido siempre por delante de la textura */
  > * { position: relative; z-index: 1; }

  &:hover { transform: translateY(-3px); }
  &:hover::before { opacity: ${p => (p.$tex ? 0.42 : 0)}; }

  @media (max-width: 560px) {
    grid-column: span 1;
    grid-row: span ${p => p.$rm};
  }
`

/* — tratamientos — */
const TypeTile = styled(Tile)`
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background: ${p => p.$hue}14;
  border-left: 3px solid ${p => p.$hue};
`
const SolidTile = styled(Tile)`
  align-items: flex-end;
  background: ${p => p.$hue};
`
const IconTile = styled(Tile)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  border: 1px solid ${p => p.$hue}44;
  background: ${p => p.$hue}0a;
`
const RuleTile = styled(Tile)`
  align-items: flex-end;
  border-top: 3px solid ${p => p.$hue};
  background: transparent;
`
const GhostTile = styled(Tile)`
  align-items: center;
  justify-content: center;
  border: 1px dashed ${p => p.$hue}66;
`
const InlineTile = styled(Tile)`
  align-items: center;
  gap: 0.7rem;
  background: ${p => p.$hue}12;
`

const Index = styled.span`
  font-family: var(--font-mono);
  font-size: clamp(0.6rem, 9cqmin, 0.72rem);
  letter-spacing: 0.1em;
  color: ${p => p.$hue};
`
const BigLabel = styled.span`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: clamp(1.1rem, 26cqmin, 2rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 0.95;
  color: var(--text-primary);
`
const MonoLabel = styled.span`
  font-family: var(--font-mono);
  font-size: clamp(0.62rem, 11cqmin, 0.8rem);
  letter-spacing: 0.02em;
  line-height: 1.2;
  color: var(--text-primary);
`
const InvertLabel = styled(MonoLabel)`
  color: var(--bg);
  font-weight: 700;
`
const Glyph = styled.span`
  color: ${p => p.$hue};
  display: flex;
  svg { width: clamp(22px, 34cqmin, 40px); height: clamp(22px, 34cqmin, 40px); }
`
const GlyphSm = styled(Glyph)`
  svg { width: clamp(18px, 22cqmin, 26px); height: clamp(18px, 22cqmin, 26px); }
`

const variants = {
  off: { opacity: 0, y: 10 },
  on: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.055, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }),
}

export default function BentoMosaic({ project }) {
  const hue = project.color
  const cards = (project.highlights || []).slice(0, 6)

  return (
    <Bento role="img" aria-label={`${project.title} — ${project.subtitle}`}>
      {cards.map((label, i) => {
        const cfg = LAYOUT[i]
        const Icon = pickIcon(label)
        const common = {
          $c: cfg.c, $rm: cfg.rm, $radius: cfg.radius, $hue: hue,
          $tex: cfg.tex ? textureFor(label, hue, cfg.noise) : null,
          custom: i, initial: 'off', whileInView: 'on',
          viewport: { once: true, amount: 0.2 }, variants,
          key: label + i,
        }

        if (cfg.kind === 'type') return (
          <TypeTile {...common}>
            <Index $hue={hue}>{String(i + 1).padStart(2, '0')}</Index>
            <BigLabel>{label}</BigLabel>
          </TypeTile>
        )
        if (cfg.kind === 'solid') return (
          <SolidTile {...common}><InvertLabel>{label}</InvertLabel></SolidTile>
        )
        if (cfg.kind === 'icon') return (
          <IconTile {...common}>
            <Glyph $hue={hue}><Icon /></Glyph>
            <MonoLabel>{label}</MonoLabel>
          </IconTile>
        )
        if (cfg.kind === 'rule') return (
          <RuleTile {...common}><MonoLabel>{label}</MonoLabel></RuleTile>
        )
        if (cfg.kind === 'ghost') return (
          <GhostTile {...common}><MonoLabel>{label}</MonoLabel></GhostTile>
        )
        return (
          <InlineTile {...common}>
            <GlyphSm $hue={hue}><Icon /></GlyphSm>
            <MonoLabel>{label}</MonoLabel>
          </InlineTile>
        )
      })}
    </Bento>
  )
}
