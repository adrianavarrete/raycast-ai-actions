import { getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './shared/execute_command/execute_command'

const { promptSummarize, commandCustomModelName } = getPreferenceValues()

export default function SummarizeCommand() {
	const { modelOwner, modelName, modelCode } = getModel(commandCustomModelName)

	const aiApiClient = getAiAPIClient(modelOwner)

	return (
		<ExecuteCommand
			commandPrompt={promptSummarize}
			aiApiClient={aiApiClient}
			modelOwner={modelOwner}
			modelName={modelName}
			modelCode={modelCode}
		/>
	)
}
