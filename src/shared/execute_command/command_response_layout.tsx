import { Detail, ActionPanel, Action, openCommandPreferences, openExtensionPreferences } from '@raycast/api'

export default function CommandResponseLayoutComponent({
	response,
	isLoading,
	promptTokenCount = 0,
	responseTokenCount = 0,
	totalCost = 'No cost',
	currentModel
}: {
	response: string
	isLoading: boolean
	promptTokenCount: number
	responseTokenCount: number
	totalCost: string
	currentModel: string
}) {
	const totalTokens = promptTokenCount + responseTokenCount

	return (
		<Detail
			isLoading={isLoading}
			markdown={response}
			metadata={
				<Detail.Metadata>
					<Detail.Metadata.Label title="Current Model" text={currentModel} />
					<Detail.Metadata.Label title="Prompt Tokens" text={promptTokenCount.toString()} />
					<Detail.Metadata.Label title="Response Tokens" text={responseTokenCount.toString()} />
					<Detail.Metadata.Separator />
					<Detail.Metadata.Label title="Total Tokens" text={totalTokens.toString()} />
					<Detail.Metadata.Label title="Total Cost" text={totalCost.toString()} />
				</Detail.Metadata>
			}
			actions={
				<ActionPanel title="Action panel">
					<Action.CopyToClipboard title="Copy Response" content={response} />
					<Action.Paste content={response} />
					<Action title="Add API Key" onAction={() => openExtensionPreferences()} />{' '}
					<Action title="Configure Command" onAction={() => openCommandPreferences()} />{' '}
				</ActionPanel>
			}
		/>
	)
}
