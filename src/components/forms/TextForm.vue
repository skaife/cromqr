<template>
	<div>
		<label class="form-label">{{ t('cromqr', 'Text') }}</label>
		<textarea
			class="form-textarea"
			:value="fields.text || ''"
			:placeholder="t('cromqr', 'Enter text...')"
			rows="5"
			@input="update('text', $event.target.value)" />
	</div>
</template>

<script>
import { t } from '@nextcloud/l10n'

export default {
	name: 'TextForm',
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
.form-label {
	display: block;
	margin-bottom: 4px;
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
