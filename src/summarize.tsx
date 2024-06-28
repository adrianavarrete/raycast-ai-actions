import { getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './shared/execute_command/execute_command'

const { commandCustomModelName } = getPreferenceValues()

export default function SummarizeCommand() {
	const { modelOwner, modelName, modelCode } = getModel(commandCustomModelName)

	const prompt = `Extract all facts from the text and summarize it in all relevant aspects in up to seven bullet points and a 1-liner summary.
	 Pick a good matching emoji for every bullet point.

	Text: {selection}

	Summary:`

	const aiApiClient = getAiAPIClient(modelOwner)

	return (
		<ExecuteCommand
			commandPrompt={prompt}
			aiApiClient={aiApiClient}
			modelOwner={modelOwner}
			modelName={modelName}
			modelCode={modelCode}
		/>
	)
}
