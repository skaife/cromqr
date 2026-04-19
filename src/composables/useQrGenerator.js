import QRCode from 'qrcode'

export function useQrGenerator() {
	function getOpts(style) {
		return {
			margin: 2,
			color: {
				dark: style?.fgColor || '#000000',
				light: style?.bgColor || '#ffffff',
			},
			errorCorrectionLevel: 'M',
		}
	}

	async function generateSvgString(payload, style) {
		return QRCode.toString(payload, {
			...getOpts(style),
			type: 'svg',
			width: 512,
		})
	}

	async function generatePngDataUrl(payload, style) {
		return QRCode.toDataURL(payload, {
			...getOpts(style),
			type: 'image/png',
			width: 512,
		})
	}

	function triggerDownload(blob, filename) {
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	async function downloadSvg(payload, style, name) {
		const svg = await generateSvgString(payload, style)
		const blob = new Blob([svg], { type: 'image/svg+xml' })
		triggerDownload(blob, `${name}.svg`)
	}

	async function downloadPng(payload, style, name) {
		const dataUrl = await generatePngDataUrl(payload, style)
		const response = await fetch(dataUrl)
		const blob = await response.blob()
		triggerDownload(blob, `${name}.png`)
	}

	return { generateSvgString, generatePngDataUrl, downloadSvg, downloadPng }
}
