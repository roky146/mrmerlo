import { Html, Head, Main, NextScript } from 'next/document'
import { graph, personSchema, websiteSchema, SITE } from '../data/site'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Tema por defecto OSCURO (respeta la preferencia guardada) — antes del primer pintado, sin flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: "(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();",
          }}
        />

        {/* Fuentes — preconnect a todos los orígenes para reducir latencia */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://gistcdn.githack.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Manrope:wght@300;400;500;600;700&family=Major+Mono+Display&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://gistcdn.githack.com/mfd/09b70eb47474836f25a21660282ce0bc/raw/e06a670afcb2b861d85a6e6713cb4f3cd995af67/Gilroy.css"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/css?f[]=satoshi@400,500,700&display=swap"
        />

        {/* SEO global — el resto (title, description, canonical, og:url/title…) va por página vía <Seo> */}
        <meta name="author" content="Marcos Rodríguez Merlo" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1" />

        {/* Open Graph (constantes) */}
        <meta property="og:type"         content="website" />
        <meta property="og:locale"       content="es_DO" />
        <meta property="og:site_name"    content="mrmerlo.com" />
        <meta property="og:image"        content={SITE.image} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content="mrmerlo.com — Marcos Rodríguez Merlo" />

        {/* Twitter / X card (constantes) */}
        <meta name="twitter:card"    content="summary_large_image" />
        <meta name="twitter:site"    content="@roky146" />
        <meta name="twitter:creator" content="@roky146" />
        <meta name="twitter:image"   content={SITE.image} />

        {/* Theme (claro/oscuro) */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#F0FAF4" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)"  content="#0D1A12" />

        {/* Iconos / manifest */}
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Datos estructurados globales: Person + WebSite (identidad canónica para SEO/GEO/LLMO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph(personSchema(), websiteSchema())) }}
        />
      </Head>
      <body>
        {/* Skip-link (accesibilidad / teclado) */}
        <a className="skip-link" href="#main-content">Saltar al contenido</a>

        {/* Cortina de intro negra — HTML crudo para que aparezca antes de cualquier JS */}
        <div
          id="__page-intro"
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            zIndex: 10000,
            pointerEvents: 'none',
            clipPath: 'inset(0 0 0% 0)',
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
