export const MODEL_OWNERS = {
	OPEN_AI: 'OpenAI',
	ANTHROPIC: 'Anthropic'
}

type ModelDetail = {
	NAME: string
	CODE: string
	OWNER: string
}

type Model = {
	[key: string]: ModelDetail
}

export const MODELS: Model = {
	GPT_35_TURBO: {
		NAME: 'GPT-3.5 Turbo',
		CODE: 'gpt-3.5-turbo',
		OWNER: MODEL_OWNERS.OPEN_AI
	},
	GPT_4_OMNI: {
		NAME: 'GPT-4o',
		CODE: 'gpt-4o',
		OWNER: MODEL_OWNERS.OPEN_AI
	},

	CLAUDE_3_HAIKU: {
		NAME: 'Claude 3 Haiku',
		CODE: 'claude-3-haiku-20240307',
		OWNER: MODEL_OWNERS.ANTHROPIC
	},
	CLAUDE_3_SONNET: {
		NAME: 'Claude 3 Sonnet',
		CODE: 'claude-3-sonnet-20240229',
		OWNER: MODEL_OWNERS.ANTHROPIC
	},
	CLAUDE_3_OPUS: {
		NAME: 'Claude 3 Opus',
		CODE: 'claude-3-opus-20240229',
		OWNER: MODEL_OWNERS.ANTHROPIC
	}
}

export const TOKEN_PRICING = {
	[MODELS.GPT_35_TURBO.CODE]: {
		INPUT: 0.5, // 0.5$ per 1M tokens
		OUTPUT: 1.5 // 1.5$ per 1M tokens
	},
	[MODELS.GPT_4_OMNI.CODE]: {
		INPUT: 5, // 5$ per 1M tokens
		OUTPUT: 15 // 15$ per 1M tokens
	}
}
