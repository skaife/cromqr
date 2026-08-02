<template>
	<div class="generator-panel">
		<TypeSelector :model-value="dataType" @update:model-value="onTypeChange" />

		<div class="generator-content">
			<div class="form-section">
				<component
					:is="formComponent"
					:fields="fields"
					@update:fields="onFieldsUpdate" />
			</div>

			<QrPreview
				:payload="payload"
				:fg-color="style.fgColor"
				:bg-color="style.bgColor"
				:logo-path="style.logo"
				:show-placeholder="stylesMode && !payload"
				@update:fg-color="val => style.fgColor = val"
				@update:bg-color="val => style.bgColor = val"
				@update:logo-path="val => style.logo = val" />

			<ActionBar
				:is-saved="isSaved"
				:has-payload="!!payload"
				:has-logo="!!style.logo"
				:name="name"
				:styles-mode="stylesMode"
				:is-plain-style="isPlainStyle"
				@save="onSave"
				@export="onExport"
				@download-svg="onDownloadSvg"
				@download-png="onDownloadPng"
				@delete="onDelete"
				@update:name="val => name = val"
				@save-new-style="$emit('save-new-style', currentStyleData)"
				@update-style="$emit('update-style', currentStyleData)"
				@delete-style="$emit('delete-style')" />
		</div>
	</div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import TypeSelector from './TypeSelector.vue'
import QrPreview from './QrPreview.vue'
import ActionBar from './ActionBar.vue'
import UrlForm from './forms/UrlForm.vue'
import TextForm from './forms/TextForm.vue'
import VcardForm from './forms/VcardForm.vue'
import WifiForm from './forms/WifiForm.vue'
import EmailForm from './forms/EmailForm.vue'
import SmsForm from './forms/SmsForm.vue'
import GeoForm from './forms/GeoForm.vue'
import { useQrGenerator } from '../composables/useQrGenerator.js'
import { useExport } from '../composables/useExport.js'
import { buildPayload } from '../composables/payloadBuilder.js'
import { generateUUID } from '../utils/uuid.js'

const FORM_MAP = {
	url: UrlForm,
	text: TextForm,
	vcard: VcardForm,
	wifi: WifiForm,
	email: EmailForm,
	sms: SmsForm,
	geo: GeoForm,
}

export default {
	name: 'GeneratorPanel',
	components: {
		TypeSelector,
		QrPreview,
		ActionBar,
		UrlForm,
		TextForm,
		VcardForm,
		WifiForm,
		EmailForm,
		SmsForm,
		GeoForm,
	},
	props: {
		entry: { type: Object, default: null },
		isSaved: { type: Boolean, default: false },
		stylesMode: { type: Boolean, default: false },
		isPlainStyle: { type: Boolean, default: false },
		appliedStyle: { type: Object, default: null },
	},
	emits: ['save', 'update', 'delete', 'save-new-style', 'update-style', 'delete-style'],
	setup(props, { emit }) {
		const dataType = ref('url')
		const fields = ref({})
		const style = ref({ fgColor: '#000000', bgColor: '#ffffff', logo: null })
		const name = ref('')
		const { downloadSvg, downloadPng, generatePngDataUrl } = useQrGenerator()
		const { exportToFiles } = useExport()

		const formComponent = computed(() => FORM_MAP[dataType.value] || UrlForm)

		const payload = computed(() => buildPayload(dataType.value, fields.value))

		const currentStyleData = computed(() => ({
			fgColor: style.value.fgColor,
			bgColor: style.value.bgColor,
			logo: style.value.logo,
		}))

		watch(() => props.entry, (entry) => {
			if (entry) {
				dataType.value = entry.dataType || 'url'
				fields.value = { ...(entry.fields || {}) }
				style.value = {
					fgColor: '#000000',
					bgColor: '#ffffff',
					logo: null,
					...(entry.style || {}),
				}
				name.value = entry.name || ''
			} else {
				dataType.value = 'url'
				fields.value = {}
				style.value = { fgColor: '#000000', bgColor: '#ffffff', logo: null }
				name.value = ''
			}
		}, { immediate: true })

		watch(() => props.appliedStyle, (applied) => {
			if (applied) {
				style.value = {
					fgColor: applied.fgColor || '#000000',
					bgColor: applied.bgColor || '#ffffff',
					logo: applied.logo || null,
				}
			}
		})

		function onTypeChange(type) {
			if (!props.isSaved) {
				dataType.value = type
				fields.value = {}
			}
		}

		function onFieldsUpdate(newFields) {
			fields.value = { ...newFields }
		}

		function onSave() {
			const data = {
				$id: props.entry?.$id || self.crypto?.randomUUID?.() || generateUUID(),
				name: name.value,
				folder: props.entry?.folder || '',
				dataType: dataType.value,
				payload: payload.value,
				fields: { ...fields.value },
				style: { ...style.value },
			}
			if (props.isSaved) {
				emit('update', data)
			} else {
				emit('save', data)
			}
		}

		async function onExport() {
			if (!payload.value) return
			const dataUrl = await generatePngDataUrl(payload.value, style.value)
			await exportToFiles(dataUrl, name.value || 'qrcode')
		}

		function onDownloadSvg() {
			if (payload.value) {
				downloadSvg(payload.value, style.value, name.value || 'qrcode')
			}
		}

		function onDownloadPng() {
			if (payload.value) {
				downloadPng(payload.value, style.value, name.value || 'qrcode')
			}
		}

		function onDelete() {
			if (props.entry) {
				emit('delete', props.entry.$id)
			}
		}

		return {
			dataType,
			fields,
			style,
			name,
			payload,
			formComponent,
			currentStyleData,
			onTypeChange,
			onFieldsUpdate,
			onSave,
			onExport,
			onDownloadSvg,
			onDownloadPng,
			onDelete,
		}
	},
}
</script>

<style scoped>
.generator-panel {
	padding: 20px;
	max-width: 640px;
	margin: 0 auto;
}

.generator-content {
	margin-top: 16px;
}

.form-section {
	margin-bottom: 16px;
}
</style>
