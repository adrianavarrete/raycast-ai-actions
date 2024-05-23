import { OpenAI } from 'openai'

export class OpenAiClient {
	openai: OpenAI
	constructor({ apiKey }: { apiKey: string }) {
		this.openai = new OpenAI({ apiKey })
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
		return this.openai.chat.completions.create({
			model: modelCode,
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: selectedText }
			],
			stream: true
		})
	}
}
