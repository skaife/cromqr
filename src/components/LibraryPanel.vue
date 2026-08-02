<template>
	<NcAppNavigation>
		<template #list>
			<div class="nav-tabs">
				<NcButton :type="activeTab === 'library' ? 'primary' : 'secondary'" @click="$emit('switch-tab', 'library')">
					{{ t('cromqr', 'Library') }}
				</NcButton>
				<NcButton :type="activeTab === 'styles' ? 'primary' : 'secondary'" @click="$emit('switch-tab', 'styles')">
					{{ t('cromqr', 'Styles') }}
				</NcButton>
			</div>

			<template v-if="activeTab === 'library'">
				<div class="library-header">
					<NcAppNavigationNew :text="t('cromqr', 'New QR Code')" @click="$emit('new-entry')" />
					<div class="library-controls">
						<NcButton type="tertiary"
							:aria-label="viewMode === 'list' ? t('cromqr', 'Switch to grid view') : t('cromqr', 'Switch to list view')"
							@click="toggleView">
							<template #icon>
								<ViewGrid v-if="viewMode === 'list'" :size="20" />
								<ViewList v-else :size="20" />
							</template>
						</NcButton>
					</div>
				</div>

				<template v-if="loading">
					<NcLoadingIcon />
				</template>
				<template v-else-if="entries.length === 0">
					<NcEmptyContent :name="t('cromqr', 'No QR codes yet')"
						:description="emptyDescription">
						<template #icon>
							<QrCode :size="64" />
						</template>
					</NcEmptyContent>
				</template>
				<template v-else>
					<div class="folder-list">
						<div v-for="folder in folders" :key="folder.name || '__uncategorized__'" class="folder-section">
							<template v-if="folder.name">
								<div class="folder-header" @click="toggleFolder(folder.name)">
									<ChevronRight v-if="openFolder !== folder.name" :size="20" />
									<ChevronDown v-else :size="20" />
									<span class="folder-name">{{ folder.name }}</span>
									<span class="folder-count">({{ folder.entries.length }})</span>
								</div>
								<template v-if="openFolder === folder.name">
									<div v-if="viewMode === 'grid'" class="folder-entries-grid">
										<LibraryItemGrid
											v-for="entry in folder.entries"
											:key="entry.$id"
											:entry="entry"
											:selected="entry.$id === selectedId"
											@click="$emit('select', entry.$id)"
											@open-menu="openMenu(entry.$id)" />
									</div>
									<div v-else class="folder-entries">
										<div v-for="entry in folder.entries"
											:key="entry.$id"
											class="folder-entry"
											:class="{ active: entry.$id === selectedId }"
											@click="$emit('select', entry.$id)">
											<span class="entry-name">{{ entry.name || t('cromqr', 'Untitled') }}</span>
											<NcButton type="tertiary"
												:aria-label="t('cromqr', 'Entry actions')"
												class="entry-menu-btn"
												@click.stop="openMenu(entry.$id)">
												<template #icon>
													<DotsHorizontal :size="20" />
												</template>
											</NcButton>
										</div>
									</div>
								</template>
							</template>
							<template v-else>
								<div class="uncategorized-header">
									<span class="folder-name">{{ t('cromqr', 'Uncategorized') }}</span>
									<span class="folder-count">({{ folder.entries.length }})</span>
								</div>
								<div v-if="viewMode === 'grid'" class="folder-entries-grid">
									<LibraryItemGrid
										v-for="entry in folder.entries"
										:key="entry.$id"
										:entry="entry"
										:selected="entry.$id === selectedId"
										@click="$emit('select', entry.$id)"
										@open-menu="openMenu(entry.$id)" />
								</div>
								<div v-else class="folder-entries">
									<div v-for="entry in folder.entries"
										:key="entry.$id"
										class="folder-entry"
										:class="{ active: entry.$id === selectedId }"
										@click="$emit('select', entry.$id)">
										<span class="entry-name">{{ entry.name || t('cromqr', 'Untitled') }}</span>
										<NcButton type="tertiary"
											:aria-label="t('cromqr', 'Entry actions')"
											class="entry-menu-btn"
											@click.stop="openMenu(entry.$id)">
											<template #icon>
												<DotsHorizontal :size="20" />
											</template>
										</NcButton>
									</div>
								</div>
							</template>
						</div>
					</div>

					<div v-if="deletedCount > 0" class="recently-deleted-link" @click="$emit('show-deleted')">
						<Delete :size="20" />
						<span>{{ t('cromqr', 'Recently Deleted') }} ({{ deletedCount }})</span>
					</div>
				</template>
			</template>

			<template v-if="activeTab === 'styles'">
				<div class="styles-list">
					<div class="style-item"
						:class="{ active: selectedStyleId === 'plain' }"
						@click="$emit('select-style', 'plain')">
						<span class="style-swatch">
							<span class="swatch-fg" style="background: #000000" />
							<span class="swatch-bg" style="background: #ffffff" />
						</span>
						<span class="style-name">Plain</span>
					</div>

					<div v-for="style in styles"
						:key="style.$id"
						class="style-item"
						:class="{ active: selectedStyleId === style.$id }"
						@click="$emit('select-style', style.$id)">
						<span class="style-swatch">
							<span class="swatch-fg" :style="{ background: style.fgColor || '#000000' }" />
							<span class="swatch-bg" :style="{ background: style.bgColor || '#ffffff' }" />
							<span v-if="style.logo" class="swatch-logo">
								<ImageOutline :size="12" />
							</span>
						</span>
						<span class="style-name">{{ style.name }}</span>
					</div>
				</div>

				<div v-if="deletedStylesCount > 0" class="recently-deleted-link" @click="$emit('show-deleted')">
					<Delete :size="20" />
					<span>{{ t('cromqr', 'Recently Deleted') }} ({{ deletedStylesCount }})</span>
				</div>
			</template>
		</template>
	</NcAppNavigation>

	<MoveDialog
		v-if="moveEntryId !== null"
		:current-folder="moveCurrentFolder"
		@close="moveEntryId = null"
		@move="onMove" />
</template>

<script>
import { NcAppNavigation, NcAppNavigationNew, NcButton, NcLoadingIcon, NcEmptyContent } from '@nextcloud/vue'
import { t } from '@nextcloud/l10n'
import MoveDialog from './MoveDialog.vue'
import LibraryItemGrid from './LibraryItemGrid.vue'
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue'
import ChevronDown from 'vue-material-design-icons/ChevronDown.vue'
import DotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue'
import Delete from 'vue-material-design-icons/Delete.vue'
import QrCode from 'vue-material-design-icons/Qrcode.vue'
import ViewGrid from 'vue-material-design-icons/ViewGrid.vue'
import ViewList from 'vue-material-design-icons/ViewList.vue'
import ImageOutline from 'vue-material-design-icons/ImageOutline.vue'
import { ref, computed } from 'vue'
import { useFolders } from '../composables/useFolders.js'

export default {
	name: 'LibraryPanel',
	components: {
		NcAppNavigation,
		NcAppNavigationNew,
		NcButton,
		NcLoadingIcon,
		NcEmptyContent,
		MoveDialog,
		LibraryItemGrid,
		ChevronRight,
		ChevronDown,
		DotsHorizontal,
		Delete,
		QrCode,
		ViewGrid,
		ViewList,
		ImageOutline,
	},
	props: {
		entries: { type: Array, default: () => [] },
		selectedId: { type: String, default: null },
		loading: { type: Boolean, default: false },
		deletedCount: { type: Number, default: 0 },
		activeTab: { type: String, default: 'library' },
		styles: { type: Array, default: () => [] },
		selectedStyleId: { type: String, default: null },
		deletedStylesCount: { type: Number, default: 0 },
	},
	emits: ['select', 'new-entry', 'move-entry', 'show-deleted', 'switch-tab', 'select-style'],
	setup(props, { emit }) {
		const entriesRef = computed(() => props.entries)
		const { folders, openFolder, toggleFolder } = useFolders(entriesRef)
		const emptyDescription = t('cromqr', "Click '+ New QR Code' to create one")

		const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('cromqr-view') : null
		const viewMode = ref(stored || 'list')

		function toggleView() {
			viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
			localStorage.setItem('cromqr-view', viewMode.value)
		}

		const moveEntryId = ref(null)
		const moveCurrentFolder = ref('')

		function openMenu(entryId) {
			const entry = props.entries.find(e => e.$id === entryId)
			moveCurrentFolder.value = entry?.folder || ''
			moveEntryId.value = entryId
		}

		function onMove(folderName) {
			emit('move-entry', { id: moveEntryId.value, folder: folderName })
			moveEntryId.value = null
		}

		return {
			folders,
			openFolder,
			toggleFolder,
			emptyDescription,
			viewMode,
			toggleView,
			moveEntryId,
			moveCurrentFolder,
			openMenu,
			onMove,
			t,
		}
	},
}
</script>

<style scoped>
.nav-tabs {
	display: flex;
	gap: 4px;
	padding: 8px;
}

.library-controls {
	display: flex;
	justify-content: flex-end;
	padding: 4px 8px;
}

.folder-list {
	padding: 4px 0;
}

.folder-header {
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 6px 8px;
	cursor: pointer;
	font-weight: 500;
	border-radius: var(--border-radius);
	margin: 2px 4px;
}

.folder-header:hover {
	background-color: var(--color-background-hover);
}

.uncategorized-header {
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 6px 8px;
	font-weight: 500;
	margin: 2px 4px;
	margin-top: 8px;
	border-top: 1px solid var(--color-border);
	padding-top: 12px;
}

.folder-name {
	flex: 1;
}

.folder-count {
	color: var(--color-text-maxcontrast);
	font-size: 13px;
}

.folder-entries {
	padding-left: 12px;
}

.folder-entries-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
	gap: 8px;
	padding: 8px 8px 8px 20px;
}

.folder-entry {
	display: flex;
	align-items: center;
	padding: 4px 8px;
	cursor: pointer;
	border-radius: var(--border-radius);
	margin: 1px 4px;
}

.folder-entry:hover {
	background-color: var(--color-background-hover);
}

.folder-entry.active {
	background-color: var(--color-primary-element-light);
}

.entry-name {
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.entry-menu-btn {
	opacity: 0;
	flex-shrink: 0;
}

.folder-entry:hover .entry-menu-btn {
	opacity: 1;
}

.recently-deleted-link {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px 12px;
	margin-top: 8px;
	border-top: 1px solid var(--color-border);
	cursor: pointer;
	color: var(--color-text-maxcontrast);
}

.recently-deleted-link:hover {
	color: var(--color-main-text);
	background-color: var(--color-background-hover);
}

.styles-list {
	padding: 4px 0;
}

.style-item {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 12px;
	cursor: pointer;
	border-radius: var(--border-radius);
	margin: 2px 4px;
}

.style-item:hover {
	background-color: var(--color-background-hover);
}

.style-item.active {
	background-color: var(--color-primary-element-light);
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

.swatch-logo {
	width: 16px;
	height: 16px;
	border-radius: 3px;
	border: 1px solid var(--color-border);
	background: var(--color-background-dark);
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--color-text-maxcontrast);
}

.style-name {
	font-size: 14px;
}
</style>
