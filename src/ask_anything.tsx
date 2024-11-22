import { LaunchProps, getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './shared/execute_command/execute_command'

const { commandCustomModelName } = getPreferenceValues()

export default function AskAnything(props: LaunchProps<{ arguments: Arguments.AskAnything }>) {
	const { question, model: modelSelected } = props.arguments

	const modelData = getModel(modelSelected || commandCustomModelName)

	const { modelOwner, modelName, modelCode } = modelData

	const prompt = `Given the text enclosed within <text> tags:

	<text>{selection}</text>

	Answer the following question, where references like ‘this’, ‘that’, or similar refer to the <text>:

	${question}
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
