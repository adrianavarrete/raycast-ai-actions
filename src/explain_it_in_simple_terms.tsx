import { getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './shared/execute_command/execute_command'

const { promptExplainItInSimpleTerms } = getPreferenceValues()

export default function FixGrammarCommand() {
	const { modelOwner, modelName, modelCode } = getModel()

	const aiApiClient = getAiAPIClient()

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
