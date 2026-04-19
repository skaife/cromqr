<template>
	<div class="qr-mini" v-html="svgContent" />
</template>

<script>
import { ref, watch } from 'vue'
import QRCode from 'qrcode'

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
		const svgContent = ref('')

		async function generate() {
			if (!props.payload) {
				svgContent.value = ''
				return
			}
			try {
				svgContent.value = await QRCode.toString(props.payload, {
					type: 'svg',
					width: 80,
					margin: 1,
					color: {
						dark: props.styleOpts.fgColor || '#000000',
						light: props.styleOpts.bgColor || '#ffffff',
					},
					errorCorrectionLevel: 'M',
				})
			} catch {
				svgContent.value = ''
			}
		}

		watch(() => [props.payload, props.styleOpts], generate, { immediate: true, deep: true })

		return { svgContent }
	},
}
</script>

<style scoped>
.qr-mini {
	width: 80px;
	height: 80px;
}

.qr-mini :deep(svg) {
	width: 100%;
	height: 100%;
}
</style>
