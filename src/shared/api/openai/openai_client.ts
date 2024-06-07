import { OpenAI } from 'openai'

export class OpenAiClient {
	openai: OpenAI
	constructor({ apiKey }: { apiKey: string }) {
		this.openai = new OpenAI({ apiKey })
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
		return this.openai.chat.completions.create({
			model: modelCode,
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: selectedText }
			],
			stream: true,
			temperature: temperature * 2,
			stream_options: { include_usage: true }
		})
	}
}
