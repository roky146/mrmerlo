import styled from 'styled-components'
import { motion } from 'framer-motion'

/* Piezas compartidas por las secciones de la home */

export const Section = styled.section`
  padding: 7rem 4rem;
  scroll-margin-top: 5rem;

  @media (max-width: 768px) { padding: 4.5rem 1.5rem; }
`

export const Eyebrow = styled(motion.p)`
  font-family: var(--font-mono);
  font-size: clamp(0.72rem, 1.2vw, 0.85rem);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1rem;
`

export const Title = styled(motion.h2)`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: clamp(2rem, 5vw, 3.4rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.98;
  margin-bottom: 3rem;
  max-width: 18ch;
`

/* Reveal escalonado reutilizable */
export const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
})

/* Foco de luz que sigue al puntero dentro de una tarjeta (solo CSS vars, sin re-render) */
export const spotlight = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

/* Patrón de rejilla isométrica para huecos sin imagen (coherente con el hero) */
export const isoPattern = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='32'><path d='M32 0L64 16L32 32L0 16Z' fill='none' stroke='rgb(143,160,175)' stroke-opacity='0.16'/></svg>"
)}")`
