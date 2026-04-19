<template>
	<div>
		<NcTextField label="URL"
			:modelValue="fields.url || ''"
			placeholder="https://example.com"
			@update:modelValue="update('url', $event)" />
	</div>
</template>

<script>
import { NcTextField } from '@nextcloud/vue'

export default {
	name: 'UrlForm',
	components: { NcTextField },
	props: {
		fields: { type: Object, default: () => ({}) },
	},
	emits: ['update:fields'],
	setup(props, { emit }) {
		function update(key, value) {
			emit('update:fields', { ...props.fields, [key]: value })
		}
		return { update }
	},
}
</script>
