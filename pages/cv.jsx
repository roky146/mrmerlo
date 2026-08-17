import styled from 'styled-components'
import Seo from '../components/Seo'
import { useLang } from '../contexts/LanguageContext'
import { CV } from '../data/cv'
import { CONTACT, SITE } from '../data/site'

/* Currículum — replica exacta del formato original (hoja carta, aside gris,
   Montserrat + Lato) con el contenido traducido al idioma que el visitante
   esté navegando. El botón abre el diálogo de impresión → "Guardar como PDF". */

const Stage = styled.main`
  padding: 7.5rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;

  @media print {
    padding: 0 !important;
    margin: 0 !important;
    gap: 0;
    display: block;
  }
`

const Bar = styled.div`
  width: 100%;
  max-width: 816px;
  display: flex;
  justify-content: flex-end;
  @media print { display: none; }
`

const DownloadBtn = styled.button`
  font-family: var(--font-mono);
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  border: 2px solid var(--text-primary);
  border-radius: 0 0 14px 0;
  background: var(--btn-primary);
  color: var(--bg);
  padding: 0.7rem 1.3rem;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  transition: opacity 0.2s, transform 0.2s;
  svg { width: 1rem; height: 1rem; }
  &:hover { opacity: 0.85; transform: translateY(-2px); }
`

/* ── La hoja ── */
const Page = styled.section`
  width: 100%;
  max-width: 816px;             /* 8.5in @96dpi — tamaño carta */
  display: flex;
  font-family: Lato, sans-serif;
  color: #1f1f1f;
  background: #ffffff;
  letter-spacing: 0.1px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);

  @media (max-width: 720px) { flex-direction: column; }

  /* En papel: la hoja mide exactamente una carta (8.5in × 11in),
     así el contenido encaja sin recortes ni márgenes fantasma. */
  @media print {
    display: flex !important;
    flex-direction: row !important;
    width: 8.5in !important;
    max-width: 8.5in !important;
    min-height: 10.98in;        /* el aside gris llega hasta el borde inferior */
    margin: 0 !important;
    box-shadow: none !important;
    background: #ffffff !important;
    color: #1f1f1f !important;
    overflow: hidden;
  }
`

const Aside = styled.aside`
  width: 245px;
  flex: 0 0 245px;
  background: #ebebeb;
  padding: 116px 26px 34px 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 26px;

  /* En móvil va DEBAJO: primero el nombre y el contenido principal */
  @media (max-width: 720px) {
    width: 100%;
    flex: none;
    padding: 30px 26px 34px;
    order: 2;
  }
  @media print {
    width: 2.55in !important;        /* 245px — misma proporción que en pantalla */
    flex: 0 0 2.55in !important;
    padding: 1.2in 0.27in 0.35in 0.31in !important;
    background: #ebebeb !important;
  }
`

const Main = styled.div`
  flex: 1;
  padding: 40px 44px 34px 34px;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 720px) { padding: 30px 26px; order: 1; }
  @media print { padding: 0.42in 0.46in 0.35in 0.35in !important; }
`

const Block = styled.div``

const SideLabel = styled.div`
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  font-size: 11.5px;
  letter-spacing: 2.4px;
  line-height: 1.5;
  text-transform: uppercase;
`

const MainLabel = styled.div`
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  font-size: 11.5px;
  letter-spacing: 2.6px;
  text-transform: uppercase;
`

const Rule = styled.div`
  height: 1px;
  background: #1f1f1f;
  margin: ${p => p.$m || '8px 0 14px'};
`

const SideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${p => p.$gap || '11px'};
  font-size: 11.5px;
  line-height: ${p => p.$lh || '1.45'};
`

const FieldKey = styled.div`
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  font-size: 9.5px;
  letter-spacing: 0.9px;
  text-transform: uppercase;
  color: #4a4a4a;
`

const Link = styled.a`
  color: inherit;
  border-bottom: 1px solid #9a9a9a;
`

const LangRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const LangLevel = styled.span`
  color: #4a4a4a;
  font-size: 10px;
  letter-spacing: 0.6px;
`

const Header = styled.header`
  border: 1.5px solid #1f1f1f;
  padding: 26px 20px 22px;
  text-align: center;
  margin-bottom: 30px;
`
const Name = styled.h1`
  margin: 0;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  font-size: 25px;
  line-height: 1.24;
  letter-spacing: 2.6px;
  text-transform: uppercase;
`
const RoleLine = styled.div`
  margin-top: 10px;
  font-family: Montserrat, sans-serif;
  font-size: 10.5px;
  letter-spacing: 2.2px;
  text-transform: uppercase;
  color: #4a4a4a;
`

const Profile = styled.p`
  margin: 0 0 26px;
  font-size: 12.3px;
  line-height: 1.58;
  text-wrap: pretty;
`

const Entries = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 26px;

  /* que ninguna entrada se parta entre páginas */
  > div { break-inside: avoid; page-break-inside: avoid; }
`
const EntryTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
`
const EntryTitle = styled.div`
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  font-size: 12.6px;
`
const EntryPlace = styled.div`
  font-size: 10.5px;
  color: #4a4a4a;
  white-space: nowrap;
`
const EntryPeriod = styled.div`
  font-size: 11px;
  color: #4a4a4a;
  margin: 2px 0 5px;
`
const EntryDesc = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  text-wrap: pretty;
`
const Refs = styled.div`
  margin-top: 22px;
  font-size: 11px;
  color: #4a4a4a;
`

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12" /><path d="m7 12 5 5 5-5" /><path d="M4 21h16" />
  </svg>
)

const COUNTRY = {
  es: 'Rep. Dominicana', en: 'Dominican Republic', it: 'Rep. Dominicana',
  fr: 'Rép. dominicaine', pt: 'Rep. Dominicana',
}

export default function CvPage() {
  const { lang } = useLang()
  const t = (o) => (o && typeof o === 'object' && !Array.isArray(o) ? (o[lang] ?? o.es) : o)
  const L = CV.L

  return (
    <>
      <Seo
        title={t(L.title)}
        description={`${t(L.title)} — ${CV.name}. ${t(CV.role)}.`}
        path="/cv/"
      />

      <Stage id="main-content">
        <Bar>
          <DownloadBtn onClick={() => window.print()}>
            <DownloadIcon /> {t(L.download)}
          </DownloadBtn>
        </Bar>

        <Page>
          <Aside>
            <Block>
              <SideLabel>{t(L.contact)}</SideLabel>
              <Rule />
              <SideList>
                <div>
                  <FieldKey>{t(L.location)}</FieldKey>
                  <div>Santo Domingo, {t(COUNTRY)}</div>
                </div>
                <div>
                  <FieldKey>{t(L.email)}</FieldKey>
                  <div>{CONTACT.email}</div>
                </div>
                <div>
                  <FieldKey>{t(L.portfolio)}</FieldKey>
                  <div><Link href={SITE.url}>mrmerlo.com</Link></div>
                </div>
                <div>
                  <FieldKey>LinkedIn</FieldKey>
                  <div>in/marcos-rodríguez-merlo</div>
                </div>
                <div>
                  <FieldKey>{t(L.nat)}</FieldKey>
                  <div>{t(CV.nationality)}</div>
                </div>
              </SideList>
            </Block>

            <Block>
              <SideLabel>{t(L.skills)}</SideLabel>
              <Rule />
              <SideList $gap="7.5px" $lh="1.35">
                {CV.skills.map((s, i) => <div key={i}>{t(s)}</div>)}
              </SideList>
            </Block>

            <Block>
              <SideLabel>{t(L.langs)}</SideLabel>
              <Rule />
              <SideList $gap="10px">
                {CV.languages.map((l, i) => (
                  <LangRow key={i}>
                    <span>{t(l.name)}</span>
                    <LangLevel>{t(l.level)}</LangLevel>
                  </LangRow>
                ))}
              </SideList>
            </Block>

            <Block>
              <SideLabel>{t(L.certs)}</SideLabel>
              <Rule />
              <SideList $lh="1.4">
                {CV.certifications.map((c, i) => <div key={i}>{t(c)}</div>)}
              </SideList>
            </Block>
          </Aside>

          <Main>
            <Header>
              <Name>Marcos Junior<br />Rodríguez Merlo</Name>
              <RoleLine>{t(CV.role)}</RoleLine>
            </Header>

            <MainLabel>{t(L.profile)}</MainLabel>
            <Rule $m="8px 0 12px" />
            <Profile>{t(CV.profile)}</Profile>

            <MainLabel>{t(L.exp)}</MainLabel>
            <Rule />
            <Entries>
              {CV.experience.map((e, i) => (
                <div key={i}>
                  <EntryTop>
                    <EntryTitle>{t(e.title)} · {e.org}</EntryTitle>
                    <EntryPlace>{t(e.place)}</EntryPlace>
                  </EntryTop>
                  <EntryPeriod>{t(e.period)}</EntryPeriod>
                  <EntryDesc>{t(e.desc)}</EntryDesc>
                </div>
              ))}
            </Entries>

            <MainLabel>{t(L.edu)}</MainLabel>
            <Rule />
            <Entries>
              {CV.education.map((e, i) => (
                <div key={i}>
                  <EntryTop>
                    <EntryTitle>{t(e.title)} · {e.org}</EntryTitle>
                    <EntryPlace>{e.period}</EntryPlace>
                  </EntryTop>
                  <EntryDesc>{t(e.desc)}</EntryDesc>
                </div>
              ))}
            </Entries>

            <Refs>{t(L.refs)}</Refs>
          </Main>
        </Page>
      </Stage>
    </>
  )
}
