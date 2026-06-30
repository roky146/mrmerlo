import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root,
  [data-theme="light"] {
    --bg: #F0FAF4;
    --bg-secondary: #E4F5EB;
    --circles: #B8DFC8;
    --text-primary: #1A1A1A;
    --text-secondary: #666666;
    --btn-primary: #1A1A1A;
    --accent: #A8E6C1;
    --accent-dim: #7ACD9F;
    --border: #D0E8DA;
    --nav-bg-rgb: 240, 250, 244;
  }

  [data-theme="dark"] {
    --bg: #0D1A12;
    --bg-secondary: #121F17;
    --circles: #1B3325;
    --text-primary: #EDF7F1;
    --text-secondary: #7A9E8A;
    --btn-primary: #EDF7F1;
    --accent: #52B788;
    --accent-dim: #40916C;
    --border: #2E523E;
    --nav-bg-rgb: 13, 26, 18;
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

  /* Custom cursor only on real pointer devices (mouse/trackpad, not touch) */
  @media (pointer: fine) {
    body { cursor: none; }
  }

  /* ── Hide scrollbar (layout reserved via scrollbar-gutter: stable) ── */
  ::-webkit-scrollbar { display: none; }
  * { scrollbar-width: none; }

  @media (pointer: fine) {
    a, button { cursor: none; }
  }

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
`

export default GlobalStyle
