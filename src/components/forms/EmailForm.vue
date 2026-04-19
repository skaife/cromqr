<template>
	<div class="email-form">
		<NcTextField label="To"
			:modelValue="fields.to || ''"
			placeholder="recipient@example.com"
			@update:modelValue="update('to', $event)" />
		<NcTextField label="Subject"
			:modelValue="fields.subject || ''"
			@update:modelValue="update('subject', $event)" />
		<label class="form-label">Body</label>
		<textarea
			class="form-textarea"
			:value="fields.body || ''"
			rows="4"
			@input="update('body', $event.target.value)" />
	</div>
</template>

<script>
import { NcTextField } from '@nextcloud/vue'

export default {
	name: 'EmailForm',
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
.email-form {
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
