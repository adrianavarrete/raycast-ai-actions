import { getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './shared/execute_command/execute_command'

const { commandCustomModelName } = getPreferenceValues()

export default function ExplainItInSimpleTermsCommand() {
	const { modelOwner, modelName, modelCode } = getModel(commandCustomModelName)

	const prompt = `Your task is to explain the topic provided in very simple terms that are easy for anyone to understand, regardless of their background or education level. 
	The goal is to make the concept accessible and clear to all types of people. 

	Here is the topic to explain: {selection}.

	To craft your explanation:
	- Break down the topic into a few key points that capture the essential ideas
	- Explain each point using clear, concise language- Avoid jargon or technical terms as much as possible. If you must use them, be sure to define them 
	-Focus on making the explanation relatable and understandable to a broad audience.

	After providing your explanation, come up with a simple example or analogy that illustrates the concept in a concrete way. 
	The example should be something most people can relate to from everyday life. 
	`
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
