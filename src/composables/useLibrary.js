import { ref } from 'vue'
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'

function sortByName(arr) {
	arr.sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }))
}

export function useLibrary() {
	const entries = ref([])
	const loading = ref(false)

	async function fetchAll() {
		loading.value = true
		try {
			const url = generateUrl('/apps/cromqr/library')
			const response = await axios.get(url)
			entries.value = response.data
			sortByName(entries.value)
		} catch (error) {
			console.error('Failed to fetch library', error)
			entries.value = []
		} finally {
			loading.value = false
		}
	}

	async function create(data) {
		try {
			const url = generateUrl('/apps/cromqr/library')
			const response = await axios.post(url, data)
			entries.value.push(response.data)
			sortByName(entries.value)
			return response.data
		} catch (error) {
			console.error('Failed to create entry', error)
			return null
		}
	}

	async function update(id, data) {
		try {
			const url = generateUrl(`/apps/cromqr/library/${id}`)
			const response = await axios.put(url, data)
			const idx = entries.value.findIndex(e => e.$id === id)
			if (idx !== -1) {
				entries.value[idx] = response.data
			}
			sortByName(entries.value)
			return response.data
		} catch (error) {
			console.error('Failed to update entry', error)
			return null
		}
	}

	async function softDelete(id) {
		try {
			const url = generateUrl(`/apps/cromqr/library/${id}`)
			await axios.delete(url)
			entries.value = entries.value.filter(e => e.$id !== id)
			return true
		} catch (error) {
			console.error('Failed to delete entry', error)
			return false
		}
	}

	return { entries, loading, fetchAll, create, update, softDelete }
}
