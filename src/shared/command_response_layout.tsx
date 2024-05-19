import { Detail, ActionPanel, Action, openCommandPreferences, openExtensionPreferences } from '@raycast/api'

export default function CommandResponseLayoutComponent({
	response,
	isLoading
}: {
	response: string
	isLoading: boolean
}) {
	return (
		<Detail
			isLoading={isLoading}
			markdown={response}
			metadata={
				<Detail.Metadata>
					<Detail.Metadata.Label title="Current Model" text={'test'} />
					<Detail.Metadata.Label title="Prompt Tokens" text={'test'} />
					<Detail.Metadata.Label title="Response Tokens" text={'test'} />
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
