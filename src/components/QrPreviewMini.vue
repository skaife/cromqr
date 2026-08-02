<template>
	<div class="qr-mini">
		<canvas ref="canvasRef" width="80" height="80" />
	</div>
</template>

<script>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import QRCode from 'qrcode'
import { useQrGenerator } from '../composables/useQrGenerator.js'

export default {
	name: 'QrPreviewMini',
	props: {
		payload: { type: String, default: '' },
		styleOpts: {
			type: Object,
			default: () => ({ fgColor: '#000000', bgColor: '#ffffff' }),
		},
	},
	setup(props) {
		const canvasRef = ref(null)
		const { loadLogoImage, drawLogoOnCanvas } = useQrGenerator()
		let currentLogoUrl = null

		async function generate() {
			const canvas = canvasRef.value
			if (!canvas) return

			if (!props.payload) {
				const ctx = canvas.getContext('2d')
				ctx.clearRect(0, 0, 80, 80)
				return
			}

			const hasLogo = !!props.styleOpts.logo

			try {
				await QRCode.toCanvas(canvas, props.payload, {
					width: 80,
					margin: 1,
					color: {
						dark: props.styleOpts.fgColor || '#000000',
						light: props.styleOpts.bgColor || '#ffffff',
					},
					errorCorrectionLevel: hasLogo ? 'H' : 'M',
				})

				if (hasLogo) {
					const loaded = await loadLogoImage(props.styleOpts.logo)
					if (loaded) {
						if (currentLogoUrl) URL.revokeObjectURL(currentLogoUrl)
						currentLogoUrl = loaded.objectUrl
						const ctx = canvas.getContext('2d')
						drawLogoOnCanvas(ctx, loaded.img, 80)
					}
				}
			} catch {
				// invalid payload
			}
		}

		watch(() => [props.payload, props.styleOpts], () => nextTick(generate), { immediate: true, deep: true })

		onBeforeUnmount(() => {
			if (currentLogoUrl) URL.revokeObjectURL(currentLogoUrl)
		})

		return { canvasRef }
	},
}
</script>

<style scoped>
.qr-mini {
	width: 80px;
	height: 80px;
}

.qr-mini canvas {
	width: 100%;
	height: 100%;
}
</style>
