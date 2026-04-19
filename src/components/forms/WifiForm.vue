<template>
	<div class="wifi-form">
		<NcTextField label="SSID (Network Name)"
			:modelValue="fields.ssid || ''"
			@update:modelValue="update('ssid', $event)" />
		<NcTextField label="Password"
			:modelValue="fields.password || ''"
			@update:modelValue="update('password', $event)" />

		<fieldset class="security-fieldset">
			<legend>Security Type</legend>
			<NcCheckboxRadioSwitch
				:model-value="fields.security || 'WPA'"
				value="WPA"
				name="security"
				type="radio"
				@update:model-value="update('security', $event)">
				WPA/WPA2
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:model-value="fields.security || 'WPA'"
				value="WEP"
				name="security"
				type="radio"
				@update:model-value="update('security', $event)">
				WEP
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch
				:model-value="fields.security || 'WPA'"
				value="nopass"
				name="security"
				type="radio"
				@update:model-value="update('security', $event)">
				None
			</NcCheckboxRadioSwitch>
		</fieldset>
	</div>
</template>

<script>
import { NcTextField, NcCheckboxRadioSwitch } from '@nextcloud/vue'

export default {
	name: 'WifiForm',
	components: { NcTextField, NcCheckboxRadioSwitch },
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
.wifi-form {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.security-fieldset {
	border: none;
	padding: 0;
	margin: 0;
}

.security-fieldset legend {
	font-weight: bold;
	margin-bottom: 4px;
}
</style>
