/* ──────────────────────────────────────────────────────────────
   Portero de mrmerlo.com (Cloudflare Worker delante del export estático).

   · Mantenimiento OFF → sirve el sitio tal cual.
   · Mantenimiento ON  → los visitantes ven una página 503 de mantenimiento;
     quien tenga la cookie de vista previa ve el sitio real (con una
     etiqueta "solo tú lo ves").
   · Panel privado en /__mantenimiento: entrar con la clave, activar/
     desactivar el modo y gestionar la vista previa.

   Estado:  KV  SITE_STATE  → clave "maintenance" = "on" | "off"
   Clave:   secreto MAINTENANCE_KEY (wrangler secret put MAINTENANCE_KEY)
   Sin secreto configurado el modo nunca se activa (falla abierto).
   ────────────────────────────────────────────────────────────── */

const ADMIN = '/__mantenimiento'
const PREVIEW_COOKIE = 'mm_preview'
const PREVIEW_DAYS = 30
// Siempre públicos aunque haya mantenimiento (buscadores y vistas previas sociales)
const ALWAYS_PUBLIC = new Set(['/robots.txt', '/og-image.png', '/icon.svg', '/site.webmanifest'])

/* Caché del estado dentro del isolate para no leer KV en cada petición */
let memo = { value: null, at: 0 }
const MEMO_MS = 15_000

async function maintenanceOn(env) {
  if (!env.MAINTENANCE_KEY || !env.SITE_STATE) return false
  const now = Date.now()
  if (memo.value !== null && now - memo.at < MEMO_MS) return memo.value
  const v = (await env.SITE_STATE.get('maintenance', { cacheTtl: 30 })) === 'on'
  memo = { value: v, at: now }
  return v
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/* Comparación en tiempo constante */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function getCookie(req, name) {
  const raw = req.headers.get('Cookie') || ''
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return v.join('=')
  }
  return null
}

async function previewToken(env) {
  return sha256(`mrmerlo-preview:${env.MAINTENANCE_KEY}`)
}

async function hasPreview(req, env) {
  if (!env.MAINTENANCE_KEY) return false
  const c = getCookie(req, PREVIEW_COOKIE)
  return c ? safeEqual(c, await previewToken(env)) : false
}

const prefersEn = (req) => {
  const al = (req.headers.get('Accept-Language') || '').toLowerCase()
  return !al.startsWith('es') && /(^|,)\s*en/.test(al)
}

const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
}

/* ── Página pública de mantenimiento ── */
function maintenancePage(req) {
  const en = prefersEn(req)
  const T = en
    ? { lang: 'en', title: 'Under maintenance — mrmerlo.com', h: 'Back very soon.', p: 'I’m polishing the site and adding new projects. Meanwhile, you can reach me directly.', s: 'Maintenance in progress' }
    : { lang: 'es', title: 'En mantenimiento — mrmerlo.com', h: 'Vuelvo muy pronto.', p: 'Estoy puliendo el sitio y sumando proyectos nuevos. Mientras tanto, puedes escribirme directamente.', s: 'Mantenimiento en curso' }

  const html = `<!doctype html>
<html lang="${T.lang}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${T.title}</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0B0F13">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<style>
  :root{--bg:#0B0F13;--fg:#E9EEF3;--mut:#8FA0AF;--acc:#35D69A;--bd:#1F2A33}
  *{margin:0;box-sizing:border-box}
  html,body{height:100%}
  body{background:var(--bg);color:var(--fg);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
    display:grid;place-items:center;padding:1.5rem;overflow:hidden}
  body::before{content:"";position:fixed;inset:0;opacity:.5;pointer-events:none;
    background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='32'%3E%3Cpath d='M32 0L64 16L32 32L0 16Z' fill='none' stroke='rgb(143,160,175)' stroke-opacity='.14'/%3E%3C/svg%3E");
    -webkit-mask-image:radial-gradient(circle at 50% 45%,#000 0%,transparent 70%);mask-image:radial-gradient(circle at 50% 45%,#000 0%,transparent 70%)}
  main{position:relative;max-width:34rem;text-align:center}
  .logo{width:56px;height:56px;margin:0 auto 2rem}
  .status{display:inline-flex;align-items:center;gap:.6rem;font:500 .72rem/1 ui-monospace,Consolas,monospace;
    letter-spacing:.14em;text-transform:uppercase;color:var(--mut);border:1px solid var(--bd);padding:.55rem .9rem;margin-bottom:1.6rem}
  .dot{width:8px;height:8px;border-radius:50%;background:var(--acc);box-shadow:0 0 0 0 rgba(53,214,154,.6);animation:p 1.8s infinite}
  @keyframes p{70%{box-shadow:0 0 0 10px rgba(53,214,154,0)}100%{box-shadow:0 0 0 0 rgba(53,214,154,0)}}
  h1{font-size:clamp(2.2rem,7vw,3.4rem);font-weight:800;letter-spacing:-.045em;line-height:1;margin-bottom:1rem}
  p{color:var(--mut);line-height:1.7;margin-bottom:2rem}
  .links{display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap}
  a{font:500 .8rem/1 ui-monospace,Consolas,monospace;color:var(--fg);text-decoration:none;border:1.5px solid var(--bd);padding:.8rem 1.1rem;transition:border-color .2s,color .2s}
  a:hover,a:focus-visible{border-color:var(--acc);color:var(--acc);outline:none}
  @media (prefers-reduced-motion:reduce){.dot{animation:none}}
</style></head>
<body><main>
  <svg class="logo" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="none" stroke="#E9EEF3" stroke-width="2.2"/><path d="M10 22 L10 11 L16 16.5 L22 11 L22 22" fill="none" stroke="#E9EEF3" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
  <div class="status"><span class="dot" aria-hidden="true"></span>${T.s}</div>
  <h1>${T.h}</h1>
  <p>${T.p}</p>
  <div class="links">
    <a href="mailto:marcosrodriguezmerlo@gmail.com">marcosrodriguezmerlo@gmail.com</a>
    <a href="https://wa.me/18295870648" rel="noopener">WhatsApp</a>
  </div>
</main></body></html>`

  return new Response(html, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '3600',
      'Cache-Control': 'no-store',
      ...SECURITY,
    },
  })
}

/* ── Etiqueta "solo tú lo ves" sobre el sitio real en vista previa ── */
function withPreviewBadge(res) {
  const ct = res.headers.get('Content-Type') || ''
  const headers = new Headers(res.headers)
  headers.set('Cache-Control', 'no-store')
  headers.set('X-Robots-Tag', 'noindex')
  const out = new Response(res.body, { status: res.status, statusText: res.statusText, headers })
  if (!ct.includes('text/html')) return out
  const badge = `<a href="${ADMIN}" style="position:fixed;left:16px;bottom:16px;z-index:2147483647;display:inline-flex;align-items:center;gap:8px;padding:9px 13px;background:#0B0F13;color:#E9EEF3;border:1px solid #35D69A;font:500 12px/1 ui-monospace,Consolas,monospace;letter-spacing:.04em;text-decoration:none;box-shadow:0 8px 24px rgba(0,0,0,.35)"><span style="width:7px;height:7px;border-radius:50%;background:#F2B441"></span>Mantenimiento activo · solo tú ves el sitio</a>`
  return new HTMLRewriter().on('body', { element(el) { el.append(badge, { html: true }) } }).transform(out)
}

/* ── Panel privado ── */
function adminPage({ state, authed, configured, msg }) {
  const on = state === 'on'
  const body = !configured
    ? `<h1>Falta configurar la clave</h1>
       <p>Ejecuta en la carpeta del proyecto <code>npx wrangler secret put MAINTENANCE_KEY</code> y escribe una clave larga. Mientras no exista, el modo mantenimiento no se puede activar y el sitio sigue público.</p>`
    : !authed
      ? `<h1>Panel de mantenimiento</h1>
         ${msg ? `<p class="err">${msg}</p>` : ''}
         <form method="post">
           <input type="hidden" name="action" value="login">
           <label>Clave<input type="password" name="key" autocomplete="current-password" required autofocus></label>
           <button>Entrar</button>
         </form>`
      : `<h1>Mantenimiento</h1>
         <p class="state ${on ? 'on' : 'off'}"><span></span>${on ? 'ACTIVO — los visitantes ven la página de mantenimiento' : 'DESACTIVADO — el sitio es público'}</p>
         ${msg ? `<p class="ok">${msg}</p>` : ''}
         <form method="post">
           <input type="hidden" name="action" value="${on ? 'off' : 'on'}">
           <button class="${on ? '' : 'warn'}">${on ? 'Desactivar mantenimiento' : 'Activar mantenimiento'}</button>
         </form>
         <div class="row">
           <a href="/">Ver el sitio →</a>
           <form method="post"><input type="hidden" name="action" value="logout"><button class="link">Cerrar sesión en este dispositivo</button></form>
         </div>
         <p class="note">Tu vista previa dura ${PREVIEW_DAYS} días en este navegador. Los cambios tardan hasta ~1 minuto en llegar a todo el mundo.</p>`

  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>Mantenimiento — mrmerlo.com</title>
<style>
  *{margin:0;box-sizing:border-box}
  body{background:#0B0F13;color:#E9EEF3;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;min-height:100vh;display:grid;place-items:center;padding:1.5rem}
  main{width:100%;max-width:30rem;border:1px solid #1F2A33;background:#10161D;padding:2rem;border-radius:0 22px 0 0}
  h1{font-size:1.6rem;letter-spacing:-.03em;margin-bottom:1.2rem}
  p{color:#8FA0AF;line-height:1.6;margin-bottom:1.2rem;font-size:.93rem}
  code{font-family:ui-monospace,Consolas,monospace;color:#35D69A;font-size:.85em}
  label{display:grid;gap:.5rem;font:500 .72rem ui-monospace,Consolas,monospace;letter-spacing:.12em;text-transform:uppercase;color:#8FA0AF;margin-bottom:1.2rem}
  input{font:inherit;font-size:1rem;letter-spacing:0;text-transform:none;color:#E9EEF3;background:transparent;border:none;border-bottom:1.5px solid #1F2A33;padding:.5rem 0;outline:none}
  input:focus{border-color:#35D69A}
  button{font:500 .85rem ui-monospace,Consolas,monospace;padding:.85rem 1.3rem;border:2px solid #E9EEF3;background:#E9EEF3;color:#0B0F13;cursor:pointer}
  button.warn{background:#F2B441;border-color:#F2B441}
  button.link{background:none;border:none;color:#8FA0AF;padding:0;text-decoration:underline}
  .row{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin:1.6rem 0 1rem;flex-wrap:wrap}
  a{color:#35D69A;font:500 .85rem ui-monospace,Consolas,monospace;text-decoration:none}
  .state{display:flex;gap:.6rem;align-items:center;font:500 .78rem ui-monospace,Consolas,monospace;color:#E9EEF3}
  .state span{width:9px;height:9px;border-radius:50%;flex:none}
  .state.on span{background:#F2B441}.state.off span{background:#35D69A}
  .ok{color:#35D69A}.err{color:#E5484D}.note{font-size:.8rem;margin:0}
</style></head><body><main>${body}</main></body></html>`
}

function htmlResponse(html, extra = {}, status = 200) {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
      ...SECURITY,
      ...extra,
    },
  })
}

function redirect(location, cookie) {
  const headers = { Location: location, 'Cache-Control': 'no-store' }
  if (cookie) headers['Set-Cookie'] = cookie
  return new Response(null, { status: 303, headers })
}

async function admin(req, env) {
  const configured = Boolean(env.MAINTENANCE_KEY && env.SITE_STATE)
  if (!configured) return htmlResponse(adminPage({ configured }))

  const authed = await hasPreview(req, env)
  const state = (await env.SITE_STATE.get('maintenance')) === 'on' ? 'on' : 'off'
  const url = new URL(req.url)

  if (req.method === 'POST') {
    const form = await req.formData()
    const action = String(form.get('action') || '')

    if (action === 'login') {
      const ok = safeEqual(await sha256(String(form.get('key') || '')), await sha256(env.MAINTENANCE_KEY))
      if (!ok) {
        await new Promise((r) => setTimeout(r, 900)) // frena la fuerza bruta
        return htmlResponse(adminPage({ state, authed: false, configured, msg: 'Clave incorrecta.' }), {}, 401)
      }
      const cookie = `${PREVIEW_COOKIE}=${await previewToken(env)}; Path=/; Max-Age=${PREVIEW_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`
      return redirect(ADMIN, cookie)
    }

    if (!authed) return redirect(ADMIN)

    if (action === 'on' || action === 'off') {
      await env.SITE_STATE.put('maintenance', action)
      memo = { value: action === 'on', at: Date.now() }
      return redirect(`${ADMIN}?m=${action}`)
    }
    if (action === 'logout') {
      return redirect('/', `${PREVIEW_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`)
    }
    return redirect(ADMIN)
  }

  const m = url.searchParams.get('m')
  const msg = m === 'on' ? 'Mantenimiento activado.' : m === 'off' ? 'Mantenimiento desactivado.' : ''
  return htmlResponse(adminPage({ state, authed, configured, msg }))
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url)

    if (url.pathname === ADMIN || url.pathname === `${ADMIN}/`) return admin(req, env)

    if (!(await maintenanceOn(env)) || ALWAYS_PUBLIC.has(url.pathname)) {
      return env.ASSETS.fetch(req)
    }

    if (await hasPreview(req, env)) return withPreviewBadge(await env.ASSETS.fetch(req))

    return maintenancePage(req)
  },
}
