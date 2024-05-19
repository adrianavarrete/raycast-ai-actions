import { getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './execute_command'

const { promptFixGrammar } = getPreferenceValues()

export default function FixGrammarCommand() {
	const { modelOwner, model } = getModel()

	const aiApiClient = getAiAPIClient()

	return (
		<ExecuteCommand
			commandPrompt={promptFixGrammar}
			aiApiClient={aiApiClient}
			modelOwner={modelOwner}
			model={model}
		/>
	)
}
