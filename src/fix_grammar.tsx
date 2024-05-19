import CommandResponseLayoutComponent from './shared/command_response_layout'
import { getPreferenceValues, getSelectedText } from '@raycast/api'
import {
	showToastApiKeyError,
	getModel,
	showToastModelError,
	isApiKeyConfigured,
	showToastSelectedTextError,
	getAiAPIClient
} from './shared/utils'
import React from 'react'
const { promptFixGrammar } = getPreferenceValues()

export default function FixGrammarCommand() {
	const { modelOwner, model } = getModel()

	const aiApiClient = getAiAPIClient()

	const [isLoading, setIsLoading] = React.useState(false)
	const [response, setResponse] = React.useState('')

	const handleGetSelectedText = React.useCallback(async () => {
		try {
			return getSelectedText()
		} catch (error) {
			return `Error getting selected text: ${error}`
			showToastSelectedTextError()
		}
	}, [])

	const handleGetStream = React.useCallback(async () => {
		const selectedText = await handleGetSelectedText()

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

	return <CommandResponseLayoutComponent response={response} isLoading={isLoading} />
}
