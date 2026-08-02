<template>
	<div class="action-bar">
		<div class="name-input">
			<NcTextField :label="isSaved ? t('cromqr', 'Name') : t('cromqr', 'Name this QR code')"
				:modelValue="name"
				@update:modelValue="$emit('update:name', $event)" />
		</div>

		<template v-if="stylesMode">
			<div class="action-buttons">
				<NcButton type="primary" @click="$emit('save-new-style')">
					{{ t('cromqr', 'Save as New Style') }}
				</NcButton>
				<NcButton v-if="!isPlainStyle" type="secondary" @click="$emit('update-style')">
					{{ t('cromqr', 'Update Style') }}
				</NcButton>
				<NcButton v-if="!isPlainStyle" type="error" @click="confirmDeleteStyle">
					{{ t('cromqr', 'Delete Style') }}
				</NcButton>
			</div>
		</template>

		<template v-else>
			<div class="action-buttons">
				<NcButton type="primary"
					:disabled="!hasPayload"
					@click="$emit('save')">
					{{ isSaved ? t('cromqr', 'Update') : t('cromqr', 'Save to Library') }}
				</NcButton>
				<NcButton type="secondary"
					:disabled="!hasPayload"
					@click="$emit('export')">
					{{ t('cromqr', 'Export to Files') }}
				</NcButton>
				<NcButton type="secondary"
					:disabled="!hasPayload || hasLogo"
					@click="$emit('download-svg')">
					{{ t('cromqr', 'Download SVG') }}
				</NcButton>
				<NcButton type="secondary"
					:disabled="!hasPayload"
					@click="$emit('download-png')">
					{{ t('cromqr', 'Download PNG') }}
				</NcButton>
				<NcButton v-if="isSaved"
					type="error"
					@click="confirmDelete">
					{{ t('cromqr', 'Delete') }}
				</NcButton>
			</div>
		</template>

		<NcDialog v-if="showDeleteDialog"
			:name="t('cromqr', 'Delete QR Code')"
			:message="t('cromqr', 'Are you sure you want to delete this QR code?')"
			@close="showDeleteDialog = false">
			<template #actions>
				<NcButton type="secondary" @click="showDeleteDialog = false">
					{{ t('cromqr', 'Cancel') }}
				</NcButton>
				<NcButton type="error" @click="doDelete">
					{{ t('cromqr', 'Delete') }}
				</NcButton>
			</template>
		</NcDialog>

		<NcDialog v-if="showDeleteStyleDialog"
			:name="t('cromqr', 'Delete Style')"
			:message="t('cromqr', 'Are you sure you want to delete this style?')"
			@close="showDeleteStyleDialog = false">
			<template #actions>
				<NcButton type="secondary" @click="showDeleteStyleDialog = false">
					{{ t('cromqr', 'Cancel') }}
				</NcButton>
				<NcButton type="error" @click="doDeleteStyle">
					{{ t('cromqr', 'Delete') }}
				</NcButton>
			</template>
		</NcDialog>
	</div>
</template>

<script>
import { NcButton, NcDialog, NcTextField } from '@nextcloud/vue'
import { t } from '@nextcloud/l10n'
import { ref } from 'vue'

export default {
	name: 'ActionBar',
	components: { NcButton, NcDialog, NcTextField },
	props: {
		isSaved: { type: Boolean, default: false },
		hasPayload: { type: Boolean, default: false },
		hasLogo: { type: Boolean, default: false },
		name: { type: String, default: '' },
		stylesMode: { type: Boolean, default: false },
		isPlainStyle: { type: Boolean, default: false },
	},
	emits: ['save', 'export', 'download-svg', 'download-png', 'delete', 'update:name', 'save-new-style', 'update-style', 'delete-style'],
	setup(props, { emit }) {
		const showDeleteDialog = ref(false)
		const showDeleteStyleDialog = ref(false)

		function confirmDelete() {
			showDeleteDialog.value = true
		}

		function doDelete() {
			showDeleteDialog.value = false
			emit('delete')
		}

		function confirmDeleteStyle() {
			showDeleteStyleDialog.value = true
		}

		function doDeleteStyle() {
			showDeleteStyleDialog.value = false
			emit('delete-style')
		}

		return { showDeleteDialog, showDeleteStyleDialog, confirmDelete, doDelete, confirmDeleteStyle, doDeleteStyle, t }
	},
}
</script>

<style scoped>
.action-bar {
	margin-top: 16px;
}

.name-input {
	margin-bottom: 12px;
}

.action-buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}
</style>
