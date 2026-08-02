<template>
	<div class="recently-deleted-panel">
		<h2>{{ t('cromqr', 'Recently Deleted') }}</h2>

		<template v-if="loading">
			<NcLoadingIcon />
		</template>

		<template v-else-if="deletedEntries.length === 0">
			<NcEmptyContent :name="t('cromqr', 'Trash is empty')">
				<template #icon>
					<Delete :size="64" />
				</template>
			</NcEmptyContent>
		</template>

		<template v-else>
			<div class="deleted-list">
				<div v-for="entry in deletedEntries" :key="entry.$id" class="deleted-item">
					<div class="deleted-info">
						<template v-if="type === 'styles'">
							<span class="style-swatch">
								<span class="swatch-fg" :style="{ background: entry.fgColor || '#000000' }" />
								<span class="swatch-bg" :style="{ background: entry.bgColor || '#ffffff' }" />
							</span>
							<span class="deleted-name">{{ entry.name }}</span>
						</template>
						<template v-else>
							<span class="deleted-name">{{ entry.name || t('cromqr', 'Untitled') }}</span>
							<span class="deleted-folder">({{ entry.folder || t('cromqr', 'Uncategorized') }})</span>
						</template>
					</div>
					<NcButton type="secondary" @click="$emit('restore', entry.$id)">
						{{ t('cromqr', 'Restore') }}
					</NcButton>
				</div>
			</div>

			<div class="trash-actions">
				<NcButton type="error" @click="confirmEmpty">
					{{ t('cromqr', 'Empty Trash') }}
				</NcButton>
			</div>
		</template>

		<NcDialog v-if="showEmptyDialog"
			:name="t('cromqr', 'Empty Trash')"
			:message="t('cromqr', 'Are you sure? This will permanently delete all items in the trash.')"
			@close="showEmptyDialog = false">
			<template #actions>
				<NcButton type="secondary" @click="showEmptyDialog = false">
					{{ t('cromqr', 'Cancel') }}
				</NcButton>
				<NcButton type="error" @click="doEmpty">
					{{ t('cromqr', 'Empty Trash') }}
				</NcButton>
			</template>
		</NcDialog>
	</div>
</template>

<script>
import { NcButton, NcDialog, NcLoadingIcon, NcEmptyContent } from '@nextcloud/vue'
import { t } from '@nextcloud/l10n'
import { ref } from 'vue'
import Delete from 'vue-material-design-icons/Delete.vue'

export default {
	name: 'RecentlyDeletedPanel',
	components: { NcButton, NcDialog, NcLoadingIcon, NcEmptyContent, Delete },
	props: {
		deletedEntries: { type: Array, default: () => [] },
		loading: { type: Boolean, default: false },
		type: { type: String, default: 'entries' },
	},
	emits: ['restore', 'empty-trash'],
	setup(props, { emit }) {
		const showEmptyDialog = ref(false)

		function confirmEmpty() {
			showEmptyDialog.value = true
		}

		function doEmpty() {
			showEmptyDialog.value = false
			emit('empty-trash')
		}

		return { showEmptyDialog, confirmEmpty, doEmpty, t }
	},
}
</script>

<style scoped>
.recently-deleted-panel {
	padding: 20px;
	max-width: 640px;
	margin: 0 auto;
}

.recently-deleted-panel h2 {
	margin-bottom: 16px;
}

.deleted-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.deleted-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 12px;
	border-radius: var(--border-radius);
	background: var(--color-background-dark);
}

.deleted-info {
	display: flex;
	align-items: center;
	gap: 8px;
	min-width: 0;
}

.deleted-name {
	font-weight: 500;
}

.deleted-folder {
	color: var(--color-text-maxcontrast);
	font-size: 13px;
}

.trash-actions {
	margin-top: 16px;
	display: flex;
	justify-content: flex-end;
}

.style-swatch {
	display: flex;
	gap: 2px;
}

.swatch-fg,
.swatch-bg {
	width: 16px;
	height: 16px;
	border-radius: 3px;
	border: 1px solid var(--color-border);
}
</style>
