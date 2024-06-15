import { Toast, getPreferenceValues, showToast } from '@raycast/api'
import { MODEL_OWNERS, MODELS, TOKEN_PRICING } from './constants'
import { OpenAiClient } from './api/openai/openai_client'
import { round } from 'lodash'
import { AnthropicClient } from './api/anthropic/anthropic_client'
import { BedrockClient } from './api/bedrock/bedrock_client'

type Model = {
	modelOwner: string
	modelName: string
	modelCode: string
}

export function getModel(commandCustomModelName: string): Model {
	if (commandCustomModelName) {
		return {
			modelOwner: MODELS[commandCustomModelName].OWNER,
			modelName: MODELS[commandCustomModelName].NAME,
			modelCode: MODELS[commandCustomModelName].CODE
		}
	}

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
export function isApiKeyConfigured(modelOwner: string) {
	const { openaiApiKey, anthropicApiKey, awsAccesKeyId, awsSecretAccessKey } = getPreferenceValues()

	switch (modelOwner) {
		case MODEL_OWNERS.OPEN_AI:
			return Boolean(openaiApiKey)
		case MODEL_OWNERS.ANTHROPIC:
			return Boolean(anthropicApiKey)
		case MODEL_OWNERS.BEDROCK:
			return Boolean(awsAccesKeyId) && Boolean(awsSecretAccessKey)
		default:
			return false
	}
}

export function getAiAPIClient(modelOwner: string) {
	if (modelOwner === MODEL_OWNERS.OPEN_AI) {
		const { openaiApiKey } = getPreferenceValues()
		if (!openaiApiKey) showToastApiKeyError({ modelOwner: MODEL_OWNERS.OPEN_AI })

		return new OpenAiClient({ apiKey: openaiApiKey })
	}
	if (modelOwner === MODEL_OWNERS.BEDROCK) {
		const { awsAccesKeyId, awsSecretAccessKey } = getPreferenceValues()
		if (!awsAccesKeyId || !awsSecretAccessKey) {
			showToastApiKeyError({ modelOwner: MODEL_OWNERS.BEDROCK })
		}

		return new BedrockClient({ accessKeyId: awsAccesKeyId, secretAccessKey: awsSecretAccessKey })
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
	responseTokenCount,
	modelCode
}: {
	promptTokenCount: number
	responseTokenCount: number
	modelCode: string
}) {
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
