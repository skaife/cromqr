<template>
	<NcContent app-name="cromqr">
		<LibraryPanel
			:entries="entries"
			:selected-id="selectedId"
			:loading="loading"
			@select="selectEntry"
			@new-entry="newEntry" />
		<NcAppContent>
			<GeneratorPanel
				:entry="currentEntry"
				:is-saved="isSaved"
				@save="handleSave"
				@update="handleUpdate"
				@delete="handleDelete" />
		</NcAppContent>
	</NcContent>
</template>

<script>
import { NcContent, NcAppContent } from '@nextcloud/vue'
import LibraryPanel from './components/LibraryPanel.vue'
import GeneratorPanel from './components/GeneratorPanel.vue'
import { useLibrary } from './composables/useLibrary.js'
import { ref, computed, onMounted } from 'vue'

export default {
	name: 'App',
	components: {
		NcContent,
		NcAppContent,
		LibraryPanel,
		GeneratorPanel,
	},
	setup() {
		const { entries, loading, fetchAll, create, update, softDelete } = useLibrary()
		const selectedId = ref(null)

		const currentEntry = computed(() => {
			if (!selectedId.value) return null
			return entries.value.find(e => e.$id === selectedId.value) || null
		})

		const isSaved = computed(() => currentEntry.value !== null)

		function selectEntry(id) {
			selectedId.value = id
		}

		function newEntry() {
			selectedId.value = null
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
		}

		onMounted(() => {
			fetchAll()
		})

		return {
			entries,
			loading,
			selectedId,
			currentEntry,
			isSaved,
			selectEntry,
			newEntry,
			handleSave,
			handleUpdate,
			handleDelete,
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
