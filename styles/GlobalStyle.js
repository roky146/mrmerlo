import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ── Sistema de color ───────────────────────────────────────────
     Fondo en tinta neutra fría (no tintado de verde) para que el verde
     funcione como SEÑAL —como un LED de estado en un panel de operaciones—
     en vez de ahogarse en su propia familia. --signal es el secundario
     (ámbar) para el segundo nivel de información.
     ─────────────────────────────────────────────────────────────── */
  :root,
  [data-theme="light"] {
    --bg: #F7F9FA;
    --bg-secondary: #EDF1F4;
    --circles: #DCE3E9;
    --text-primary: #12181E;
    --text-secondary: #5A6874;
    --btn-primary: #12181E;
    --accent: #0A7F58;     /* 4.75:1 sobre --bg → AA en labels pequeños */
    --accent-dim: #076646;
    --signal: #B4791A;
    --border: #DCE3E9;
    --nav-bg-rgb: 247, 249, 250;
    --grain: 0.055;
  }

  [data-theme="dark"] {
    --bg: #0B0F13;
    --bg-secondary: #10161D;
    --circles: #16212B;
    --text-primary: #E9EEF3;
    --text-secondary: #8FA0AF;
    --btn-primary: #E9EEF3;
    --accent: #35D69A;
    --accent-dim: #23A97A;
    --signal: #F2B441;
    --border: #1F2A33;
    --nav-bg-rgb: 11, 15, 19;
    --grain: 0.035;
  }

  :root {
    /* Major Mono Display: SOLO el logo (voz de marca, ilegible en textos) */
    --font-brand: 'Major Mono Display', ui-monospace, monospace;
    /* Mono legible: labels estructurales (no decoración) */
    --font-mono: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', monospace;
  }

  html {
    scroll-behavior: auto;
    /* Always reserve scrollbar gutter so layout never shifts */
    scrollbar-gutter: stable;
  }

  body {
    background-color: var(--bg);
    color: var(--text-primary);
    font-family: 'Satoshi', 'Inter', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Grano de papel: textura fija sobre todo el lienzo (ambos temas) */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 9997;
    pointer-events: none;
    opacity: var(--grain, 0.04);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  /* Cursor personalizado en punteros finos (mouse/trackpad).
     !important para pisar cualquier cursor pointer/text de componentes,
     que era lo que hacia reaparecer el cursor normal del SO. */
  @media (pointer: fine) {
    *, *::before, *::after { cursor: none !important; }
  }

  /* ── Hide scrollbar (layout reserved via scrollbar-gutter: stable) ── */
  ::-webkit-scrollbar { display: none; }
  * { scrollbar-width: none; }

  /* (cursor: none aplicado globalmente arriba con !important) */

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    border: none;
    background: none;
    font-family: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ::selection {
    background: var(--accent);
    color: var(--text-primary);
  }

  /* Smooth scroll via Lenis — no CSS scroll-behavior needed */
  html.lenis {
    height: auto;
  }
  .lenis.lenis-smooth {
    scroll-behavior: auto;
  }
  .lenis.lenis-smooth [data-lenis-prevent] {
    overscroll-behavior: contain;
  }

  /* ── Accesibilidad ── */

  /* Skip-link: oculto hasta recibir foco por teclado */
  .skip-link {
    position: absolute;
    left: -9999px;
    top: 0;
    z-index: 10001;
    background: var(--text-primary);
    color: var(--bg);
    padding: 0.75rem 1.25rem;
    border-radius: 0 0 8px 0;
    font-size: 0.85rem;
    font-weight: 500;
  }
  .skip-link:focus { left: 0; }

  /* Foco visible por teclado (el cursor personalizado se oculta con pointer:fine) */
  :focus-visible {
    outline: 2px solid var(--accent-dim);
    outline-offset: 2px;
  }

  /* Respetar prefers-reduced-motion: desactiva animaciones/transiciones pesadas */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }
`

export default GlobalStyle
