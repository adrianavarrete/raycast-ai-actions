import { Toast, getPreferenceValues, showToast } from '@raycast/api'
import { MODEL_OWNERS, OPEN_AI_MODELS, OPEN_AI_TOKEN_PRICING } from './constants'
import { OpenAiClient } from './api/openai_client'
import { values, round } from 'lodash'

type Model = {
	modelOwner: string
	model: string
}

export function getModel(): Model {
	const { defaultModel } = getPreferenceValues()

	if (values(OPEN_AI_MODELS).some(model => model === defaultModel)) {
		return { modelOwner: MODEL_OWNERS.OPEN_AI, model: defaultModel }
	}
	return { modelOwner: '', model: '' }
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
export function isApiKeyConfigured({ modelOwner }: { modelOwner: string }) {
	const { openaiApiKey } = getPreferenceValues()

	switch (modelOwner) {
		case MODEL_OWNERS.OPEN_AI:
			return Boolean(openaiApiKey)
		default:
			return false
	}
}

export function getAiAPIClient() {
	const { openaiApiKey } = getPreferenceValues()
	return new OpenAiClient({ apiKey: openaiApiKey })
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
	const { defaultModel } = getPreferenceValues()
	if (values(OPEN_AI_MODELS).some(model => model === defaultModel)) {
		const promptPrice = (promptTokenCount * OPEN_AI_TOKEN_PRICING[defaultModel].INPUT) / 1000000
		const resultPrice = (responseTokenCount * OPEN_AI_TOKEN_PRICING[defaultModel].OUTPUT) / 1000000
		const totalPrice = promptPrice + resultPrice
		if (totalPrice < 1) {
			return `${round(totalPrice * 100, 4)} cents`
		}
		return `${totalPrice} $`
	}
	return ''
}
