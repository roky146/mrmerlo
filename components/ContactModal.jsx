import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { CONTACT } from '../data/site'
import { useLang } from '../contexts/LanguageContext'

/* ── Iconos ── */
const I = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p} />
const MailIcon = () => <I><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></I>
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.24 8.24 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.25 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z"/>
  </svg>
)
const PhoneIcon = () => <I><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></I>
const CopyIcon = () => <I><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></I>
const CheckIcon = () => <I><path d="M20 6 9 17l-5-5"/></I>
const CloseIcon = () => <I><path d="M18 6 6 18M6 6l12 12"/></I>

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`

const Panel = styled(motion.div)`
  width: 100%;
  max-width: 440px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
`

const CloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: none;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, border-color 0.2s;
  svg { width: 1rem; height: 1rem; }
  &:hover { color: var(--text-primary); border-color: var(--text-primary); }
`

const Title = styled.h2`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.4rem;
`

const Lead = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`

const EmailBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  margin-bottom: 1rem;
  color: var(--text-secondary);
  svg { width: 1.1rem; height: 1.1rem; flex-shrink: 0; }
`

const Address = styled.span`
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const MiniBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  color: var(--accent-dim);
  background: none;
  border: none;
  flex-shrink: 0;
  svg { width: 0.9rem; height: 0.9rem; }
`

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`

const Btn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.85rem 1.2rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: opacity 0.2s, transform 0.2s, background 0.2s, border-color 0.2s;
  background: ${p => p.$primary ? 'var(--btn-primary)' : 'none'};
  color: ${p => p.$primary ? 'var(--bg)' : 'var(--text-primary)'};
  border: ${p => p.$primary ? '2px solid var(--btn-primary)' : '2px solid var(--border)'};
  svg { width: 1.1rem; height: 1.1rem; }

  &:hover { transform: translateY(-2px); ${p => p.$primary ? 'opacity: 0.85;' : 'border-color: var(--text-primary);'} }
`

/* Botón de teléfono: solo móvil (en desktop WhatsApp cubre teléfono) */
const PhoneBtn = styled(Btn)`
  @media (min-width: 769px) { display: none; }
`

export default function ContactModal({ isOpen, onClose }) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard no disponible */ }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Backdrop
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Panel
            role="dialog"
            aria-modal="true"
            aria-label={t('contact_title')}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <CloseBtn onClick={onClose} aria-label="Cerrar"><CloseIcon /></CloseBtn>
            <Title>{t('contact_title')}</Title>
            <Lead>{t('contact_lead')}</Lead>

            <EmailBox>
              <MailIcon />
              <Address>{CONTACT.email}</Address>
              <MiniBtn onClick={copy} aria-label={t('contact_copy')}>
                {copied ? <><CheckIcon /> {t('contact_copied')}</> : <><CopyIcon /> {t('contact_copy')}</>}
              </MiniBtn>
            </EmailBox>

            <Row>
              <Btn $primary href={CONTACT.mailto}>
                <MailIcon /> {t('contact_write_mail')}
              </Btn>
              <Btn href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> WhatsApp · {CONTACT.phone}
              </Btn>
              <PhoneBtn href={CONTACT.tel}>
                <PhoneIcon /> {t('contact_call')}
              </PhoneBtn>
            </Row>
          </Panel>
        </Backdrop>
      )}
    </AnimatePresence>
  )
}
