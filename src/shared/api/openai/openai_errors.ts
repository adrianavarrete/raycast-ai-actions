import { OpenAIError } from 'openai/error'

export function isOpenAIError(error: unknown) {
	return error instanceof OpenAIError
}

export function openAIErrorMessage(apiError: unknown) {
	if (apiError instanceof OpenAIError) {
		return apiError.message
	}
	return `Connection with OpenAI cannot be established`
}
