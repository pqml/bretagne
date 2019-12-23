const w = window
const log = (...str) => console.log(...str)

export default function matomo () {
	let initialized = false
	w._paq = w._paq || []

	const api = { load, pageView, action }
	return api

	function load () {
		if (!IS_PRODUCTION) {
			log('Analytics disabled on non-production environments')
			initialized = true
		}
		if (initialized) return
		;(function () {
			const u = '//analytics.lucaslebihan.fr/'
			w._paq.push(['setTrackerUrl', u + 'matomo.php'])
			w._paq.push(['setSiteId', '1'])
			const g = document.createElement('script')
			const s = document.getElementsByTagName('script')[0]
			g.type = 'text/javascript'
			g.async = true
			g.defer = true
			g.src = u + 'matomo.js'
			s.parentNode.insertBefore(g, s)
		})()
		initialized = true
		return api
	}

	function pageView ({ title, url, referrer }) {
		log('Page view:', title, url, referrer)

		if (referrer) w._paq.push(['setReferrerUrl', referrer])
		w._paq.push(['setCustomUrl', url])
		w._paq.push(['setDocumentTitle', title])

		w._paq.push(['setGenerationTimeMs', 0])
		w._paq.push(['trackPageView'])

		// w._paq.push(['MediaAnalytics::scanForMedia', content])
		// w._paq.push(['FormAnalytics::scanForForms', content])
		// w._paq.push(['trackContentImpressionsWithinNode', content])
		w._paq.push(['enableLinkTracking'])
	}

	function action ({ category, action, name, value }) {
		log('Action:', category, action, name, value)
		w._paq.push(['trackEvent', category, action, name, value])
	}
}
