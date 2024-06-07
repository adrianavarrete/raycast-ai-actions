import { getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './shared/execute_command/execute_command'

const { promptExplainItInSimpleTerms, commandCustomModelName } = getPreferenceValues()

export default function FixGrammarCommand() {
	const { modelOwner, modelName, modelCode } = getModel(commandCustomModelName)

	const aiApiClient = getAiAPIClient(modelOwner)

	return (
		<ExecuteCommand
			commandPrompt={promptExplainItInSimpleTerms}
			aiApiClient={aiApiClient}
			modelOwner={modelOwner}
			modelName={modelName}
			modelCode={modelCode}
		/>
	)
}
