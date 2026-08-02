<template>
	<div class="grid-item" :class="{ selected }" @click="$emit('click')">
		<div class="grid-item-thumb">
			<QrPreviewMini :payload="entry.payload" :style-opts="entry.style" />
			<NcButton type="tertiary"
				:aria-label="t('cromqr', 'Entry actions')"
				class="grid-menu-btn"
				@click.stop="$emit('open-menu')">
				<template #icon>
					<DotsHorizontal :size="18" />
				</template>
			</NcButton>
		</div>
		<span class="grid-item-name">{{ entry.name || t('cromqr', 'Untitled') }}</span>
	</div>
</template>

<script>
import { t } from '@nextcloud/l10n'
import { NcButton } from '@nextcloud/vue'
import QrPreviewMini from './QrPreviewMini.vue'
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue'

export default {
	name: 'LibraryItemGrid',
	components: { QrPreviewMini, NcButton, DotsHorizontal },
	props: {
		entry: { type: Object, required: true },
		selected: { type: Boolean, default: false },
	},
	emits: ['click', 'open-menu'],
	setup() {
		return { t }
	},
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

.grid-item-thumb {
	position: relative;
}

.grid-menu-btn {
	position: absolute;
	top: -4px;
	right: -4px;
	opacity: 0;
}

.grid-item:hover .grid-menu-btn {
	opacity: 1;
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
