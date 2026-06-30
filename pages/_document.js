import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Manrope:wght@300;400;500;600;700&display=swap"
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
        {/* Base SEO — individual pages can override via <Head> */}
        <meta name="description" content="Marcos Rodríguez Merlo — Ingeniero de Producción TI, estudiante de Ciberseguridad y desarrollador creativo desde Santo Domingo, RD. Construyo herramientas digitales y convierto la lógica en experiencias que funcionan." />
        <meta name="author" content="Marcos Rodríguez Merlo" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:locale"      content="es_DO" />
        <meta property="og:url"         content="https://mrmerlo.com" />
        <meta property="og:site_name"   content="mrmerlo.com" />
        <meta property="og:title"       content="Marcos Rodríguez — mrmerlo.com" />
        <meta property="og:description" content="Convierto la lógica en soluciones. Ingeniero de Producción TI · Ciberseguridad · Desarrollo Web." />
        <meta property="og:image"       content="https://mrmerlo.com/og-image.png" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content="mrmerlo.com — Marcos Rodríguez" />

        {/* Twitter / X card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="@roky146" />
        <meta name="twitter:creator"     content="@roky146" />
        <meta name="twitter:title"       content="Marcos Rodríguez — mrmerlo.com" />
        <meta name="twitter:description" content="Convierto la lógica en soluciones." />
        <meta name="twitter:image"       content="https://mrmerlo.com/og-image.png" />

        {/* Theme */}
        <meta name="theme-color" content="#F0FAF4" />
        <meta name="color-scheme" content="light" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://mrmerlo.com" />
      </Head>
      <body>
        {/* Black intro curtain — rendered in raw HTML so it appears before any JS */}
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
