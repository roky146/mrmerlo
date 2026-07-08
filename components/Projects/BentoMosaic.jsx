import styled from 'styled-components'
import { motion } from 'framer-motion'

/* Mosaico/bento de tiles de distintos tamaños.
   Reutilizado en la home (Featured) y en el detalle de proyecto.
   Mantiene la línea visual: tiles con el color del proyecto a distintas opacidades. */

const Bento = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: ${p => (p.$compact ? '80px' : '92px')};
  gap: 0.6rem;

  @media (max-width: 768px) { grid-auto-rows: 74px; }
  @media (max-width: 420px) { grid-template-columns: repeat(2, 1fr); }
`

const SPAN = [
  { c: 2, r: 2 }, { c: 1, r: 1 }, { c: 1, r: 2 }, { c: 2, r: 1 },
  { c: 1, r: 1 }, { c: 2, r: 1 }, { c: 1, r: 1 }, { c: 1, r: 1 },
]
const ALPHA = ['58', '33', '44', '22', '4d', '2e', '3a', '26']

const Tile = styled(motion.div)`
  grid-column: span ${p => p.$c};
  grid-row: span ${p => p.$r};
  background: ${p => p.$bg};
  border: 1px solid var(--border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.6rem;
  overflow: hidden;
  color: var(--text-primary);

  @media (max-width: 420px) {
    grid-column: span ${p => Math.min(p.$c, 2)};
  }
`

const TileLabel = styled.span`
  font-size: ${p => (p.$big ? '1.15rem' : '0.8rem')};
  font-weight: ${p => (p.$big ? 700 : 500)};
  font-family: ${p => (p.$big ? "'Gilroy','Satoshi',sans-serif" : 'inherit')};
  letter-spacing: ${p => (p.$big ? '-0.01em' : '0.03em')};
  line-height: 1.2;
`

const tileVariants = {
  offscreen: { opacity: 0, scale: 0.94 },
  onscreen: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.45, ease: 'easeOut' },
  }),
}

export default function BentoMosaic({ project, compact = false }) {
  const tiles = [
    { label: project.title, big: true },
    ...(project.highlights || []).map((h) => ({ label: h, big: false })),
  ].slice(0, SPAN.length)

  return (
    <Bento $compact={compact} role="img" aria-label={`${project.title} — ${project.subtitle}`}>
      {tiles.map((tile, i) => (
        <Tile
          key={tile.label + i}
          $c={SPAN[i].c}
          $r={SPAN[i].r}
          $bg={project.color + ALPHA[i]}
          custom={i}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.2 }}
          variants={tileVariants}
        >
          <TileLabel $big={tile.big}>{tile.label}</TileLabel>
        </Tile>
      ))}
    </Bento>
  )
}
