import { ref } from 'vue'
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'

export function useStyles() {
	const styles = ref([])
	const loading = ref(false)

	async function fetchAll() {
		loading.value = true
		try {
			const url = generateUrl('/apps/cromqr/styles')
			const response = await axios.get(url)
			styles.value = response.data
		} catch (error) {
			console.error('Failed to fetch styles', error)
			styles.value = []
		} finally {
			loading.value = false
		}
	}

	async function create(data) {
		try {
			const url = generateUrl('/apps/cromqr/styles')
			const response = await axios.post(url, data)
			styles.value.push(response.data)
			styles.value.sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }))
			return response.data
		} catch (error) {
			console.error('Failed to create style', error)
			return null
		}
	}

	async function update(id, data) {
		try {
			const url = generateUrl(`/apps/cromqr/styles/${id}`)
			const response = await axios.put(url, data)
			const idx = styles.value.findIndex(s => s.$id === id)
			if (idx !== -1) {
				styles.value[idx] = response.data
			}
			return response.data
		} catch (error) {
			console.error('Failed to update style', error)
			return null
		}
	}

	async function softDelete(id) {
		try {
			const url = generateUrl(`/apps/cromqr/styles/${id}`)
			await axios.delete(url)
			styles.value = styles.value.filter(s => s.$id !== id)
			return true
		} catch (error) {
			console.error('Failed to delete style', error)
			return false
		}
	}

	return { styles, loading, fetchAll, create, update, softDelete }
}
