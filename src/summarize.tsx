import CommandResponseLayoutComponent from './shared/command_response_layout'
import { getPreferenceValues, showToast, Toast } from '@raycast/api'
import { OPEN_AI_MODELS } from './shared/constants'

const { promptFixGrammar, defaultModel, openaiApiKey } = getPreferenceValues()

const isDefaultValueFromOpenAi = OPEN_AI_MODELS.some(model => model === defaultModel)

console.log(getPreferenceValues())

async function showErrorToast({ defaultModelOwner }: { defaultModelOwner: string }) {
	await showToast(Toast.Style.Failure, `Error: Configure the API Key for ${defaultModelOwner}`)
}

export default function SummarizeCommand() {
	if (isDefaultValueFromOpenAi && !openaiApiKey) {
		showErrorToast({ defaultModelOwner: 'OpenAI' })
	}

	return CommandResponseLayoutComponent({ response: promptFixGrammar })
}
