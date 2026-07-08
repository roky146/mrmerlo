import Hero from '../components/Hero'
import FeaturedProjects from '../components/Projects/Featured'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import JsonLd from '../components/JsonLd'
import { graph, profilePageSchema, webDevServiceSchema } from '../data/site'

export default function Home() {
  return (
    <>
      <Seo path="/" />
      <JsonLd data={graph(profilePageSchema(), webDevServiceSchema())} />
      <main id="main-content">
        <Hero />
        <FeaturedProjects />
        <Footer />
      </main>
    </>
  )
}
