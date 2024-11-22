import { LaunchProps, getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './shared/execute_command/execute_command'

const { commandCustomModelName } = getPreferenceValues()

export default function AskAnything(props: LaunchProps<{ arguments: Arguments.AskAnything }>) {
	const { modelOwner, modelName, modelCode } = getModel(commandCustomModelName)
	const { question } = props.arguments

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
