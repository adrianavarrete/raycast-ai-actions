import { LaunchProps, getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './shared/execute_command/execute_command'

const { promptTranslate } = getPreferenceValues()

export default function TranslateCommand(props: LaunchProps<{ arguments: Arguments.Translate }>) {
	const { language } = props.arguments
	const { modelOwner, modelName, modelCode } = getModel()

	const finalPrompt = promptTranslate + ` ${language}`

	const aiApiClient = getAiAPIClient()

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
