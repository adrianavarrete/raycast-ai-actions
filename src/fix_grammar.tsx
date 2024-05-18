import CommandResponseLayoutComponent from './shared/command_response_layout'
import { getPreferenceValues } from '@raycast/api'
import { showToastApiKeyError, getModel, showToastModelError, isApiKeyConfigured } from './shared/utils'

const { promptFixGrammar } = getPreferenceValues()

export default function FixGrammarCommand() {
	const { modelOwner, model } = getModel()

	if (!model) {
		showToastModelError()
	}
	if (!isApiKeyConfigured({ modelOwner })) {
		showToastApiKeyError({ modelOwner })
	}
	return CommandResponseLayoutComponent({ response: promptFixGrammar })
}
