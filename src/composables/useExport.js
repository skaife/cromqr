import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { getFilePickerBuilder } from '@nextcloud/dialogs'

export function useExport() {
	async function exportToFiles(imageDataUrl, name) {
		try {
			const picker = getFilePickerBuilder('Choose export destination')
				.setType(1)
				.setMimeTypeFilter(['httpd/unix-directory'])
				.allowDirectories()
				.build()

			const destination = await picker.pick()

			const url = generateUrl('/apps/cromqr/export')
			await axios.post(url, {
				destination,
				filename: `${name}.png`,
				imageData: imageDataUrl,
			})
		} catch (error) {
			if (error?.message !== 'Pick cancelled') {
				console.error('Export failed', error)
			}
		}
	}

	return { exportToFiles }
}
