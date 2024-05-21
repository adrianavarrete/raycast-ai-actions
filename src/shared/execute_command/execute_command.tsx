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

export default function ExecuteCommand({
	commandPrompt,
	aiApiClient,
	modelOwner,
	model
}: {
	commandPrompt: string
	aiApiClient: OpenAiClient
	modelOwner: string
	model: string
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
		const _commandPrompt = null

		if (!_commandPrompt) {
			const message = 'Unable to get the command prompt'
			showCustomToastError({ message })
			return message
		}

		const countPromptTokens = countToken({ text: `${commandPrompt} ${selectedText}` })
		setPromptTokenCount(countPromptTokens)
		setTotalCost(estimatePrice({ promptTokenCount: countPromptTokens, responseTokenCount: 0 }))

		setIsLoading(true)
		try {
			const chunksStream = await aiApiClient.createStream({
				selectedText: selectedText,
				systemPrompt: commandPrompt,
				model
			})
			let _response = ''
			let _totalCost = 0
			for await (const chunk of chunksStream) {
				const chunkContent = chunk.choices[0].delta.content as string
				if (chunkContent) {
					_response += chunkContent
				}
				setResponse(_response)
				const countResponseTokens = countToken({ text: _response })
				setResponseTokenCount(countResponseTokens)

				_totalCost = estimatePrice({
					promptTokenCount: countPromptTokens,
					responseTokenCount: countResponseTokens
				})

				setTotalCost(_totalCost)
			}
			handleMoneySpent(_totalCost)
		} catch (error) {
			showCustomToastError({ message: 'Connection with OpenAI cannot be established' })
		} finally {
			setIsLoading(false)
		}
	}, [handleGetSelectedText, commandPrompt, handleMoneySpent])

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
			dailyCost={dailyCost}
			monthlyCost={monthlyCost}
		/>
	)
}
