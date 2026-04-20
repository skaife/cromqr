<template>
	<div class="action-bar">
		<div class="name-input">
			<NcTextField :label="isSaved ? 'Name' : 'Name this QR code'"
				:modelValue="name"
				@update:modelValue="$emit('update:name', $event)" />
		</div>

		<div class="action-buttons">
			<NcButton type="primary"
				:disabled="!hasPayload"
				@click="$emit('save')">
				{{ isSaved ? 'Update' : 'Save to Library' }}
			</NcButton>
			<NcButton type="secondary"
				:disabled="!hasPayload"
				@click="$emit('export')">
				Export to Files
			</NcButton>
			<NcButton type="secondary"
				:disabled="!hasPayload"
				@click="$emit('download-svg')">
				Download SVG
			</NcButton>
			<NcButton type="secondary"
				:disabled="!hasPayload"
				@click="$emit('download-png')">
				Download PNG
			</NcButton>
			<NcButton v-if="isSaved"
				type="error"
				@click="confirmDelete">
				Delete
			</NcButton>
		</div>

		<NcDialog v-if="showDeleteDialog"
			name="Delete QR Code"
			:message="'Are you sure you want to delete this QR code?'"
			@close="showDeleteDialog = false">
			<template #actions>
				<NcButton type="secondary" @click="showDeleteDialog = false">
					Cancel
				</NcButton>
				<NcButton type="error" @click="doDelete">
					Delete
				</NcButton>
			</template>
		</NcDialog>
	</div>
</template>

<script>
import { NcButton, NcDialog, NcTextField } from '@nextcloud/vue'
import { ref } from 'vue'

export default {
	name: 'ActionBar',
	components: { NcButton, NcDialog, NcTextField },
	props: {
		isSaved: { type: Boolean, default: false },
		hasPayload: { type: Boolean, default: false },
		name: { type: String, default: '' },
	},
	emits: ['save', 'export', 'download-svg', 'download-png', 'delete', 'update:name'],
	setup(props, { emit }) {
		const showDeleteDialog = ref(false)
		function confirmDelete() {
			showDeleteDialog.value = true
		}

		function doDelete() {
			showDeleteDialog.value = false
			emit('delete')
		}

		return { showDeleteDialog, confirmDelete, doDelete }
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
