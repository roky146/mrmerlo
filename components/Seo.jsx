import Head from 'next/head'
import { SITE } from '../data/site'

/* SEO por página: title, description, canonical y overrides de OG/Twitter.
   Los metadatos globales (og:type, image, twitter:card, etc.) viven en _document. */
export default function Seo({ title, description, path = '/', noindex = false }) {
  const canonical = path === '/' ? SITE.url : `${SITE.url}${path}`
  const desc = description || SITE.description
  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.authorName} — ${SITE.name}`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* Overrides por página */}
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Head>
  )
}
