<template>
	<div class="qr-preview-section">
		<div class="qr-preview-container">
			<div v-if="payload" class="qr-preview" v-html="svgContent" />
			<div v-else class="qr-placeholder">
				Enter data to generate a QR code
			</div>
		</div>

		<div class="style-controls">
			<label class="color-control">
				<span>Foreground</span>
				<input type="color" :value="fgColor" @input="$emit('update:fgColor', $event.target.value)">
			</label>
			<label class="color-control">
				<span>Background</span>
				<input type="color" :value="bgColor" @input="$emit('update:bgColor', $event.target.value)">
			</label>
		</div>
	</div>
</template>

<script>
import { ref, watch } from 'vue'
import QRCode from 'qrcode'

export default {
	name: 'QrPreview',
	props: {
		payload: { type: String, default: '' },
		fgColor: { type: String, default: '#000000' },
		bgColor: { type: String, default: '#ffffff' },
	},
	emits: ['update:fgColor', 'update:bgColor'],
	setup(props) {
		const svgContent = ref('')
		let debounceTimer = null

		function generate() {
			if (!props.payload) {
				svgContent.value = ''
				return
			}
			clearTimeout(debounceTimer)
			debounceTimer = setTimeout(async () => {
				try {
					svgContent.value = await QRCode.toString(props.payload, {
						type: 'svg',
						width: 256,
						margin: 2,
						color: {
							dark: props.fgColor,
							light: props.bgColor,
						},
						errorCorrectionLevel: 'M',
					})
				} catch {
					svgContent.value = ''
				}
			}, 300)
		}

		watch(() => [props.payload, props.fgColor, props.bgColor], generate, { immediate: true })

		return { svgContent }
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

.qr-preview :deep(svg) {
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
