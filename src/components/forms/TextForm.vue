<template>
	<div>
		<label class="form-label">Text</label>
		<textarea
			class="form-textarea"
			:value="fields.text || ''"
			placeholder="Enter text..."
			rows="5"
			@input="update('text', $event.target.value)" />
	</div>
</template>

<script>
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
		return { update }
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
