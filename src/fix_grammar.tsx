import CommandResponseLayoutComponent from './shared/command_response_layout'
import { getPreferenceValues, getSelectedText } from '@raycast/api'
import {
	showToastApiKeyError,
	getModel,
	showToastModelError,
	isApiKeyConfigured,
	showToastSelectedTextError,
	getAiAPIClient,
	countToken,
	estimatePrice
} from './shared/utils'
import React from 'react'
const { promptFixGrammar } = getPreferenceValues()

export default function FixGrammarCommand() {
	const { modelOwner, model } = getModel()

	const aiApiClient = getAiAPIClient()

	const [isLoading, setIsLoading] = React.useState(false)
	const [response, setResponse] = React.useState('')
	const [promptTokenCount, setPromptTokenCount] = React.useState(0)
	const [responseTokenCount, setResponseTokenCount] = React.useState(0)
	const [totalCost, setTotalCost] = React.useState<string>('')

	const handleGetSelectedText = React.useCallback(async () => {
		try {
			return getSelectedText()
		} catch (error) {
			showToastSelectedTextError()
			return `Error getting selected text: ${error}`
		}
	}, [])

	const handleGetStream = React.useCallback(async () => {
		const selectedText = await handleGetSelectedText()
		const countPromptTokens = countToken({ text: `${promptFixGrammar} ${selectedText}` })
		setPromptTokenCount(countPromptTokens)
		setTotalCost(estimatePrice({ promptTokenCount: countPromptTokens, responseTokenCount: 0 }))
		setIsLoading(true)

		try {
			const chunksStream = await aiApiClient.createStream({
				selectedText: selectedText,
				systemPrompt: promptFixGrammar,
				model
			})
			let response = ''
			for await (const chunk of chunksStream) {
				const chunkContent = chunk.choices[0].delta.content as string
				if (chunkContent) {
					response += chunkContent
				}
				setResponse(response)
				const countResponseTokens = countToken({ text: response })
				setResponseTokenCount(countResponseTokens)
				setTotalCost(
					estimatePrice({
						promptTokenCount: countPromptTokens,
						responseTokenCount: countResponseTokens
					})
				)
			}
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}, [])

	React.useEffect(() => {
		if (!model) {
			showToastModelError()
		}
		if (!isApiKeyConfigured({ modelOwner })) {
			showToastApiKeyError({ modelOwner })
		}
		handleGetStream()
	}, [model, modelOwner, handleGetStream])

	return (
		<CommandResponseLayoutComponent
			response={response}
			isLoading={isLoading}
			promptTokenCount={promptTokenCount}
			responseTokenCount={responseTokenCount}
			currentModel={model}
			totalCost={totalCost}
		/>
	)
}
