import { getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './shared/execute_command/execute_command'

const { promptSummarize } = getPreferenceValues()

export default function SummarizeCommand() {
	const { modelOwner, modelName, modelCode } = getModel()

	const aiApiClient = getAiAPIClient()

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
