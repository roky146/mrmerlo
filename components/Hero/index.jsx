import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import IsoGrid from '../IsoGrid'
import { useLang } from '../../contexts/LanguageContext'
import { useContact } from '../../contexts/ContactContext'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const HeroSection = styled.section`
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 0 4rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
    align-items: center;
    text-align: center;
  }
`

/* ── Orb keyframes ──────────────────────────────────────────── */
const float1 = keyframes`
  0%,100% { transform: translate(0px,   0px)   scale(1);    }
  30%      { transform: translate(-28px, 40px)  scale(1.06); }
  60%      { transform: translate(20px, -25px)  scale(0.94); }
`
const float2 = keyframes`
  0%,100% { transform: translate(0px,  0px)   scale(1);    }
  35%     { transform: translate(35px, -30px)  scale(1.08); }
  70%     { transform: translate(-18px, 22px)  scale(0.96); }
`
const float3 = keyframes`
  0%,100% { transform: translate(0px,  0px)   scale(1);    }
  40%     { transform: translate(-22px, 28px)  scale(1.04); }
  75%     { transform: translate(14px, -18px)  scale(0.97); }
`

const OrbsLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`

const OrbBase = styled.div`
  position: absolute;
  border-radius: 50%;
  will-change: transform;
`

const Orb1 = styled(OrbBase)`
  width:  clamp(320px, 42vw, 620px);
  height: clamp(320px, 42vw, 620px);
  background: radial-gradient(circle, var(--accent) 0%, transparent 68%);
  opacity: 0.35;
  right: -8%;
  bottom: 5%;
  filter: blur(90px);
  animation: ${float1} 20s ease-in-out infinite;

  @media (max-width: 768px) {
    filter: blur(50px);
    opacity: 0.18;
  }
`

const Orb2 = styled(OrbBase)`
  width:  clamp(220px, 32vw, 480px);
  height: clamp(220px, 32vw, 480px);
  background: radial-gradient(circle, var(--accent-dim) 0%, transparent 68%);
  opacity: 0.22;
  left: 38%;
  top: -8%;
  filter: blur(90px);
  animation: ${float2} 26s ease-in-out infinite;

  @media (max-width: 768px) {
    filter: blur(50px);
    opacity: 0.12;
  }
`

const Orb3 = styled(OrbBase)`
  width:  clamp(180px, 22vw, 320px);
  height: clamp(180px, 22vw, 320px);
  background: radial-gradient(circle, var(--circles) 0%, transparent 68%);
  opacity: 0.45;
  left: -4%;
  top: 18%;
  filter: blur(90px);
  animation: ${float3} 30s ease-in-out infinite;

  @media (max-width: 768px) {
    filter: blur(50px);
    opacity: 0.22;
  }
`

/* ── Scan lines overlay ──────────────────────────────────────── */
const ScanLines = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(128, 128, 128, 0.03) 3px,
    rgba(128, 128, 128, 0.03) 4px
  );
  background-size: 100% 4px;

  @media (max-width: 768px) { opacity: 0.6; }
`

const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  max-width: 820px;
  padding-top: clamp(5rem, 9vh, 7rem);
  padding-bottom: clamp(1rem, 2vh, 2.5rem);
`

const Eyebrow = styled(motion.p)`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: clamp(1.1rem, 2.2vw, 1.6rem);
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;

  &::before {
    content: '';
    display: inline-block;
    width: 28px;
    height: 1.5px;
    background: var(--text-secondary);
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    justify-content: center;
    font-size: clamp(1.05rem, 4.5vw, 1.4rem);
  }
`

/* "Marcos" → enlace a /about (subrayado para indicar que es clicable) */
const NameLink = styled(Link)`
  color: var(--text-primary);
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 3px;
  text-decoration-color: var(--accent-dim);
  transition: color 0.2s, text-decoration-color 0.2s;

  &:hover { color: var(--accent-dim); }
`

const Headline = styled.h1`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: clamp(2.6rem, 7vw, 4.8rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--text-primary);
  margin-bottom: clamp(0.8rem, 2vh, 1.5rem);

  @media (max-width: 768px) {
    font-size: clamp(2.8rem, 12vw, 4rem);
  }
`

const HeadlineLine = styled.span`
  display: block;
  overflow: hidden;
`

const HeadlineInner = styled(motion.span)`
  display: block;
`

const Description = styled(motion.p)`
  font-family: 'Satoshi', 'Inter', sans-serif;
  font-size: clamp(0.85rem, 1.3vw, 1rem);
  color: var(--text-secondary);
  max-width: 480px;
  line-height: 1.7;
  margin-bottom: clamp(1.4rem, 3vh, 2.4rem);

  strong {
    color: var(--text-primary);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    margin-left: auto;
    margin-right: auto;
  }
`

const CTARow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--btn-primary);
  color: var(--bg);
  padding: 0.85rem 1.8rem;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: 8px;
  transition: opacity 0.2s, transform 0.2s;

  &:hover {
    opacity: 0.82;
    transform: translateY(-2px);
  }
`

const CTASecondary = styled.a`
  display: inline-flex;
  align-items: center;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
  border: 2px solid var(--text-secondary);
  padding: 0.85rem 1.8rem;
  border-radius: 8px;
  transition: color 0.2s, border-color 0.2s, transform 0.2s;

  &:hover {
    color: var(--text-primary);
    border-color: var(--text-primary);
    transform: translateY(-2px);
  }
`

/* ── Fixed scroll indicator ── */
const FixedScrollWrap = styled(motion.div)`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    display: none;
  }
`

const ScrollPill = styled.div`
  width: 28px;
  height: 48px;
  border: 2px solid var(--text-primary);
  border-radius: 999px;
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 3px;
    height: 8px;
    background: var(--text-primary);
    border-radius: 999px;
    animation: scrollDot 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }

  @keyframes scrollDot {
    0%   { top: 6px;  opacity: 1; }
    70%  { top: 28px; opacity: 0; }
    100% { top: 6px;  opacity: 0; }
  }
`

const ScrollLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-primary);
  line-height: 1;
`

const lineAnim = (i) => ({
  hidden: { y: '110%' },
  visible: {
    y: 0,
    transition: { duration: 0.8, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }
  }
})

export default function Hero() {
  const sectionRef  = useRef(null)
  const headlineRef = useRef(null)
  const ctaRef      = useRef(null)
  const { t } = useLang()
  const { open: openContact } = useContact()

  const [indicatorTop, setIndicatorTop] = useState(null)
  const [faded, setFaded] = useState(false)

  /* ── Sync fixed scroll-indicator Y position to CTARow ── */
  useEffect(() => {
    const sync = () => {
      if (!ctaRef.current) return
      const r = ctaRef.current.getBoundingClientRect()
      const natural = r.top + r.height / 2
      const safe = Math.min(natural, window.innerHeight - 90)
      setIndicatorTop(safe)
    }
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  /* ── Fade scroll indicator once user starts scrolling ── */
  useEffect(() => {
    const onScroll = () => setFaded(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Headline blur-out on scroll (GSAP ST) ── */
  useEffect(() => {
    if (!sectionRef.current || !headlineRef.current) return

    const tween = gsap.to(headlineRef.current, {
      opacity: 0,
      filter: 'blur(10px)',
      y: -40,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=280',
        scrub: true,
      }
    })

    return () => tween.scrollTrigger?.kill()
  }, [])

  const lines = [t('hero_line1'), t('hero_line2'), t('hero_line3')]

  return (
    <HeroSection ref={sectionRef}>

      {/* ── Background: gradient orbs ── */}
      <OrbsLayer>
        <Orb1 />
        <Orb2 />
        <Orb3 />
      </OrbsLayer>

      {/* ── Scan lines texture ── */}
      <ScanLines />

      <HeroContent>

        <Eyebrow
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <span>{t('hero_eyebrow')} <NameLink href="/about">Marcos</NameLink></span>
        </Eyebrow>

        <div ref={headlineRef}>
          <Headline>
            {lines.map((line, i) => (
              <HeadlineLine key={i}>
                <HeadlineInner
                  initial="hidden"
                  animate="visible"
                  variants={lineAnim(i)}
                >
                  {line}
                </HeadlineInner>
              </HeadlineLine>
            ))}
          </Headline>
        </div>

        <Description
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          {t('hero_desc')}
        </Description>

        <CTARow
          ref={ctaRef}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.72 }}
        >
          {/* Primary: Ver proyectos */}
          <CTAButton href="/#projects">{t('hero_cta_primary')}</CTAButton>
          {/* Secondary: abre el modal de contacto */}
          <CTASecondary as="button" type="button" onClick={openContact}>{t('hero_cta_secondary')}</CTASecondary>

          {indicatorTop !== null && (
            <FixedScrollWrap
              style={{ top: indicatorTop }}
              initial={{ opacity: 0 }}
              animate={{ opacity: faded ? 0 : 1 }}
              transition={{ duration: 0.5, delay: faded ? 0 : 0.9 }}
            >
              <ScrollPill />
              <ScrollLabel>{t('hero_scroll')}</ScrollLabel>
            </FixedScrollWrap>
          )}
        </CTARow>

      </HeroContent>

      <IsoGrid />

    </HeroSection>
  )
}
