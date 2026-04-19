<template>
	<div class="geo-form">
		<NcTextField label="Latitude"
			:modelValue="fields.lat || ''"
			placeholder="40.7128"
			@update:modelValue="update('lat', $event)" />
		<NcTextField label="Longitude"
			:modelValue="fields.lng || ''"
			placeholder="-74.0060"
			@update:modelValue="update('lng', $event)" />
		<NcTextField label="Label (optional)"
			:modelValue="fields.label || ''"
			@update:modelValue="update('label', $event)" />
	</div>
</template>

<script>
import { NcTextField } from '@nextcloud/vue'

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
		return { update }
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
