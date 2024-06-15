import { BedrockRuntimeClient, ConverseStreamCommand } from '@aws-sdk/client-bedrock-runtime'

export class BedrockClient {
	bedrockRuntimeClient: BedrockRuntimeClient
	constructor({
		region = 'us-east-1',
		accessKeyId,
		secretAccessKey
	}: {
		region?: string
		accessKeyId: string
		secretAccessKey: string
	}) {
		this.bedrockRuntimeClient = new BedrockRuntimeClient({
			region,
			credentials: { secretAccessKey, accessKeyId }
		})
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
		const command = new ConverseStreamCommand({
			modelId: modelCode,
			messages: [
				{
					role: 'user',
					content: [{ text: `${systemPrompt} this is the selected text: ${selectedText}` }]
				}
			],
			inferenceConfig: { maxTokens: 512, temperature, topP: 0.9 }
		})
		return this.bedrockRuntimeClient.send(command)
	}
}
