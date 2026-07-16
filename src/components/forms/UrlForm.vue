<template>
	<div>
		<NcTextField :label="t('cromqr', 'URL')"
			:modelValue="fields.url || ''"
			placeholder="https://example.com"
			@update:modelValue="update('url', $event)" />
	</div>
</template>

<script>
import { NcTextField } from '@nextcloud/vue'
import { t } from '@nextcloud/l10n'

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
		return { update, t }
	},
}
</script>
