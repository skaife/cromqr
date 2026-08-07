import QRCode from 'qrcode'
import axios from '@nextcloud/axios'
import { generateRemoteUrl } from '@nextcloud/router'

export function useQrGenerator() {
	function getOpts(style) {
		const hasLogo = !!style?.logo
		return {
			margin: 2,
			color: {
				dark: style?.fgColor || '#000000',
				light: style?.bgColor || '#ffffff',
			},
			errorCorrectionLevel: hasLogo ? 'H' : 'M',
		}
	}

	async function loadLogoImage(logoPath) {
		if (!logoPath) return null
		try {
			const davUrl = generateRemoteUrl(`dav/files/${window.OC.currentUser}`) + logoPath
			const response = await axios.get(davUrl, { responseType: 'arraybuffer' })
			const contentType = response.headers['content-type'] || 'image/png'
			const blob = new Blob([response.data], { type: contentType })
			const objectUrl = URL.createObjectURL(blob)

			return new Promise((resolve) => {
				const img = new Image()
				img.onload = () => resolve({ img, objectUrl })
				img.onerror = () => {
					URL.revokeObjectURL(objectUrl)
					resolve(null)
				}
				img.src = objectUrl
			})
		} catch {
			return null
		}
	}

	function drawLogoOnCanvas(ctx, logoImg, canvasSize, bgColor) {
		const boxSize = Math.round(canvasSize * 0.2)
		const boxX = Math.round((canvasSize - boxSize) / 2)
		const boxY = Math.round((canvasSize - boxSize) / 2)
		const pad = 4
		ctx.fillStyle = bgColor || '#ffffff'
		ctx.fillRect(boxX - pad, boxY - pad, boxSize + pad * 2, boxSize + pad * 2)
		const scale = Math.min(boxSize / logoImg.naturalWidth, boxSize / logoImg.naturalHeight)
		const drawW = Math.round(logoImg.naturalWidth * scale)
		const drawH = Math.round(logoImg.naturalHeight * scale)
		ctx.drawImage(logoImg, boxX + Math.round((boxSize - drawW) / 2), boxY + Math.round((boxSize - drawH) / 2), drawW, drawH)
	}

	async function generateSvgString(payload, style) {
		return QRCode.toString(payload, {
			...getOpts(style),
			type: 'svg',
			width: 512,
		})
	}

	async function generatePngDataUrl(payload, style) {
		const size = 512
		const canvas = document.createElement('canvas')
		canvas.width = size
		canvas.height = size

		await QRCode.toCanvas(canvas, payload, {
			...getOpts(style),
			width: size,
		})

		if (style?.logo) {
			const loaded = await loadLogoImage(style.logo)
			if (loaded) {
				const ctx = canvas.getContext('2d')
				drawLogoOnCanvas(ctx, loaded.img, size, style?.bgColor)
				URL.revokeObjectURL(loaded.objectUrl)
			}
		}

		return canvas.toDataURL('image/png')
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
		const parts = dataUrl.split(',')
		const byteString = atob(parts[1])
		const bytes = new Uint8Array(byteString.length)
		for (let i = 0; i < byteString.length; i++) {
			bytes[i] = byteString.charCodeAt(i)
		}
		const blob = new Blob([bytes], { type: 'image/png' })
		triggerDownload(blob, `${name}.png`)
	}

	return { generateSvgString, generatePngDataUrl, downloadSvg, downloadPng, loadLogoImage, drawLogoOnCanvas }
}
