<template>
	<div class="type-selector">
		<NcButton v-for="dt in DATA_TYPES"
			:key="dt.key"
			:type="modelValue === dt.key ? 'primary' : 'secondary'"
			@click="$emit('update:modelValue', dt.key)">
			{{ dt.label }}
		</NcButton>
	</div>
</template>

<script>
import { NcButton } from '@nextcloud/vue'
import { DATA_TYPES } from '../constants.js'

export default {
	name: 'TypeSelector',
	components: { NcButton },
	props: {
		modelValue: { type: String, default: 'url' },
	},
	emits: ['update:modelValue'],
	setup() {
		return { DATA_TYPES }
	},
}
</script>

<style scoped>
.type-selector {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
}
</style>
