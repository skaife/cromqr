<template>
	<div class="sms-form">
		<NcTextField label="Phone Number"
			:modelValue="fields.phone || ''"
			placeholder="+1234567890"
			@update:modelValue="update('phone', $event)" />
		<label class="form-label">Message</label>
		<textarea
			class="form-textarea"
			:value="fields.message || ''"
			rows="3"
			@input="update('message', $event.target.value)" />
	</div>
</template>

<script>
import { NcTextField } from '@nextcloud/vue'

export default {
	name: 'SmsForm',
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
.sms-form {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.form-label {
	font-weight: bold;
}

.form-textarea {
	width: 100%;
	padding: 8px;
	border: 1px solid var(--color-border);
	border-radius: var(--border-radius);
	font-family: inherit;
	resize: vertical;
}
</style>
