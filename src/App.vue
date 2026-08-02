<template>
	<NcContent app-name="cromqr">
		<LibraryPanel
			:entries="entries"
			:selected-id="selectedId"
			:loading="loading"
			:deleted-count="deletedEntries.length"
			:deleted-styles-count="deletedStyles.length"
			:active-tab="activeTab"
			:styles="styles"
			:selected-style-id="selectedStyleId"
			@select="selectEntry"
			@new-entry="newEntry"
			@move-entry="handleMoveEntry"
			@show-deleted="showDeleted"
			@switch-tab="switchTab"
			@select-style="handleSelectStyle" />
		<NcAppContent>
			<RecentlyDeletedPanel
				v-if="view === 'deleted'"
				:deleted-entries="activeTab === 'styles' ? deletedStyles : deletedEntries"
				:type="activeTab === 'styles' ? 'styles' : 'entries'"
				:loading="deletedLoading"
				@restore="handleRestore"
				@empty-trash="handleEmptyTrash" />
			<GeneratorPanel
				v-else
				:entry="currentEntry"
				:is-saved="isSaved"
				:styles-mode="activeTab === 'styles'"
				:is-plain-style="selectedStyleId === 'plain'"
				:applied-style="appliedStyle"
				@save="handleSave"
				@update="handleUpdate"
				@delete="handleDelete"
				@save-new-style="handleSaveNewStyle"
				@update-style="handleUpdateStyle"
				@delete-style="handleDeleteStyle" />
		</NcAppContent>
	</NcContent>

	<NcDialog v-if="showStyleNameDialog"
		:name="t('cromqr', 'Save as New Style')"
		@close="showStyleNameDialog = false">
		<NcTextField :label="t('cromqr', 'Style name')"
			:modelValue="newStyleName"
			@update:modelValue="newStyleName = $event" />
		<template #actions>
			<NcButton type="secondary" @click="showStyleNameDialog = false">
				{{ t('cromqr', 'Cancel') }}
			</NcButton>
			<NcButton type="primary" :disabled="!newStyleName.trim() || newStyleName.trim().toLowerCase() === 'plain'" @click="doSaveNewStyle">
				{{ t('cromqr', 'Save') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<script>
import { NcContent, NcAppContent, NcDialog, NcButton, NcTextField } from '@nextcloud/vue'
import { t } from '@nextcloud/l10n'
import LibraryPanel from './components/LibraryPanel.vue'
import GeneratorPanel from './components/GeneratorPanel.vue'
import RecentlyDeletedPanel from './components/RecentlyDeletedPanel.vue'
import { useLibrary } from './composables/useLibrary.js'
import { useStyles } from './composables/useStyles.js'
import { ref, computed, onMounted } from 'vue'
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { generateUUID } from './utils/uuid.js'

export default {
	name: 'App',
	components: {
		NcContent,
		NcAppContent,
		NcDialog,
		NcButton,
		NcTextField,
		LibraryPanel,
		GeneratorPanel,
		RecentlyDeletedPanel,
	},
	setup() {
		const { entries, loading, fetchAll, create, update, softDelete } = useLibrary()
		const { styles, loading: stylesLoading, fetchAll: fetchStyles, create: createStyle, update: updateStyle, softDelete: deleteStyle } = useStyles()
		const selectedId = ref(null)
		const activeTab = ref('library')
		const view = ref('generator')
		const selectedStyleId = ref(null)
		const appliedStyle = ref(null)

		const deletedEntries = ref([])
		const deletedStyles = ref([])
		const deletedLoading = ref(false)

		const showStyleNameDialog = ref(false)
		const newStyleName = ref('')
		let pendingStyleData = null

		const currentEntry = computed(() => {
			if (!selectedId.value) return null
			return entries.value.find(e => e.$id === selectedId.value) || null
		})

		const isSaved = computed(() => currentEntry.value !== null)

		function selectEntry(id) {
			selectedId.value = id
			view.value = 'generator'
		}

		function newEntry() {
			selectedId.value = null
			view.value = 'generator'
		}

		function switchTab(tab) {
			activeTab.value = tab
			if (tab === 'styles') {
				selectedStyleId.value = null
				appliedStyle.value = null
			}
		}

		async function handleSave(data) {
			const entry = await create(data)
			if (entry) {
				selectedId.value = entry.$id
			}
		}

		async function handleUpdate(data) {
			await update(data.$id, data)
		}

		async function handleDelete(id) {
			await softDelete(id)
			selectedId.value = null
			await fetchDeletedEntries()
		}

		async function handleMoveEntry({ id, folder }) {
			const entry = entries.value.find(e => e.$id === id)
			if (!entry) return
			await update(id, { ...entry, folder })
		}

		async function fetchDeletedEntries() {
			deletedLoading.value = true
			try {
				const url = generateUrl('/apps/cromqr/library/deleted')
				const response = await axios.get(url)
				deletedEntries.value = response.data
			} catch (error) {
				console.error('Failed to fetch deleted entries', error)
				deletedEntries.value = []
			} finally {
				deletedLoading.value = false
			}
		}

		async function fetchDeletedStyles() {
			try {
				const url = generateUrl('/apps/cromqr/styles/deleted')
				const response = await axios.get(url)
				deletedStyles.value = response.data
			} catch (error) {
				console.error('Failed to fetch deleted styles', error)
				deletedStyles.value = []
			}
		}

		function showDeleted() {
			view.value = 'deleted'
			selectedId.value = null
			if (activeTab.value === 'styles') {
				fetchDeletedStyles()
			} else {
				fetchDeletedEntries()
			}
		}

		async function handleRestore(id) {
			try {
				if (activeTab.value === 'styles') {
					const url = generateUrl(`/apps/cromqr/styles/${id}/restore`)
					await axios.post(url)
					await fetchStyles()
					await fetchDeletedStyles()
				} else {
					const url = generateUrl(`/apps/cromqr/library/${id}/restore`)
					await axios.post(url)
					await fetchAll()
					await fetchDeletedEntries()
				}
			} catch (error) {
				console.error('Failed to restore', error)
			}
		}

		async function handleEmptyTrash() {
			try {
				if (activeTab.value === 'styles') {
					const url = generateUrl('/apps/cromqr/styles/empty-trash')
					await axios.post(url)
					deletedStyles.value = []
				} else {
					const url = generateUrl('/apps/cromqr/library/empty-trash')
					await axios.post(url)
					deletedEntries.value = []
				}
			} catch (error) {
				console.error('Failed to empty trash', error)
			}
		}

		function handleSelectStyle(styleId) {
			selectedStyleId.value = styleId
			if (styleId === 'plain') {
				appliedStyle.value = { fgColor: '#000000', bgColor: '#ffffff', logo: null }
			} else {
				const s = styles.value.find(st => st.$id === styleId)
				if (s) {
					appliedStyle.value = { fgColor: s.fgColor, bgColor: s.bgColor, logo: s.logo }
				}
			}
		}

		function handleNewStyle() {
			selectedStyleId.value = null
			appliedStyle.value = { fgColor: '#000000', bgColor: '#ffffff', logo: null }
		}

		function handleSaveNewStyle(styleData) {
			pendingStyleData = styleData
			newStyleName.value = ''
			showStyleNameDialog.value = true
		}

		async function doSaveNewStyle() {
			const name = newStyleName.value.trim()
			if (!name || name.toLowerCase() === 'plain') return
			showStyleNameDialog.value = false
			const data = {
				$id: self.crypto?.randomUUID?.() || generateUUID(),
				name,
				fgColor: pendingStyleData.fgColor,
				bgColor: pendingStyleData.bgColor,
				logo: pendingStyleData.logo,
			}
			const style = await createStyle(data)
			if (style) {
				selectedStyleId.value = style.$id
			}
		}

		async function handleUpdateStyle(styleData) {
			if (!selectedStyleId.value || selectedStyleId.value === 'plain') return
			await updateStyle(selectedStyleId.value, styleData)
		}

		async function handleDeleteStyle() {
			if (!selectedStyleId.value || selectedStyleId.value === 'plain') return
			await deleteStyle(selectedStyleId.value)
			selectedStyleId.value = null
			appliedStyle.value = null
			await fetchDeletedStyles()
		}

		onMounted(async () => {
			await Promise.all([fetchAll(), fetchStyles(), fetchDeletedEntries(), fetchDeletedStyles()])
		})

		return {
			entries,
			loading,
			selectedId,
			currentEntry,
			isSaved,
			activeTab,
			view,
			styles,
			selectedStyleId,
			appliedStyle,
			deletedEntries,
			deletedStyles,
			deletedLoading,
			showStyleNameDialog,
			newStyleName,
			selectEntry,
			newEntry,
			switchTab,
			handleSave,
			handleUpdate,
			handleDelete,
			handleMoveEntry,
			showDeleted,
			handleRestore,
			handleEmptyTrash,
			handleSelectStyle,
			handleNewStyle,
			handleSaveNewStyle,
			doSaveNewStyle,
			handleUpdateStyle,
			handleDeleteStyle,
			t,
		}
	},
}
</script>

<style scoped>
:deep(#app-content-vue) {
	display: flex;
	flex-direction: column;
}
</style>
