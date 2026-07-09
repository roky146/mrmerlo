import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext'
import { useContact } from '../../contexts/ContactContext'

const FooterSection = styled.footer`
  padding: 4rem 4rem 2.5rem;
  border-top: 1px solid var(--border);

  @media (max-width: 768px) { padding: 3rem 1.5rem 2rem; }
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  gap: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const WorkTogether = styled(motion.h2)`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: clamp(2rem, 5.5vw, 2.5rem);
  font-weight: 450;
  letter-spacing: -0.03em;
  line-height: 1.1;
  max-width: 500px;
  white-space: pre-line;
`

const EmailBtn = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--btn-primary);
  color: var(--bg);
  padding: 1rem 2rem;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  white-space: nowrap;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.2s;

  &:hover { opacity: 0.8; }
`

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border);

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
`

const BottomText = styled.span`
  font-size: 0.82rem;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
`

export default function Footer() {
  const { t } = useLang()
  const { open: openContact } = useContact()

  return (
    <FooterSection>
      <TopRow>
        <WorkTogether
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('footer_heading')}
        </WorkTogether>
        <EmailBtn
          as="button"
          type="button"
          onClick={openContact}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {t('footer_cta')}
        </EmailBtn>
      </TopRow>
      <BottomRow>
        <BottomText>{t('footer_tagline')}</BottomText>
        <BottomText>{t('footer_credit')}</BottomText>
      </BottomRow>
    </FooterSection>
  )
}
