import { getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './shared/execute_command/execute_command'

const { commandCustomModelName } = getPreferenceValues()

const prompt = `Act as a spelling corrector and improver. (replyWithRewrittenText)

Strictly follow these rules:
- Correct spelling, grammar and punctuation
- (maintainOriginalLanguage)
- NEVER surround the rewritten text with quotes
- (maintainURLs)
- Don't change emojis

Text: {selection}

Fixed Text:
`

export default function FixGrammarCommand() {
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
