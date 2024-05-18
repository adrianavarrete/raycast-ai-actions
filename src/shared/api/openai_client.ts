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

	countToken({ text }: { text: string }) {
		const numberOfWords = text.split(' ').length
		// On average 1 token is 0,75 words https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
		const averageWordsTokens = 0.75
		return Math.round(numberOfWords / averageWordsTokens)
	}
}
