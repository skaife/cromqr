<template>
	<NcAppNavigation>
		<template #list>
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
				<div v-if="viewMode === 'grid'" class="library-grid">
					<LibraryItemGrid
						v-for="entry in entries"
						:key="entry.$id"
						:entry="entry"
						:selected="entry.$id === selectedId"
						@click="$emit('select', entry.$id)" />
				</div>
				<template v-else>
					<LibraryItem
						v-for="entry in entries"
						:key="entry.$id"
						:entry="entry"
						:selected="entry.$id === selectedId"
						@click="$emit('select', entry.$id)" />
				</template>
			</template>
		</template>
	</NcAppNavigation>
</template>

<script>
import { NcAppNavigation, NcAppNavigationNew, NcButton, NcLoadingIcon, NcEmptyContent } from '@nextcloud/vue'
import { t } from '@nextcloud/l10n'
import LibraryItem from './LibraryItem.vue'
import LibraryItemGrid from './LibraryItemGrid.vue'
import ViewGrid from 'vue-material-design-icons/ViewGrid.vue'
import ViewList from 'vue-material-design-icons/ViewList.vue'
import QrCode from 'vue-material-design-icons/Qrcode.vue'
import { ref } from 'vue'

export default {
	name: 'LibraryPanel',
	components: {
		NcAppNavigation,
		NcAppNavigationNew,
		NcButton,
		NcLoadingIcon,
		NcEmptyContent,
		LibraryItem,
		LibraryItemGrid,
		ViewGrid,
		ViewList,
		QrCode,
	},
	props: {
		entries: { type: Array, default: () => [] },
		selectedId: { type: String, default: null },
		loading: { type: Boolean, default: false },
	},
	emits: ['select', 'new-entry'],
	setup() {
		const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('cromqr-view') : null
		const viewMode = ref(stored || 'list')
		const emptyDescription = t('cromqr', "Click '+ New QR Code' to create one")

		function toggleView() {
			viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
			localStorage.setItem('cromqr-view', viewMode.value)
		}

		return { viewMode, toggleView, emptyDescription, t }
	},
}
</script>

<style scoped>
.library-controls {
	display: flex;
	justify-content: flex-end;
	padding: 4px 8px;
}

.library-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	gap: 8px;
	padding: 8px;
}
</style>
