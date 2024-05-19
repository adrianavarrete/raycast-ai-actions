import { getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './execute_command'

const { promptSummarize } = getPreferenceValues()

export default function SummarizeCommand() {
	const { modelOwner, model } = getModel()

	const aiApiClient = getAiAPIClient()

	return (
		<ExecuteCommand
			commandPrompt={promptSummarize}
			aiApiClient={aiApiClient}
			modelOwner={modelOwner}
			model={model}
		/>
	)
}
