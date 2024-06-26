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
	CLAUDE_35_SONNET: {
		NAME: 'Claude 3.5 Sonnet',
		CODE: 'claude-3-5-sonnet-20240620',
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
	},
	[MODELS.CLAUDE_3_HAIKU.CODE]: {
		INPUT: 0.25, // 0.25$ per 1M tokens
		OUTPUT: 1.25 // 1.25$ per 1M tokens
	},
	[MODELS.CLAUDE_35_SONNET.CODE]: {
		INPUT: 3, // 3$ per 1M tokens
		OUTPUT: 15 // 15$ per 1M tokens
	},
	[MODELS.CLAUDE_3_OPUS.CODE]: {
		INPUT: 15, // 15$ per 1M tokens
		OUTPUT: 75 // 75$ per 1M tokens
	}
}
