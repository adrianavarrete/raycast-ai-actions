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
import { ChatCompletionChunk } from 'openai/resources'
import { Stream as OpenAiStream } from 'openai/streaming'
import { Stream as AnthropicAiStream } from '@anthropic-ai/sdk/streaming'
import { ConverseStreamCommandOutput } from '@aws-sdk/client-bedrock-runtime'

import { AnthropicClient } from '../api/anthropic/anthropic_client'
import { OpenAiClient } from '../api/openai/openai_client'
import { BedrockClient } from '../api/bedrock/bedrock_client'

import { MODEL_OWNERS } from '../constants'
import { MessageStreamEvent } from '@anthropic-ai/sdk/resources'
import { isOpenAIError, openAIErrorMessage } from '../api/openai/openai_errors'
import { anthropicErrorMessage, isAnthropicError } from '../api/anthropic/anthropic_errors'

export default function ExecuteCommand({
	commandPrompt,
	aiApiClient,
	modelOwner,
	modelCode,
	modelName
}: {
	commandPrompt: string
	aiApiClient: OpenAiClient | AnthropicClient | BedrockClient
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
		setIsLoading(true)
		try {
			if (modelOwner === MODEL_OWNERS.ANTHROPIC) {
				const _messageStream = await aiApiClient.createStream({
					selectedText: selectedText,
					systemPrompt: commandPrompt,
					modelCode
				})

				const { countPromptTokens, countResponseTokens } = await _parseAnthropicStream({
					messageStream: _messageStream as AnthropicAiStream<MessageStreamEvent>,
					setResponse,
					setPromptTokenCount,
					setResponseTokenCount
				})

				const totalStreamCost = estimatePrice({
					promptTokenCount: countPromptTokens,
					responseTokenCount: countResponseTokens,
					modelCode
				})

				setTotalCost(totalStreamCost)
				handleMoneySpent(totalStreamCost)
				return
			}
			if (modelOwner === MODEL_OWNERS.OPEN_AI) {
				const _messageStream = await aiApiClient.createStream({
					selectedText: selectedText,
					systemPrompt: commandPrompt,
					modelCode
				})
				const { countPromptTokens, countResponseTokens } = await _parseOpenAIStream({
					messageStream: _messageStream as OpenAiStream<ChatCompletionChunk>,
					setResponse,
					setPromptTokenCount,
					setResponseTokenCount
				})

				const totalStreamCost = estimatePrice({
					promptTokenCount: countPromptTokens,
					responseTokenCount: countResponseTokens,
					modelCode
				})

				setTotalCost(totalStreamCost)
				handleMoneySpent(totalStreamCost)
				return
			}
			if (modelOwner === MODEL_OWNERS.BEDROCK) {
				const _messageStream = await aiApiClient.createStream({
					selectedText: selectedText,
					systemPrompt: commandPrompt,
					modelCode
				})

				const { countPromptTokens, countResponseTokens } = await _parseBedrockStream({
					messageStream: _messageStream as ConverseStreamCommandOutput,
					setResponse,
					setPromptTokenCount,
					setResponseTokenCount
				})
			}
			throw new Error('modelOwner is not defined')
		} catch (error) {
			if (!modelCode || !modelOwner) {
				return showToastModelError()
			}
			if (!isApiKeyConfigured(modelOwner)) {
				return showToastApiKeyError({ modelOwner })
			}
			if (!commandPrompt) {
				return showCustomToastError({ message: 'Unable to get command prompt.' })
			}
			if (isOpenAIError(error)) {
				return showCustomToastError({ message: openAIErrorMessage(error) })
			}
			if (isAnthropicError(error)) {
				return showCustomToastError({ message: anthropicErrorMessage(error) })
			}
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

	async function _parseAnthropicStream({
		messageStream,
		setResponse,
		setResponseTokenCount,
		setPromptTokenCount
	}: {
		messageStream: AnthropicAiStream<MessageStreamEvent>
		setResponse: React.Dispatch<React.SetStateAction<string>>
		setResponseTokenCount: React.Dispatch<React.SetStateAction<number>>
		setPromptTokenCount: React.Dispatch<React.SetStateAction<number>>
	}) {
		let countPromptTokens = 0
		let countResponseTokens = 0

		let _response = ''

		for await (const messageStreamEvent of messageStream) {
			const _messageStreamEvent = messageStreamEvent as MessageStreamEvent
			const { type: messageType } = _messageStreamEvent

			if (messageType === 'message_start') {
				const inputTokens = _messageStreamEvent.message.usage.input_tokens
				setPromptTokenCount(inputTokens)
				countPromptTokens = inputTokens
			}
			if (messageType === 'content_block_delta') {
				const messageContent = _messageStreamEvent.delta.text
				if (messageContent) {
					_response += messageContent
				}

				setResponseTokenCount(countToken({ text: _response }))
			}

			setResponse(_response)

			if (messageType === 'message_delta') {
				{
					setResponseTokenCount(_messageStreamEvent.usage.output_tokens)
					countResponseTokens = _messageStreamEvent.usage.output_tokens
				}
			}
		}

		return { countPromptTokens, countResponseTokens }
	}

	async function _parseOpenAIStream({
		messageStream,
		setResponse,
		setResponseTokenCount,
		setPromptTokenCount
	}: {
		messageStream: OpenAiStream<ChatCompletionChunk>
		setResponse: React.Dispatch<React.SetStateAction<string>>
		setResponseTokenCount: React.Dispatch<React.SetStateAction<number>>
		setPromptTokenCount: React.Dispatch<React.SetStateAction<number>>
	}) {
		let countPromptTokens = countToken({ text: `${commandPrompt}` })
		let countResponseTokens = 0

		setPromptTokenCount(countPromptTokens)

		let _response = ''
		for await (const chunk of messageStream) {
			const _chunk = chunk as ChatCompletionChunk
			const chunkContent = _chunk.choices[0]?.delta.content as string
			if (chunkContent) {
				_response += chunkContent
			}
			setResponse(_response)

			if (_chunk.usage) {
				countPromptTokens = _chunk.usage.prompt_tokens
				countResponseTokens = _chunk.usage.completion_tokens

				setPromptTokenCount(countPromptTokens)
				setResponseTokenCount(countResponseTokens)
			} else {
				setResponseTokenCount(countToken({ text: _response }))
			}
		}

		return { countPromptTokens, countResponseTokens }
	}

	async function _parseBedrockStream({
		messageStream,
		setResponse,
		setResponseTokenCount,
		setPromptTokenCount
	}: {
		messageStream: ConverseStreamCommandOutput
		setResponse: React.Dispatch<React.SetStateAction<string>>
		setResponseTokenCount: React.Dispatch<React.SetStateAction<number>>
		setPromptTokenCount: React.Dispatch<React.SetStateAction<number>>
	}) {
		let _response = ''

		if (messageStream.stream) {
			for await (const item of messageStream.stream) {
				if (item.contentBlockDelta) {
					console.log(item)
					_response += item.contentBlockDelta.delta?.text
				}
			}
		}

		console.log(_response)

		return
	}
}
