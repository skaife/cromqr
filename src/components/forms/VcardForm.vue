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
		<NcTextField v-if="!hasSingleInstance('org')"
			:label="t('cromqr', 'Organization')"
			:modelValue="fields.org || ''"
			@update:modelValue="update('org', $event)" />
		<NcTextField :label="t('cromqr', 'Title')"
			:modelValue="fields.title || ''"
			@update:modelValue="update('title', $event)" />
		<NcTextField :label="t('cromqr', 'Website')"
			:modelValue="fields.website || ''"
			@update:modelValue="update('website', $event)" />

		<div v-if="additionalFields.length" class="additional-fields">
			<div v-for="(field, index) in additionalFields"
				:key="index"
				class="additional-field">

				<div v-if="field.type === 'phone'" class="field-row">
					<select class="subtype-select"
						:value="field.subtype || 'mobile'"
						@change="updateField(index, 'subtype', $event.target.value)">
						<option value="mobile">{{ t('cromqr', 'Mobile') }}</option>
						<option value="work">{{ t('cromqr', 'Work') }}</option>
						<option value="fax">{{ t('cromqr', 'Fax') }}</option>
					</select>
					<NcTextField class="field-input"
						:label="t('cromqr', 'Phone')"
						:modelValue="field.value || ''"
						@update:modelValue="updateField(index, 'value', $event)" />
					<NcButton type="tertiary"
						:aria-label="t('cromqr', 'Remove')"
						@click="removeField(index)">
						<template #icon>
							<Close :size="20" />
						</template>
					</NcButton>
				</div>

				<div v-else-if="field.type === 'url'" class="field-row">
					<select class="subtype-select"
						:value="field.subtype || 'website'"
						@change="updateField(index, 'subtype', $event.target.value)">
						<option value="website">{{ t('cromqr', 'Website') }}</option>
						<option value="social">{{ t('cromqr', 'Social') }}</option>
					</select>
					<NcTextField class="field-input"
						:label="t('cromqr', 'URL')"
						:modelValue="field.value || ''"
						@update:modelValue="updateField(index, 'value', $event)" />
					<NcButton type="tertiary"
						:aria-label="t('cromqr', 'Remove')"
						@click="removeField(index)">
						<template #icon>
							<Close :size="20" />
						</template>
					</NcButton>
				</div>

				<div v-else-if="field.type === 'org'" class="field-block">
					<div class="field-block-header">
						<span class="field-block-label">{{ t('cromqr', 'Organization') }}</span>
						<NcButton type="tertiary"
							:aria-label="t('cromqr', 'Remove')"
							@click="removeField(index)">
							<template #icon>
								<Close :size="20" />
							</template>
						</NcButton>
					</div>
					<NcTextField :label="t('cromqr', 'Organization')"
						:modelValue="(field.value && field.value.org) || ''"
						@update:modelValue="updateOrgField(index, 'org', $event)" />
					<NcTextField :label="t('cromqr', 'Department')"
						:modelValue="(field.value && field.value.dept) || ''"
						@update:modelValue="updateOrgField(index, 'dept', $event)" />
					<NcTextField :label="t('cromqr', 'Sub-department')"
						:modelValue="(field.value && field.value.subdept) || ''"
						@update:modelValue="updateOrgField(index, 'subdept', $event)" />
				</div>

				<div v-else-if="field.type === 'nickname'" class="field-row">
					<NcTextField class="field-input"
						:label="t('cromqr', 'Nickname')"
						:modelValue="field.value || ''"
						@update:modelValue="updateField(index, 'value', $event)" />
					<NcButton type="tertiary"
						:aria-label="t('cromqr', 'Remove')"
						@click="removeField(index)">
						<template #icon>
							<Close :size="20" />
						</template>
					</NcButton>
				</div>

				<div v-else-if="field.type === 'bday'" class="field-row">
					<div class="date-field field-input">
						<label class="date-label">{{ t('cromqr', 'Birthday') }}</label>
						<input type="date"
							class="date-input"
							:value="field.value || ''"
							@input="updateField(index, 'value', $event.target.value)" />
					</div>
					<NcButton type="tertiary"
						:aria-label="t('cromqr', 'Remove')"
						@click="removeField(index)">
						<template #icon>
							<Close :size="20" />
						</template>
					</NcButton>
				</div>

				<div v-else-if="field.type === 'note'" class="field-row">
					<NcTextField class="field-input"
						:label="t('cromqr', 'Note')"
						:modelValue="field.value || ''"
						@update:modelValue="updateField(index, 'value', stripNewlines($event))" />
					<NcButton type="tertiary"
						:aria-label="t('cromqr', 'Remove')"
						@click="removeField(index)">
						<template #icon>
							<Close :size="20" />
						</template>
					</NcButton>
				</div>
			</div>
		</div>

		<NcActions :menu-name="t('cromqr', 'Add field')" type="secondary">
			<template #icon>
				<Plus :size="20" />
			</template>
			<NcActionButton @click="addField('phone')">
				{{ t('cromqr', 'Phone') }}
			</NcActionButton>
			<NcActionButton @click="addField('url')">
				{{ t('cromqr', 'URL') }}
			</NcActionButton>
			<NcActionButton v-if="!hasSingleInstance('org')"
				@click="addField('org')">
				{{ t('cromqr', 'Organization') }}
			</NcActionButton>
			<NcActionButton v-if="!hasSingleInstance('nickname')"
				@click="addField('nickname')">
				{{ t('cromqr', 'Nickname') }}
			</NcActionButton>
			<NcActionButton v-if="!hasSingleInstance('bday')"
				@click="addField('birthday')">
				{{ t('cromqr', 'Birthday') }}
			</NcActionButton>
			<NcActionButton v-if="!hasSingleInstance('note')"
				@click="addField('note')">
				{{ t('cromqr', 'Note') }}
			</NcActionButton>
		</NcActions>
	</div>
</template>

<script>
import { computed } from 'vue'
import { NcTextField, NcButton, NcActions, NcActionButton } from '@nextcloud/vue'
import { t } from '@nextcloud/l10n'
import Plus from 'vue-material-design-icons/Plus.vue'
import Close from 'vue-material-design-icons/Close.vue'

const SINGLE_INSTANCE_TYPES = new Set(['org', 'nickname', 'bday', 'note'])

const FIELD_DEFAULTS = {
	phone: { type: 'phone', subtype: 'mobile', value: '' },
	url: { type: 'url', subtype: 'website', value: '' },
	org: { type: 'org', value: { org: '', dept: '', subdept: '' } },
	nickname: { type: 'nickname', value: '' },
	birthday: { type: 'bday', value: '' },
	note: { type: 'note', value: '' },
}

export default {
	name: 'VcardForm',
	components: { NcTextField, NcButton, NcActions, NcActionButton, Plus, Close },
	props: {
		fields: { type: Object, default: () => ({}) },
	},
	emits: ['update:fields'],
	setup(props, { emit }) {
		const additionalFields = computed(() => props.fields.additionalFields || [])

		function update(key, value) {
			emit('update:fields', { ...props.fields, [key]: value })
		}

		function emitAdditional(newArray) {
			emit('update:fields', { ...props.fields, additionalFields: newArray })
		}

		function addField(type) {
			const template = FIELD_DEFAULTS[type]
			if (!template) return
			const newField = JSON.parse(JSON.stringify(template))
			if (type === 'org' && props.fields.org) {
				const raw = props.fields.org
				const first = raw.indexOf(';')
				const second = first >= 0 ? raw.indexOf(';', first + 1) : -1
				if (first < 0) {
					newField.value = { org: raw, dept: '', subdept: '' }
				} else if (second < 0) {
					newField.value = { org: raw.slice(0, first), dept: raw.slice(first + 1), subdept: '' }
				} else {
					newField.value = { org: raw.slice(0, first), dept: raw.slice(first + 1, second), subdept: raw.slice(second + 1) }
				}
			}
			emitAdditional([...additionalFields.value, newField])
		}

		function removeField(index) {
			const updated = [...additionalFields.value]
			updated.splice(index, 1)
			emitAdditional(updated)
		}

		function updateField(index, key, value) {
			const updated = [...additionalFields.value]
			updated[index] = { ...updated[index], [key]: value }
			emitAdditional(updated)
		}

		function updateOrgField(index, subKey, value) {
			const updated = [...additionalFields.value]
			const current = updated[index]
			const newValue = { ...(current.value || {}), [subKey]: value }
			updated[index] = { ...current, value: newValue }
			const joined = [newValue.org || '', newValue.dept || '', newValue.subdept || '']
				.join(';').replace(/;+$/, '')
			emit('update:fields', {
				...props.fields,
				org: joined,
				additionalFields: updated,
			})
		}

		function hasSingleInstance(type) {
			return additionalFields.value.some(f => f.type === type)
		}

		function stripNewlines(value) {
			return value.replace(/[\r\n]/g, '')
		}

		return {
			additionalFields,
			update,
			addField,
			removeField,
			updateField,
			updateOrgField,
			hasSingleInstance,
			stripNewlines,
			t,
		}
	},
}
</script>

<style scoped>
.vcard-form {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.additional-fields {
	margin-top: 8px;
	border-top: 1px solid var(--color-border);
	padding-top: 12px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.field-row {
	display: flex;
	align-items: flex-end;
	gap: 8px;
}

.field-input {
	flex: 1;
	min-width: 0;
}

.subtype-select {
	height: 36px;
	padding: 0 8px;
	border: 2px solid var(--color-border-maxcontrast);
	border-radius: var(--border-radius-large);
	background: var(--color-main-background);
	color: var(--color-main-text);
	font-size: 14px;
	min-width: 90px;
}

.field-block {
	border: 1px solid var(--color-border);
	border-radius: var(--border-radius-large);
	padding: 12px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.field-block-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.field-block-label {
	font-weight: bold;
	font-size: 14px;
}

.date-field {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.date-label {
	font-size: 14px;
	color: var(--color-text-maxcontrast);
}

.date-input {
	height: 36px;
	padding: 0 8px;
	border: 2px solid var(--color-border-maxcontrast);
	border-radius: var(--border-radius-large);
	background: var(--color-main-background);
	color: var(--color-main-text);
	font-size: 14px;
}
</style>
