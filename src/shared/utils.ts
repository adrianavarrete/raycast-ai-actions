import { Toast, getPreferenceValues, showToast } from '@raycast/api'
import { MODEL_OWNERS, MODELS, TOKEN_PRICING } from './constants'
import { OpenAiClient } from './api/openai/openai_client'
import { round } from 'lodash'
import { AnthropicClient } from './api/anthropic/anthropic_client'

type Model = {
	modelOwner: string
	modelName: string
	modelCode: string
}

export function getModel(): Model {
	const { defaultModelName } = getPreferenceValues()

	return {
		modelOwner: MODELS[defaultModelName].OWNER,
		modelName: MODELS[defaultModelName].NAME,
		modelCode: MODELS[defaultModelName].CODE
	}
}

export async function showCustomToastError({ message }: { message: string }) {
	await showToast(Toast.Style.Failure, `Error: ${message}`)
}

export async function showToastApiKeyError({ modelOwner }: { modelOwner: string }) {
	await showToast(Toast.Style.Failure, `Error: Configure the API Key for ${modelOwner}`)
}

export async function showToastModelError() {
	await showToast(Toast.Style.Failure, `Error: Model has not been set`)
}

export async function showToastSelectedTextError() {
	await showToast(Toast.Style.Failure, `Error: Text has not been selected`)
}
export function isApiKeyConfigured() {
	const { openaiApiKey, anthropicApiKey } = getPreferenceValues()
	const { modelOwner } = getModel()

	switch (modelOwner) {
		case MODEL_OWNERS.OPEN_AI:
			return Boolean(openaiApiKey)
		case MODEL_OWNERS.ANTHROPIC:
			return Boolean(anthropicApiKey)
		default:
			return false
	}
}

export function getAiAPIClient() {
	const { modelOwner } = getModel()
	if (modelOwner === MODEL_OWNERS.OPEN_AI) {
		const { openaiApiKey } = getPreferenceValues()
		if (!openaiApiKey) showToastApiKeyError({ modelOwner: MODEL_OWNERS.OPEN_AI })

		return new OpenAiClient({ apiKey: openaiApiKey })
	}
	const { anthropicApiKey } = getPreferenceValues()
	if (!anthropicApiKey) showToastApiKeyError({ modelOwner: MODEL_OWNERS.ANTHROPIC })

	return new AnthropicClient({ apiKey: anthropicApiKey })
}

export function countToken({ text }: { text: string }) {
	const numberOfWords = text.split(' ').length
	// On average 1 token is 0,75 words https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
	const averageWordsTokens = 0.75
	return Math.round(numberOfWords / averageWordsTokens)
}

export function estimatePrice({
	promptTokenCount,
	responseTokenCount
}: {
	promptTokenCount: number
	responseTokenCount: number
}) {
	const { modelCode } = getModel()
	const promptPrice = (promptTokenCount * TOKEN_PRICING[modelCode].INPUT) / 1000000
	const resultPrice = (responseTokenCount * TOKEN_PRICING[modelCode].OUTPUT) / 1000000
	const totalPrice = promptPrice + resultPrice

	return totalPrice
}

export function parsePrice(number: number) {
	const ONE_DOLLAR = 1
	if (number < ONE_DOLLAR) {
		return `${round(number * 100, 4)} cents`
	}
	return `${round(number, 2)} $`
}
