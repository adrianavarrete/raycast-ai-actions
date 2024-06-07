import { LaunchProps, getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './shared/execute_command/execute_command'

const { promptTranslate, commandCustomModelName } = getPreferenceValues()

export default function TranslateCommand(props: LaunchProps<{ arguments: Arguments.Translate }>) {
	const { modelOwner, modelName, modelCode } = getModel(commandCustomModelName)

	const aiApiClient = getAiAPIClient(modelOwner)

	const { language } = props.arguments
	const finalPrompt = promptTranslate + ` ${language}`

	return (
		<ExecuteCommand
			commandPrompt={finalPrompt}
			aiApiClient={aiApiClient}
			modelOwner={modelOwner}
			modelName={modelName}
			modelCode={modelCode}
		/>
	)
}
