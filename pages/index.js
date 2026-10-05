import Hero from '../components/Hero'
import FeaturedProjects from '../components/Projects/Featured'
import WebShowcase from '../components/Sections/WebShowcase'
import Proof from '../components/Sections/Proof'
import Contact from '../components/Sections/Contact'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import JsonLd from '../components/JsonLd'
import { useLang } from '../contexts/LanguageContext'
import { graph, profilePageSchema, webDevServiceSchema } from '../data/site'

export default function Home() {
  const { t } = useLang()
  return (
    <>
      <Seo path="/" rawTitle={t('seo_title')} description={t('seo_desc')} />
      <JsonLd data={graph(profilePageSchema(), webDevServiceSchema())} />
      <main id="main-content">
        <Hero />
        <FeaturedProjects />
        <WebShowcase />
        <Proof />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
