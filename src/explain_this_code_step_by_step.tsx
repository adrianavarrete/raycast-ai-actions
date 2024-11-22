import { LaunchProps, getPreferenceValues } from '@raycast/api'
import { getAiAPIClient, getModel } from './shared/utils'
import ExecuteCommand from './shared/execute_command/execute_command'

const { commandCustomModelName } = getPreferenceValues()

export default function ExplainThisCodeStepByStep(
	props: LaunchProps<{ arguments: Arguments.ExplainThisCodeStepByStep }>
) {
	const { model: modelSelected } = props.arguments

	const modelData = getModel(modelSelected || commandCustomModelName)

	const { modelOwner, modelName, modelCode } = modelData
	const prompt = `
	Act as a software engineer with deep understanding of any programming language and it's documentation. Explain how the code works step by step in a list. Be concise with a casual tone of voice and write it as documentation for others.

Code:

	function GoToPreviousPageAction() {
		const [page, setPage] = useGlobalState('page')
		return (
			<Action
				icon={Icon.ArrowLeftCircle}
				title="Go to Previous Page"
				shortcut={{ modifiers: ['cmd'], key: '[' }}
				onAction={() => setPage(Math.max(page - 1, 0))}
			/>
		)
	}
	;

Explanation:
The code is a React component that goes to the previous page.
1. The component renders an 'Action' component with an icon, title, and shortcut.
3. The 'useGlobalState' hook is used to get the current page number from the global state.
4. The 'onAction' prop is used to set the page number to one less than the current page number.
5. This will cause the page to go back one page when the action is taken.
6. The page is capped at 0 so that the page is never negative.

Code: {selection}

Explanation:
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
