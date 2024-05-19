import { Detail, ActionPanel, Action, openCommandPreferences, openExtensionPreferences } from '@raycast/api'

export default function CommandResponseLayoutComponent({
	response,
	isLoading,
	promptTokenCount = 0,
	responseTokenCount = 0,
	currentModel
}: {
	response: string
	isLoading: boolean
	promptTokenCount: number
	responseTokenCount: number
	currentModel: string
}) {
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
					<Detail.Metadata.Label title="Total Tokens" text={'test'} />
					<Detail.Metadata.Label title="Total Cost" text={'test'} />
					<Detail.Metadata.Separator />
					<Detail.Metadata.Label title="Culmulative Tokens" text={'test'} />
					<Detail.Metadata.Label title="Culmulative Cost" text={'test'} />
				</Detail.Metadata>
			}
			actions={
				<ActionPanel title="#1 in raycast/extensions">
					<Action.CopyToClipboard title="Copy Response" content={response} />
					<Action.Paste content={response} />
					<Action title="Add API Key" onAction={() => openExtensionPreferences()} />{' '}
					<Action title="Configure Command" onAction={() => openCommandPreferences()} />{' '}
				</ActionPanel>
			}
		/>
	)
}
