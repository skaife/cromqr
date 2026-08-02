<template>
	<div class="logo-picker">
		<div class="logo-controls">
			<NcButton type="secondary" @click="chooseLogo">
				{{ t('cromqr', 'Choose a Logo') }}
			</NcButton>
			<div v-if="logoPath" class="logo-selected">
				<img v-if="logoObjectUrl" :src="logoObjectUrl" class="logo-thumbnail" :alt="t('cromqr', 'Logo preview')">
				<span class="logo-path">{{ logoFilename }}</span>
				<NcButton type="tertiary" :aria-label="t('cromqr', 'Remove logo')" @click="removeLogo">
					<template #icon>
						<Close :size="20" />
					</template>
				</NcButton>
			</div>
			<div v-if="logoError" class="logo-warning">
				{{ t('cromqr', 'Logo file not found') }}
			</div>
		</div>
	</div>
</template>

<script>
import { NcButton } from '@nextcloud/vue'
import { t } from '@nextcloud/l10n'
import { ref, watch, onBeforeUnmount, computed } from 'vue'
import axios from '@nextcloud/axios'
import { generateRemoteUrl } from '@nextcloud/router'
import Close from 'vue-material-design-icons/Close.vue'

export default {
	name: 'LogoPicker',
	components: { NcButton, Close },
	props: {
		logoPath: { type: String, default: null },
	},
	emits: ['update:logoPath', 'logo-loaded'],
	setup(props, { emit }) {
		const logoObjectUrl = ref(null)
		const logoError = ref(false)

		const logoFilename = computed(() => {
			if (!props.logoPath) return ''
			return props.logoPath.split('/').pop()
		})

		async function loadLogo(path) {
			if (logoObjectUrl.value) {
				URL.revokeObjectURL(logoObjectUrl.value)
				logoObjectUrl.value = null
			}
			logoError.value = false

			if (!path) {
				emit('logo-loaded', null)
				return
			}

			try {
				const davUrl = generateRemoteUrl(`dav/files/${window.OC.currentUser}`) + path
				const response = await axios.get(davUrl, { responseType: 'arraybuffer' })
				const contentType = response.headers['content-type'] || 'image/png'
				const blob = new Blob([response.data], { type: contentType })
				logoObjectUrl.value = URL.createObjectURL(blob)
				emit('logo-loaded', logoObjectUrl.value)
			} catch {
				logoError.value = true
				emit('logo-loaded', null)
			}
		}

		watch(() => props.logoPath, (newPath) => {
			loadLogo(newPath)
		}, { immediate: true })

		function chooseLogo() {
			window.OC.dialogs.filepicker(
				t('cromqr', 'Choose a logo image'),
				(path) => {
					emit('update:logoPath', path)
				},
				false,
				['image/png', 'image/jpeg', 'image/svg+xml'],
				true,
			)
		}

		function removeLogo() {
			emit('update:logoPath', null)
		}

		onBeforeUnmount(() => {
			if (logoObjectUrl.value) {
				URL.revokeObjectURL(logoObjectUrl.value)
			}
		})

		return { logoObjectUrl, logoError, logoFilename, chooseLogo, removeLogo, t }
	},
}
</script>

<style scoped>
.logo-picker {
	margin: 12px 0;
}

.logo-controls {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 8px;
}

.logo-selected {
	display: flex;
	align-items: center;
	gap: 8px;
}

.logo-thumbnail {
	width: 32px;
	height: 32px;
	object-fit: contain;
	border: 1px solid var(--color-border);
	border-radius: var(--border-radius);
}

.logo-path {
	font-size: 13px;
	color: var(--color-text-maxcontrast);
	max-width: 150px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.logo-warning {
	color: var(--color-warning);
	font-size: 13px;
}
</style>
