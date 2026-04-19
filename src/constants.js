export const DATA_TYPES = [
	{ key: 'url', label: 'URL' },
	{ key: 'text', label: 'Text' },
	{ key: 'vcard', label: 'vCard' },
	{ key: 'wifi', label: 'Wi-Fi' },
	{ key: 'email', label: 'Email' },
	{ key: 'sms', label: 'SMS' },
	{ key: 'geo', label: 'Geo' },
]

export const DATA_TYPE_LABELS = Object.fromEntries(
	DATA_TYPES.map(t => [t.key, t.label]),
)
