import { LaunchProps, getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './shared/execute_command/execute_command'

const { commandCustomModelName } = getPreferenceValues()

export default function TranslateCommand(props: LaunchProps<{ arguments: Arguments.Translate }>) {
	const { modelOwner, modelName, modelCode } = getModel(commandCustomModelName)
	const { language } = props.arguments

	const prompt = `Translate the text in ${language}.

	Text: {selection}
	
	Translation`

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
