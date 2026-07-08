import Link from 'next/link'
import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import Seo from '../components/Seo'
import { useLang } from '../contexts/LanguageContext'

/* ── Orbs (reusing Hero pattern, simplified) ─────────────────── */

const float1 = keyframes`
  0%,100% { transform: translate(0px,  0px)  scale(1);    }
  40%      { transform: translate(-20px,30px) scale(1.05); }
  70%      { transform: translate(15px,-18px) scale(0.96); }
`
const float2 = keyframes`
  0%,100% { transform: translate(0px,  0px)  scale(1);    }
  35%      { transform: translate(28px,-22px) scale(1.07); }
  65%      { transform: translate(-14px,16px) scale(0.95); }
`

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  text-align: center;
`

const OrbsLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
`

const OrbBase = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  will-change: transform;
`

const Orb1 = styled(OrbBase)`
  width:  clamp(280px, 40vw, 520px);
  height: clamp(280px, 40vw, 520px);
  background: radial-gradient(circle, var(--accent) 0%, transparent 68%);
  opacity: 0.25;
  right: -6%;
  bottom: 10%;
  animation: ${float1} 22s ease-in-out infinite;
`

const Orb2 = styled(OrbBase)`
  width:  clamp(200px, 28vw, 380px);
  height: clamp(200px, 28vw, 380px);
  background: radial-gradient(circle, var(--circles) 0%, transparent 68%);
  opacity: 0.35;
  left: -4%;
  top: 15%;
  animation: ${float2} 28s ease-in-out infinite;
`

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
`

const Eyebrow = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;

  &::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 1px;
    background: var(--text-secondary);
  }
  &::after {
    content: '';
    display: inline-block;
    width: 24px;
    height: 1px;
    background: var(--text-secondary);
  }
`

const BigCode = styled(motion.h1)`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: clamp(6rem, 20vw, 14rem);
  font-weight: 400;
  font-variation-settings: "wdth" 100, "wght" 400;
  letter-spacing: -0.05em;
  line-height: 0.9;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
`

const Message = styled(motion.p)`
  font-size: clamp(0.9rem, 1.4vw, 1.05rem);
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 400px;
  margin-bottom: 2.5rem;
`

const BackBtn = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid var(--text-primary);
  border-radius: 8px;
  padding: 0.8rem 1.8rem;
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

export default function NotFound() {
  const { t } = useLang()

  return (
    <>
      <Seo title="404" noindex path="/404/" />

      <Wrapper as="main" id="main-content">
        <OrbsLayer>
          <Orb1 />
          <Orb2 />
        </OrbsLayer>

        <Content>
          <Eyebrow
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('not_found')}
          </Eyebrow>

          <BigCode
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            404
          </BigCode>

          <Message
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {t('not_found_msg')}
          </Message>

          <BackBtn
            href="/"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {t('back_home')}
          </BackBtn>
        </Content>
      </Wrapper>
    </>
  )
}
