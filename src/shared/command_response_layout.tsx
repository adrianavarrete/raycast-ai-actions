import { Detail, ActionPanel, Action, environment } from '@raycast/api'
import AiActionConfigurationComponent from './ai_action_configuration'

export default function CommandResponseLayoutComponent({
	response = 'There is not a prompt'
}: {
	response?: string
}) {
	const { commandName } = environment
	return (
		<Detail
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
					<Action.Push
						title={'AI Action Configuration'}
						target={<AiActionConfigurationComponent commandName={commandName} />}
					/>
				</ActionPanel>
			}
		/>
	)
}
