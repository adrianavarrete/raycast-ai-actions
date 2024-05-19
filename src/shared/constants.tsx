export const MODEL_OWNERS = {
	OPEN_AI: 'OpenAI'
}
export const OPEN_AI_MODELS = { GPT_35_TURBO: 'gpt-3.5-turbo', GPT_4_OMNI: 'gpt-4o' }

export const OPEN_AI_TOKEN_PRICING = {
	[OPEN_AI_MODELS.GPT_35_TURBO]: {
		INPUT: 0.5, // 0.5$ per 1M tokens
		OUTPUT: 1.5 // 1.5$ per 1M tokens
	},
	[OPEN_AI_MODELS.GPT_4_OMNI]: {
		INPUT: 5, // 5$ per 1M tokens
		OUTPUT: 15 // 15$ per 1M tokens
	}
}
