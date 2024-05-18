import CommandResponseLayoutComponent from './shared/command_response_layout'
import { getPreferenceValues, showToast, Toast } from '@raycast/api'
import { OPEN_AI_MODELS } from './shared/constants'

const { prompt_fix_grammar, default_llm, openai_apikey } = getPreferenceValues()

const isDefaultValueFromOpenAi = OPEN_AI_MODELS.some(model => model === default_llm)

console.log(getPreferenceValues())

async function showErrorToast({ defaultModelOwner }: { defaultModelOwner: string }) {
	await showToast(Toast.Style.Failure, `Error: Configure the API Key for ${defaultModelOwner}`)
}

export default function FixGrammarCommand() {
	if (isDefaultValueFromOpenAi && !openai_apikey) {
		showErrorToast({ defaultModelOwner: 'OpenAI' })
	}

	return CommandResponseLayoutComponent({ response: prompt_fix_grammar })
}
