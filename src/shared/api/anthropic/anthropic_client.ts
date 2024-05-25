import Anthropic from '@anthropic-ai/sdk'

export class AnthropicClient {
	anthropic: Anthropic
	constructor({ apiKey }: { apiKey: string }) {
		this.anthropic = new Anthropic({ apiKey })
	}

	createStream({
		selectedText,
		systemPrompt,
		modelCode,
		temperature = 0.5
	}: {
		selectedText: string
		systemPrompt: string
		modelCode: string
		temperature?: number
	}) {
		return this.anthropic.messages.create({
			max_tokens: 800,
			system: systemPrompt,
			messages: [{ role: 'user', content: selectedText }],
			model: modelCode,
			stream: true,
			temperature
		})
	}
}
