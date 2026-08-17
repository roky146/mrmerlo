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

/* ── Fotografías de fondo (Unsplash License: uso comercial libre,
   sin atribución obligatoria). Servidas por el CDN de Unsplash con
   recorte y calidad reducidos: son fondos atenuados, no protagonistas.
   Se eligen por el concepto que representa cada tile. ── */
const U = (id) => `url("https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=55")`

/* Un set propio por proyecto, acorde a lo que CADA UNO es —los tres son
   software, ninguno es hardware, así que no hay racks ni cables:
   · GOD    → app de escritorio: interfaz, terminal, puesto de trabajo
   · Reccon → observabilidad: dashboards, series temporales, métricas
   · Web    → producto y diseño: wireframes, UI, código */
const SETS = {
  god: [
    U('photo-1658479657379-e0adb7cb91e8'), // terminal en pantalla — Xavier Cee
    U('photo-1618329027137-a520b57c6606'), // monitor con software — Onur Binay
    U('photo-1761446812468-d88eef0d01da'), // puesto de trabajo con monitor — Clevenider Petit
  ],
  reccon: [
    U('photo-1526628953301-3e589a6a8b74'), // pantalla de monitoreo — Stephen Dawson
    U('photo-1551288049-bebda4e38f71'),    // gráficas de rendimiento — Luke Chesser
    U('photo-1560221328-12fe60f83ab8'),    // monitor con series de datos — Nicholas Cappello
  ],
  'web-dev': [
    U('photo-1522542550221-31fd19575a2d'), // wireframes de sitios — Hal Gatewood
    U('photo-1547658719-da2b51169166'),    // monitor con producto digital — Daniel Korpai
    U('photo-1743090661053-3d1feb2beab7'), // código en pantalla — ANOOF C
  ],
}

/* Grano superpuesto para algunos tiles */
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#g)'/></svg>"
)}")`

const photosOf = (id) => SETS[id] || SETS['web-dev']

/* Cada tile: [colspan, rowspan-móvil, tratamiento, radio] */
/* 3 de los 6 tiles llevan fotografía de fondo; dos de ellos con grano */
const LAYOUT = [
  { c: 2, rm: 2, kind: 'type',   radius: '0',          img: true, noise: true },
  { c: 1, rm: 1, kind: 'solid',  radius: '16px' },
  { c: 1, rm: 2, kind: 'icon',   radius: '2px',        img: true },
  { c: 2, rm: 1, kind: 'rule',   radius: '0' },
  { c: 1, rm: 1, kind: 'ghost',  radius: '12px' },
  { c: 2, rm: 1, kind: 'inline', radius: '0 0 20px 0', img: true, noise: true },
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

  /* Fotografía de fondo, atenuada y desaturada para que el texto contraste */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: ${p => p.$img || 'none'};
    background-size: cover;
    background-position: center;
    filter: grayscale(0.4) contrast(1.05);
    opacity: ${p => (p.$img ? 0.24 : 0)};
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  /* Grano superpuesto en algunos tiles */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: ${p => (p.$grain ? GRAIN : 'none')};
    background-size: 180px 180px;
    opacity: ${p => (p.$grain ? 0.14 : 0)};
    pointer-events: none;
  }
  /* El contenido siempre por delante del fondo */
  > * { position: relative; z-index: 1; }

  &:hover { transform: translateY(-3px); }
  &:hover::before { opacity: ${p => (p.$img ? 0.34 : 0)}; }

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
  const photos = photosOf(project.id)
  let shot = 0   // reparte las 3 fotos del proyecto entre los tiles que las llevan

  return (
    <Bento role="img" aria-label={`${project.title} — ${project.subtitle}`}>
      {cards.map((label, i) => {
        const cfg = LAYOUT[i]
        const Icon = pickIcon(label)
        const common = {
          $c: cfg.c, $rm: cfg.rm, $radius: cfg.radius, $hue: hue,
          $img: cfg.img ? photos[shot++ % photos.length] : null,
          $grain: !!cfg.noise,
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
