import styled from 'styled-components'
import { motion } from 'framer-motion'
import { isoPattern } from '../Sections/ui'

/* Capturas / GIFs / vídeos del proyecto.
   - .mp4/.webm → <video> en bucle (mucho más ligero que un GIF)
   - .gif/.png/.webp/.jpg → <img> diferida
   - src: null → hueco reservado con la rejilla de la marca */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;

  > :first-child { grid-column: 1 / -1; }
  @media (max-width: 680px) { grid-template-columns: 1fr; }
`

const Frame = styled(motion.figure)`
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  overflow: hidden;
  &:first-child { border-radius: 0 0 22px 0; }
`

const Box = styled.div`
  aspect-ratio: 16 / 10;
  display: grid;
  place-items: center;
  background: var(--bg) ${isoPattern};
  border-bottom: 1px solid var(--border);
  img, video { width: 100%; height: 100%; object-fit: cover; display: block; }
`

const Pending = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  border: 1px dashed var(--border);
  padding: 0.45rem 0.8rem;
`

const Caption = styled.figcaption`
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--text-secondary);
  padding: 0.8rem 1rem;
`

const isVideo = (src) => /\.(mp4|webm)$/i.test(src || '')

export default function MediaGallery({ items, pendingLabel }) {
  if (!items?.length) return null
  return (
    <Grid>
      {items.map((m, i) => (
        <Frame
          key={i}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <Box>
            {!m.src ? (
              <Pending>{pendingLabel}</Pending>
            ) : isVideo(m.src) ? (
              <video src={m.src} autoPlay muted loop playsInline preload="metadata" aria-label={m.caption} />
            ) : (
              <img src={m.src} alt={m.caption} loading="lazy" decoding="async" />
            )}
          </Box>
          <Caption>{m.caption}</Caption>
        </Frame>
      ))}
    </Grid>
  )
}
