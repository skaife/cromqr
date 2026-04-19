<template>
	<div class="vcard-form">
		<NcTextField label="First Name"
			:modelValue="fields.firstName || ''"
			@update:modelValue="update('firstName', $event)" />
		<NcTextField label="Last Name"
			:modelValue="fields.lastName || ''"
			@update:modelValue="update('lastName', $event)" />
		<NcTextField label="Phone"
			:modelValue="fields.phone || ''"
			@update:modelValue="update('phone', $event)" />
		<NcTextField label="Email"
			:modelValue="fields.email || ''"
			@update:modelValue="update('email', $event)" />
		<NcTextField label="Organization"
			:modelValue="fields.org || ''"
			@update:modelValue="update('org', $event)" />
		<NcTextField label="Title"
			:modelValue="fields.title || ''"
			@update:modelValue="update('title', $event)" />
		<NcTextField label="Website"
			:modelValue="fields.website || ''"
			@update:modelValue="update('website', $event)" />
	</div>
</template>

<script>
import { NcTextField } from '@nextcloud/vue'

export default {
	name: 'VcardForm',
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
.vcard-form {
	display: flex;
	flex-direction: column;
	gap: 8px;
}
</style>
