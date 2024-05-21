import Anthropic from '@anthropic-ai/sdk'

export class AnthropicClient {
	anthropic: Anthropic
	constructor({ apiKey }: { apiKey: string }) {
		this.anthropic = new Anthropic({ apiKey })
	}

	createStream({
		selectedText,
		systemPrompt,
		model
	}: {
		selectedText: string
		systemPrompt: string
		model: string
	}) {
		const _prompt = `${systemPrompt}, this is the text: ${selectedText}`
		this.anthropic.messages.create({
			max_tokens: 1024,
			messages: [{ role: 'user', content: _prompt }],
			model,
			stream: true
		})
	}
}
