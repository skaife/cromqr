import { ref, computed } from 'vue'

export function useFolders(entries) {
	const openFolder = ref(null)

	const folders = computed(() => {
		const map = {}
		for (const entry of entries.value) {
			const folder = entry.folder || ''
			if (!map[folder]) {
				map[folder] = []
			}
			map[folder].push(entry)
		}

		const sorted = Object.keys(map)
			.filter(k => k !== '')
			.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

		const result = sorted.map(name => ({
			name,
			entries: map[name],
		}))

		if (map['']) {
			result.push({
				name: '',
				entries: map[''],
			})
		}

		return result
	})

	function toggleFolder(name) {
		openFolder.value = openFolder.value === name ? null : name
	}

	return { folders, openFolder, toggleFolder }
}
