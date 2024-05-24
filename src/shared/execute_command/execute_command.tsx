import React from 'react'
import moment from 'moment'

import CommandResponseLayoutComponent from './command_response_layout'
import { getSelectedText, LocalStorage } from '@raycast/api'
import {
	showToastApiKeyError,
	showToastModelError,
	isApiKeyConfigured,
	showToastSelectedTextError,
	countToken,
	estimatePrice,
	showCustomToastError
} from '../utils'
import { OpenAiClient } from '../api/openai_client'
import { ChatCompletionChunk } from 'openai/resources'
import { Stream } from 'openai/streaming'
import { AnthropicClient } from '../api/anthropic_client'
import { Anthropic } from '@anthropic-ai/sdk'
import { MODEL_OWNERS } from '../constants'

export default function ExecuteCommand({
	commandPrompt,
	aiApiClient,
	modelOwner,
	modelCode,
	modelName
}: {
	commandPrompt: string
	aiApiClient: OpenAiClient | AnthropicClient
	modelOwner: string
	modelCode: string
	modelName: string
}) {
	const [isLoading, setIsLoading] = React.useState(false)
	const [response, setResponse] = React.useState('')
	const [promptTokenCount, setPromptTokenCount] = React.useState(0)
	const [responseTokenCount, setResponseTokenCount] = React.useState(0)
	const [totalCost, setTotalCost] = React.useState(0)
	const [monthlyCost, setMonthlyCost] = React.useState(0)
	const [dailyCost, setDailyCost] = React.useState(0)

	const handleGetSelectedText = React.useCallback(async () => {
		try {
			return getSelectedText()
		} catch (error) {
			showToastSelectedTextError()
			return `Error getting selected text: ${error}`
		}
	}, [getSelectedText, showToastSelectedTextError])

	const handleMoneySpent = React.useCallback(async (_totalCost: number) => {
		const currentDayOfYear = moment().dayOfYear()
		const currentMonth = moment().month()
		let storedDayOfYear
		let storedMonth
		let storedMonthlyCost
		let storedDailyCost

		storedDayOfYear = await LocalStorage.getItem('storedDayOfYear')
		storedMonth = await LocalStorage.getItem('storedMonth')
		storedMonthlyCost = await LocalStorage.getItem('storedMonthlyCost')
		storedDailyCost = await LocalStorage.getItem('storedDailyCost')

		if (!storedDayOfYear) {
			storedDayOfYear = currentDayOfYear
			await LocalStorage.setItem('storedDayOfYear', currentDayOfYear)
		}
		if (!storedMonth) {
			storedMonth = currentMonth
			await LocalStorage.setItem('storedMonth', currentMonth)
		}
		if (!storedMonthlyCost) {
			storedMonthlyCost = 0
			await LocalStorage.setItem('storedMonthlyCost', 0)
		}
		if (!storedDailyCost) {
			storedDailyCost = 0
			await LocalStorage.setItem('storedDailyCost', 0)
		}

		if (currentMonth !== storedMonth) {
			await LocalStorage.setItem('storedMonth', currentMonth)
			await LocalStorage.setItem('storedMonthlyCost', _totalCost)
			setMonthlyCost(_totalCost)
		}
		if (currentDayOfYear !== storedDayOfYear) {
			await LocalStorage.setItem('storedDayOfYear', currentDayOfYear)
			await LocalStorage.setItem('storedDailyCost', _totalCost)
			setDailyCost(_totalCost)
		}
		if (currentMonth === storedMonth) {
			await LocalStorage.setItem('storedMonthlyCost', (storedMonthlyCost as number) + _totalCost)
			setMonthlyCost((storedMonthlyCost as number) + _totalCost)
		}
		if (currentDayOfYear === storedDayOfYear) {
			await LocalStorage.setItem('storedDailyCost', (storedDailyCost as number) + _totalCost)
			setDailyCost((storedDailyCost as number) + _totalCost)
		}
	}, [])

	const handleGetStream = React.useCallback(async () => {
		const selectedText = await handleGetSelectedText()

		if (!commandPrompt) {
			const message = 'Unable to get the command prompt'
			showCustomToastError({ message })
			return message
		}

		setIsLoading(true)
		try {
			const chunksStream = await aiApiClient.createStream({
				selectedText: selectedText,
				systemPrompt: commandPrompt,
				modelCode
			})

			const { countPromptTokens, countResponseTokens } = await parseStream({
				chunksStream,
				modelOwner,
				setResponse,
				setPromptTokenCount,
				setResponseTokenCount
			})

			const totalStreamCost = estimatePrice({
				promptTokenCount: countPromptTokens,
				responseTokenCount: countResponseTokens
			})

			setTotalCost(totalStreamCost)
			handleMoneySpent(totalStreamCost)
		} catch (error) {
			if (!modelCode) {
				return showToastModelError()
			}
			if (!isApiKeyConfigured()) {
				return showToastApiKeyError({ modelOwner })
			}
			return showCustomToastError({ message: `Connection with ${modelOwner} cannot be established` })
		} finally {
			setIsLoading(false)
		}
	}, [handleGetSelectedText, commandPrompt, handleMoneySpent])

	React.useEffect(() => {
		handleGetStream()
	}, [handleGetStream])

	return (
		<CommandResponseLayoutComponent
			response={response}
			isLoading={isLoading}
			promptTokenCount={promptTokenCount}
			responseTokenCount={responseTokenCount}
			currentModel={modelName}
			totalCost={totalCost}
			dailyCost={dailyCost}
			monthlyCost={monthlyCost}
		/>
	)

	// Helpers //

	async function parseStream({
		chunksStream,
		modelOwner,
		setResponse,
		setResponseTokenCount,
		setPromptTokenCount
	}: {
		chunksStream: Stream<ChatCompletionChunk> | Stream<Anthropic.Messages.MessageStreamEvent>
		modelOwner: string
		setResponse: React.Dispatch<React.SetStateAction<string>>
		setResponseTokenCount: React.Dispatch<React.SetStateAction<number>>
		setPromptTokenCount: React.Dispatch<React.SetStateAction<number>>
	}) {
		if (modelOwner === MODEL_OWNERS.ANTHROPIC) {
			const countPromptTokens = countToken({ text: `${commandPrompt}` })
			setPromptTokenCount(countPromptTokens)

			let _response = ''
			for await (const chunk of chunksStream) {
				const _chunk = chunk as ChatCompletionChunk
				const chunkContent = _chunk.choices[0].delta.content as string
				if (chunkContent) {
					_response += chunkContent
				}
				setResponse(_response)
				setResponseTokenCount(countToken({ text: _response }))
			}

			const countResponseTokens = countToken({ text: _response })

			return { countPromptTokens, countResponseTokens }
		}

		const countPromptTokens = countToken({ text: `${commandPrompt}` })
		setPromptTokenCount(countPromptTokens)

		let _response = ''
		for await (const chunk of chunksStream) {
			const _chunk = chunk as ChatCompletionChunk
			const chunkContent = _chunk.choices[0].delta.content as string
			if (chunkContent) {
				_response += chunkContent
			}
			setResponse(_response)
			setResponseTokenCount(countToken({ text: _response }))
		}

		const countResponseTokens = countToken({ text: _response })

		return { countPromptTokens, countResponseTokens }
	}
}
