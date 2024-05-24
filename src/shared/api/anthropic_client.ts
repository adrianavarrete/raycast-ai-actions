import Anthropic from '@anthropic-ai/sdk'

export class AnthropicClient {
	anthropic: Anthropic
	constructor({ apiKey }: { apiKey: string }) {
		this.anthropic = new Anthropic({ apiKey })
	}

	createStream({
		selectedText,
		systemPrompt,
		modelCode
	}: {
		selectedText: string
		systemPrompt: string
		modelCode: string
	}) {
		const _prompt = `${systemPrompt}, this is the text: ${selectedText}`
		return this.anthropic.messages.create({
			max_tokens: 1024,
			messages: [{ role: 'user', content: _prompt }],
			model: modelCode,
			stream: true
		})
	}
}
