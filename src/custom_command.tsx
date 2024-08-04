import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './shared/execute_command/execute_command'

type CustomCommandArguments = {
	arguments: {
		prompt: string
		modelName: string
	}
}

export default function CustomCommand(props: CustomCommandArguments) {
	const prompt = props.arguments.prompt
	const commandCustomModelName = props.arguments.modelName

	const { modelOwner, modelName, modelCode } = getModel(commandCustomModelName)

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
