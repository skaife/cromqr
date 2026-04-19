<template>
	<NcListItem :name="entry.name || 'Untitled'"
		:bold="selected"
		:active="selected"
		@click="$emit('click')">
		<template #subname>
			{{ typeLabel }} · {{ relativeTime }}
		</template>
	</NcListItem>
</template>

<script>
import { NcListItem } from '@nextcloud/vue'
import { computed } from 'vue'
import { DATA_TYPE_LABELS } from '../constants.js'

export default {
	name: 'LibraryItem',
	components: { NcListItem },
	props: {
		entry: { type: Object, required: true },
		selected: { type: Boolean, default: false },
	},
	emits: ['click'],
	setup(props) {
		const typeLabel = computed(() => DATA_TYPE_LABELS[props.entry.dataType] || props.entry.dataType)

		const relativeTime = computed(() => {
			const date = new Date(props.entry.updatedAt || props.entry.createdAt)
			const now = new Date()
			const diffMs = now - date
			const diffMin = Math.floor(diffMs / 60000)
			if (diffMin < 1) return 'just now'
			if (diffMin < 60) return `${diffMin}m ago`
			const diffHr = Math.floor(diffMin / 60)
			if (diffHr < 24) return `${diffHr}h ago`
			const diffDays = Math.floor(diffHr / 24)
			return `${diffDays}d ago`
		})

		return { typeLabel, relativeTime }
	},
}
</script>
