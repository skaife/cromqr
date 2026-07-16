<template>
	<div class="geo-form">
		<NcTextField :label="t('cromqr', 'Latitude')"
			:modelValue="fields.lat || ''"
			placeholder="40.7128"
			@update:modelValue="update('lat', $event)" />
		<NcTextField :label="t('cromqr', 'Longitude')"
			:modelValue="fields.lng || ''"
			placeholder="-74.0060"
			@update:modelValue="update('lng', $event)" />
		<NcTextField :label="t('cromqr', 'Label (optional)')"
			:modelValue="fields.label || ''"
			@update:modelValue="update('label', $event)" />
	</div>
</template>

<script>
import { NcTextField } from '@nextcloud/vue'
import { t } from '@nextcloud/l10n'

export default {
	name: 'GeoForm',
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

<style scoped>
.geo-form {
	display: flex;
	flex-direction: column;
	gap: 8px;
}
</style>
