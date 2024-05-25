import { APIConnectionError } from '@anthropic-ai/sdk'
import { AnthropicError, APIError } from '@anthropic-ai/sdk/error'
type Error = {
	type: string
	message: string
}

type AnthropicErrorObject = {
	type: 'error'
	error: Error
}

export function isAnthropicError(error: unknown) {
	return error instanceof AnthropicError
}

export function anthropicErrorMessage(apiError: unknown) {
	if (apiError instanceof APIConnectionError) {
		return apiError.message
	}
	if (apiError && apiError instanceof APIError) {
		console.log(apiError)
		const _apiError = apiError?.error as AnthropicErrorObject
		return `${apiError.status} ${_apiError?.error.message}`
	}
	return `Connection with Anthropic cannot be established`
}
