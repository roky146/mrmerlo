import Head from 'next/head'
import Hero from '../components/Hero'
import FeaturedProjects from '../components/Projects/Featured'
import MoreProjects from '../components/Projects/MoreProjects'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>Marcos Rodríguez — mrmerlo.com</title>
        <meta name="description" content="Marcos Rodríguez Merlo — Ingeniero de Producción TI, estudiante de Ciberseguridad y desarrollador creativo desde Santo Domingo, RD." />
        <link rel="canonical" href="https://mrmerlo.com" />
        <meta property="og:url"   content="https://mrmerlo.com" />
        <meta property="og:title" content="Marcos Rodríguez — mrmerlo.com" />
      </Head>
      <main>
        <Hero />
        <FeaturedProjects />
        <MoreProjects />
        <Footer />
      </main>
    </>
  )
}
