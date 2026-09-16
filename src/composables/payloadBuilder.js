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

		const extra = fields.additionalFields || []
		const hasStructuredOrg = extra.some(f => f.type === 'org')
		if (!hasStructuredOrg && fields.org) parts.push(`ORG:${fields.org}`)

		if (fields.title) parts.push(`TITLE:${fields.title}`)
		if (fields.website) parts.push(`URL:${fields.website}`)

		for (const f of extra) {
			if (!f.type) continue
			switch (f.type) {
			case 'phone':
				if (f.value) {
					const typeMap = { mobile: 'CELL', work: 'WORK', fax: 'FAX' }
					const sub = typeMap[f.subtype] || 'CELL'
					parts.push(`TEL;TYPE=${sub}:${f.value}`)
				}
				break
			case 'url':
				if (f.value) {
					parts.push(`URL:${f.value}`)
				}
				break
			case 'org': {
				const v = f.value || {}
				const components = [v.org || '', v.dept || '', v.subdept || '']
				const trimmed = components.join(';').replace(/;+$/, '')
				if (trimmed) parts.push(`ORG:${trimmed}`)
				break
			}
			case 'nickname':
				if (f.value) parts.push(`NICKNAME:${f.value}`)
				break
			case 'bday':
				if (f.value) parts.push(`BDAY:${f.value}`)
				break
			case 'note':
				if (f.value) parts.push(`NOTE:${f.value}`)
				break
			}
		}

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
