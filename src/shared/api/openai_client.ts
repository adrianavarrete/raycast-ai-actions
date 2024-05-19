import { OpenAI } from 'openai'

export class OpenAiClient {
	openai: OpenAI
	constructor({ apiKey }: { apiKey: string }) {
		this.openai = new OpenAI({ apiKey })
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
		return this.openai.chat.completions.create({
			model,
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: selectedText }
			],
			stream: true
		})
	}
}
