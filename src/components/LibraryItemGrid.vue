<template>
	<div class="grid-item" :class="{ selected }" @click="$emit('click')">
		<QrPreviewMini :payload="entry.payload" :style-opts="entry.style" />
		<span class="grid-item-name">{{ entry.name || 'Untitled' }}</span>
	</div>
</template>

<script>
import QrPreviewMini from './QrPreviewMini.vue'

export default {
	name: 'LibraryItemGrid',
	components: { QrPreviewMini },
	props: {
		entry: { type: Object, required: true },
		selected: { type: Boolean, default: false },
	},
	emits: ['click'],
}
</script>

<style scoped>
.grid-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 8px;
	border-radius: var(--border-radius-large);
	cursor: pointer;
	border: 2px solid transparent;
}

.grid-item:hover {
	background-color: var(--color-background-hover);
}

.grid-item.selected {
	border-color: var(--color-primary);
	background-color: var(--color-primary-element-light);
}

.grid-item-name {
	margin-top: 4px;
	font-size: 12px;
	text-align: center;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 100%;
}
</style>
