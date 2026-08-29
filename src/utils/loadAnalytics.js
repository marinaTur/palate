// Injects GTM and Yandex Metrica's tracking scripts on demand, once the
// user has accepted cookie consent — neither script auto-loads from
// index.html anymore (see ConsentBanner.jsx). Each loader is idempotent
// (checks a window flag) so calling twice (e.g. accept-on-mount +
// accept-via-banner-click) is safe.

const GTM_ID = 'GTM-MVPK6FQQ'
const YM_COUNTER_ID = 111880697

export function loadGtm() {
  if (window.__gtmLoaded) return
  window.__gtmLoaded = true

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(script)
}

export function loadYm() {
  if (window.__ymLoaded) return
  window.__ymLoaded = true

  window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments) }
  window.ym.l = Date.now()

  const script = document.createElement('script')
  script.async = true
  script.src = `https://mc.yandex.ru/metrika/tag.js?id=${YM_COUNTER_ID}`
  document.head.appendChild(script)

  window.ym(YM_COUNTER_ID, 'init', {
    defer: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    accurateTrackBounce: true,
    trackLinks: true,
  })
}
