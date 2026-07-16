<template>
	<div class="vcard-form">
		<NcTextField :label="t('cromqr', 'First Name')"
			:modelValue="fields.firstName || ''"
			@update:modelValue="update('firstName', $event)" />
		<NcTextField :label="t('cromqr', 'Last Name')"
			:modelValue="fields.lastName || ''"
			@update:modelValue="update('lastName', $event)" />
		<NcTextField :label="t('cromqr', 'Phone')"
			:modelValue="fields.phone || ''"
			@update:modelValue="update('phone', $event)" />
		<NcTextField :label="t('cromqr', 'Email')"
			:modelValue="fields.email || ''"
			@update:modelValue="update('email', $event)" />
		<NcTextField :label="t('cromqr', 'Organization')"
			:modelValue="fields.org || ''"
			@update:modelValue="update('org', $event)" />
		<NcTextField :label="t('cromqr', 'Title')"
			:modelValue="fields.title || ''"
			@update:modelValue="update('title', $event)" />
		<NcTextField :label="t('cromqr', 'Website')"
			:modelValue="fields.website || ''"
			@update:modelValue="update('website', $event)" />
	</div>
</template>

<script>
import { NcTextField } from '@nextcloud/vue'
import { t } from '@nextcloud/l10n'

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
		return { update, t }
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
