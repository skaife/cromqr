import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'

export function useExport() {
	async function exportToFiles(imageDataUrl, name) {
		try {
			const destination = await new Promise((resolve, reject) => {
				let picked = false
				window.OC.dialogs.filepicker(
					'Choose export destination',
					(path) => {
						picked = true
						resolve(path)
					},
					false,
					['httpd/unix-directory'],
					true,
					1,
				)
				const observer = new MutationObserver(() => {
					if (!document.querySelector('.oc-dialog')) {
						observer.disconnect()
						if (!picked) {
							reject(new Error('Pick cancelled'))
						}
					}
				})
				setTimeout(() => {
					observer.observe(document.body, { childList: true, subtree: true })
				}, 500)
			})

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
