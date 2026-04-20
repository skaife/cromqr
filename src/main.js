import { createApp } from 'vue'
import App from './App.vue'

document.addEventListener('DOMContentLoaded', () => {
	const el = document.getElementById('cromqr')
	if (el) {
		const app = createApp(App)
		app.mount(el)
	}
})
