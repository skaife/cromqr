<template>
	<div class="qr-preview-section">
		<div class="qr-preview-container">
			<div v-if="payload || showPlaceholder" class="qr-preview">
				<canvas ref="canvasRef" width="256" height="256" />
			</div>
			<div v-else class="qr-placeholder">
				{{ t('cromqr', 'Enter data to generate a QR code') }}
			</div>
		</div>

		<div class="style-controls">
			<label class="color-control">
				<span>{{ t('cromqr', 'Foreground') }}</span>
				<input type="color" :value="fgColor" @input="$emit('update:fgColor', $event.target.value)">
			</label>
			<label class="color-control">
				<span>{{ t('cromqr', 'Background') }}</span>
				<input type="color" :value="bgColor" @input="$emit('update:bgColor', $event.target.value)">
			</label>
		</div>

		<LogoPicker
			:logo-path="logoPath"
			@update:logo-path="$emit('update:logoPath', $event)"
			@logo-loaded="onLogoLoaded" />
	</div>
</template>

<script>
import { ref, watch, nextTick } from 'vue'
import { t } from '@nextcloud/l10n'
import QRCode from 'qrcode'
import LogoPicker from './LogoPicker.vue'

export default {
	name: 'QrPreview',
	components: { LogoPicker },
	props: {
		payload: { type: String, default: '' },
		fgColor: { type: String, default: '#000000' },
		bgColor: { type: String, default: '#ffffff' },
		logoPath: { type: String, default: null },
		showPlaceholder: { type: Boolean, default: false },
	},
	emits: ['update:fgColor', 'update:bgColor', 'update:logoPath'],
	setup(props) {
		const canvasRef = ref(null)
		const logoImage = ref(null)
		let debounceTimer = null

		function onLogoLoaded(objectUrl) {
			if (!objectUrl) {
				logoImage.value = null
				render()
				return
			}
			const img = new Image()
			img.onload = () => {
				logoImage.value = img
				render()
			}
			img.onerror = () => {
				logoImage.value = null
				render()
			}
			img.src = objectUrl
		}

		function render() {
			clearTimeout(debounceTimer)
			debounceTimer = setTimeout(() => doRender(), 300)
		}

		async function doRender() {
			const canvas = canvasRef.value
			if (!canvas) return

			const text = props.payload || (props.showPlaceholder ? 'CromQR' : '')
			if (!text) {
				const ctx = canvas.getContext('2d')
				ctx.clearRect(0, 0, 256, 256)
				return
			}

			const ecLevel = logoImage.value ? 'H' : 'M'

			try {
				await QRCode.toCanvas(canvas, text, {
					width: 256,
					margin: 2,
					color: {
						dark: props.fgColor,
						light: props.bgColor,
					},
					errorCorrectionLevel: ecLevel,
				})

				if (logoImage.value) {
					const ctx = canvas.getContext('2d')
					const boxSize = Math.round(256 * 0.2)
					const boxX = Math.round((256 - boxSize) / 2)
					const boxY = Math.round((256 - boxSize) / 2)
					const pad = 4
					ctx.fillStyle = props.bgColor
					ctx.fillRect(boxX - pad, boxY - pad, boxSize + pad * 2, boxSize + pad * 2)
					const scale = Math.min(boxSize / logoImage.value.naturalWidth, boxSize / logoImage.value.naturalHeight)
					const drawW = Math.round(logoImage.value.naturalWidth * scale)
					const drawH = Math.round(logoImage.value.naturalHeight * scale)
					ctx.drawImage(logoImage.value, boxX + Math.round((boxSize - drawW) / 2), boxY + Math.round((boxSize - drawH) / 2), drawW, drawH)
				}
			} catch {
				// invalid payload
			}
		}

		watch(() => [props.payload, props.fgColor, props.bgColor, props.showPlaceholder], () => {
			nextTick(render)
		}, { immediate: true })

		return { canvasRef, onLogoLoaded, t }
	},
}
</script>

<style scoped>
.qr-preview-section {
	margin: 16px 0;
}

.qr-preview-container {
	display: flex;
	justify-content: center;
	padding: 16px;
}

.qr-preview {
	width: 256px;
	height: 256px;
}

.qr-preview canvas {
	width: 100%;
	height: 100%;
}

.qr-placeholder {
	width: 256px;
	height: 256px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2px dashed var(--color-border);
	border-radius: var(--border-radius-large);
	color: var(--color-text-maxcontrast);
	text-align: center;
	padding: 16px;
}

.style-controls {
	display: flex;
	gap: 16px;
	justify-content: center;
}

.color-control {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
}

.color-control input[type="color"] {
	width: 36px;
	height: 36px;
	border: 1px solid var(--color-border);
	border-radius: var(--border-radius);
	cursor: pointer;
	padding: 2px;
}
</style>
