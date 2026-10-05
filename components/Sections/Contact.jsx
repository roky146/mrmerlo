import { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext'
import { CONTACT } from '../../data/site'
import { Section, Eyebrow, Title, reveal } from './ui'

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 4rem;
  align-items: start;
  @media (max-width: 900px) { grid-template-columns: 1fr; gap: 2.5rem; }
`

const Sub = styled(motion.p)`
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 42ch;
  margin: -1.5rem 0 2.5rem;
`

const Direct = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  small { color: var(--text-secondary); letter-spacing: 0.1em; text-transform: uppercase; font-size: 0.68rem; }
  a { color: var(--text-primary); border-bottom: 1px solid var(--border); width: fit-content; transition: color 0.2s, border-color 0.2s; }
  a:hover { color: var(--accent); border-color: var(--accent); }
`

const Form = styled(motion.form)`
  display: grid;
  gap: 1.6rem;
  padding: 2.2rem;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  border-radius: 0 28px 0 0;
  @media (max-width: 600px) { padding: 1.5rem; }
`

const Field = styled.label`
  display: grid;
  gap: 0.5rem;
  span {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-secondary);
    transition: color 0.2s;
  }
  &:focus-within span { color: var(--accent); }

  input, textarea {
    font: inherit;
    font-size: 1rem;
    color: var(--text-primary);
    background: transparent;
    border: none;
    border-bottom: 1.5px solid var(--border);
    padding: 0.55rem 0;
    outline: none;
    resize: vertical;
    transition: border-color 0.25s;
  }
  input:focus, textarea:focus { border-color: var(--accent); }
  input:user-invalid, textarea:user-invalid { border-color: #E5484D; }
`

const Honeypot = styled.input`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
`

const Send = styled.button`
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  padding: 0.85rem 1.5rem;
  border: 2px solid var(--text-primary);
  background: var(--btn-primary);
  color: var(--bg);
  transition: opacity 0.2s;
  i { font-style: normal; transition: transform 0.25s ease; }
  &:hover i { transform: translateX(4px); }
  &:disabled { opacity: 0.6; }
`

const Status = styled(motion.p)`
  font-size: 0.88rem;
  line-height: 1.6;
  color: ${(p) => (p.$tone === 'err' ? '#E5484D' : 'var(--accent)')};
  a { color: inherit; border-bottom: 1px solid currentColor; }
`

export default function Contact() {
  const { t } = useLang()
  const [status, setStatus] = useState('idle') // idle | sending | ok | err | mailto

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    if (fd.get('botcheck')) return
    const name = String(fd.get('name')).trim()
    const email = String(fd.get('email')).trim()
    const message = String(fd.get('message')).trim()

    // Sin clave de Web3Forms → abre el correo con el mensaje redactado
    if (!CONTACT.formKey) {
      const subject = encodeURIComponent(`mrmerlo.com — ${name}`)
      const body = encodeURIComponent(`${message}\n\n— ${name} <${email}>`)
      window.location.href = `${CONTACT.mailto}?subject=${subject}&body=${body}`
      setStatus('mailto')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(CONTACT.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: CONTACT.formKey,
          subject: `mrmerlo.com — ${name}`,
          from_name: 'mrmerlo.com',
          name, email, message,
        }),
      })
      const json = await res.json()
      if (json.success) { setStatus('ok'); form.reset() } else setStatus('err')
    } catch {
      setStatus('err')
    }
  }

  const mail = <a href={CONTACT.mailto}>{CONTACT.email}</a>

  return (
    <Section id="contact" aria-labelledby="contact-title">
      <Layout>
        <div>
          <Eyebrow {...reveal(0)}>{t('cf_label')}</Eyebrow>
          <Title id="contact-title" {...reveal(1)}>{t('cf_title')}</Title>
          <Sub {...reveal(2)}>{t('cf_sub')}</Sub>
          <Direct {...reveal(3)}>
            <small>{t('cf_direct')}</small>
            {mail}
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp · {CONTACT.phone}</a>
          </Direct>
        </div>

        <Form onSubmit={onSubmit} {...reveal(2)}>
          <Field>
            <span>{t('cf_name')}</span>
            <input name="name" type="text" autoComplete="name" required maxLength={80} />
          </Field>
          <Field>
            <span>{t('cf_email')}</span>
            <input name="email" type="email" autoComplete="email" required maxLength={120} />
          </Field>
          <Field>
            <span>{t('cf_message')}</span>
            <textarea name="message" rows={5} required minLength={10} maxLength={2000} />
          </Field>
          <Honeypot type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <Send type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? t('cf_sending') : t('cf_send')} <i aria-hidden="true">→</i>
          </Send>

          <div aria-live="polite">
            <AnimatePresence mode="wait">
              {status === 'ok' && (
                <Status key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {t('cf_ok')}
                </Status>
              )}
              {status === 'mailto' && (
                <Status key="mailto" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {t('cf_mailto')} {mail}
                </Status>
              )}
              {status === 'err' && (
                <Status key="err" $tone="err" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {t('cf_err')} {mail}
                </Status>
              )}
            </AnimatePresence>
          </div>
        </Form>
      </Layout>
    </Section>
  )
}
