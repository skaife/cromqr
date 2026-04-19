export function buildPayload(dataType, fields) {
	switch (dataType) {
	case 'url':
		return fields.url || ''

	case 'text':
		return fields.text || ''

	case 'vcard': {
		const parts = ['BEGIN:VCARD', 'VERSION:3.0']
		const fn = [fields.firstName, fields.lastName].filter(Boolean).join(' ')
		if (fn) parts.push(`FN:${fn}`)
		if (fields.lastName || fields.firstName) {
			parts.push(`N:${fields.lastName || ''};${fields.firstName || ''};;;`)
		}
		if (fields.phone) parts.push(`TEL:${fields.phone}`)
		if (fields.email) parts.push(`EMAIL:${fields.email}`)
		if (fields.org) parts.push(`ORG:${fields.org}`)
		if (fields.title) parts.push(`TITLE:${fields.title}`)
		if (fields.website) parts.push(`URL:${fields.website}`)
		parts.push('END:VCARD')
		return fn ? parts.join('\n') : ''
	}

	case 'wifi': {
		const ssid = fields.ssid || ''
		if (!ssid) return ''
		const sec = fields.security || 'WPA'
		const pass = fields.password || ''
		return `WIFI:T:${sec};S:${ssid};P:${pass};;`
	}

	case 'email': {
		const to = fields.to || ''
		if (!to) return ''
		const params = []
		if (fields.subject) params.push(`subject=${encodeURIComponent(fields.subject)}`)
		if (fields.body) params.push(`body=${encodeURIComponent(fields.body)}`)
		return `mailto:${to}${params.length ? '?' + params.join('&') : ''}`
	}

	case 'sms': {
		const phone = fields.phone || ''
		if (!phone) return ''
		const msg = fields.message || ''
		return `SMSTO:${phone}:${msg}`
	}

	case 'geo': {
		const lat = fields.lat || ''
		const lng = fields.lng || ''
		if (!lat || !lng) return ''
		return `geo:${lat},${lng}`
	}

	default:
		return ''
	}
}
