import { Detail, ActionPanel, Action, openCommandPreferences, openExtensionPreferences } from '@raycast/api'
import { parsePrice } from '../utils'

export default function CommandResponseLayoutComponent({
	response,
	isLoading,
	promptTokenCount = 0,
	responseTokenCount = 0,
	totalCost = 0,
	dailyCost = 0,
	monthlyCost = 0,
	currentModel
}: {
	response: string
	isLoading: boolean
	promptTokenCount: number
	responseTokenCount: number
	totalCost: number
	dailyCost: number
	monthlyCost: number
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
					<Detail.Metadata.Label
						title="Prompt Tokens"
						text={isLoading ? 'Loading...' : promptTokenCount.toString()}
					/>
					<Detail.Metadata.Label
						title="Response Tokens"
						text={isLoading ? 'Loading...' : responseTokenCount.toString()}
					/>
					<Detail.Metadata.Separator />
					<Detail.Metadata.Label
						title="Total Tokens"
						text={isLoading ? 'Loading...' : totalTokens.toString()}
					/>
					<Detail.Metadata.Label title="Total Cost" text={isLoading ? 'Loading...' : parsePrice(totalCost)} />
					<Detail.Metadata.Separator />
					<Detail.Metadata.Label
						title="Spent today"
						text={isLoading ? 'Loading...' : parsePrice(dailyCost)}
					/>
					<Detail.Metadata.Label
						title="Spent this month"
						text={isLoading ? 'Loading...' : parsePrice(monthlyCost)}
					/>
				</Detail.Metadata>
			}
			actions={
				<ActionPanel title="Action panel">
					<Action.CopyToClipboard title="Copy Response" content={response} />
					<Action.Paste content={response} />
					<Action title="Configure API Keys" onAction={() => openExtensionPreferences()} />{' '}
					<Action title="Configure Command" onAction={() => openCommandPreferences()} />{' '}
				</ActionPanel>
			}
		/>
	)
}
