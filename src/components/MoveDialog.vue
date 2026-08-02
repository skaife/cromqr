<template>
	<NcDialog :name="t('cromqr', 'Move to Folder')"
		@close="$emit('close')">
		<NcTextField :label="t('cromqr', 'Folder name')"
			:modelValue="folderName"
			:helper-text="t('cromqr', 'Enter a folder name, or leave blank for Uncategorized')"
			@update:modelValue="folderName = $event" />
		<template #actions>
			<NcButton type="secondary" @click="$emit('close')">
				{{ t('cromqr', 'Cancel') }}
			</NcButton>
			<NcButton type="primary" @click="onMove">
				{{ t('cromqr', 'Move') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<script>
import { NcDialog, NcButton, NcTextField } from '@nextcloud/vue'
import { t } from '@nextcloud/l10n'
import { ref } from 'vue'

export default {
	name: 'MoveDialog',
	components: { NcDialog, NcButton, NcTextField },
	props: {
		currentFolder: { type: String, default: '' },
	},
	emits: ['close', 'move'],
	setup(props, { emit }) {
		const folderName = ref(props.currentFolder || '')

		function onMove() {
			emit('move', folderName.value.trim())
		}

		return { folderName, onMove, t }
	},
}
</script>
