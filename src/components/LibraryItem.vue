<template>
	<NcListItem :name="entry.name || t('cromqr', 'Untitled')"
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
import { t } from '@nextcloud/l10n'
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
		const typeLabel = computed(() => {
			const label = DATA_TYPE_LABELS[props.entry.dataType] || props.entry.dataType
			return t('cromqr', label)
		})

		const relativeTime = computed(() => {
			const date = new Date(props.entry.updatedAt || props.entry.createdAt)
			const now = new Date()
			const diffMs = now - date
			const diffMin = Math.floor(diffMs / 60000)
			if (diffMin < 1) return t('cromqr', 'just now')
			if (diffMin < 60) return t('cromqr', '{minutes}m ago', { minutes: diffMin })
			const diffHr = Math.floor(diffMin / 60)
			if (diffHr < 24) return t('cromqr', '{hours}h ago', { hours: diffHr })
			const diffDays = Math.floor(diffHr / 24)
			return t('cromqr', '{days}d ago', { days: diffDays })
		})

		return { typeLabel, relativeTime, t }
	},
}
</script>
