export const MODEL_OWNERS = {
	OPEN_AI: 'OpenAI',
	ANTHROPIC: 'Anthropic',
	DEEPSEEK: 'DeepSeek'
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
	GPT_4_OMNI_MINI: {
		NAME: 'GPT-4o-mini',
		CODE: 'gpt-4o-mini',
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
	CLAUDE_35_HAIKU: {
		NAME: 'Claude 3.5 Haiku',
		CODE: 'claude-3-5-haiku-latest',
		OWNER: MODEL_OWNERS.ANTHROPIC
	},
	CLAUDE_35_SONNET: {
		NAME: 'Claude 3.5 Sonnet',
		CODE: 'claude-3-5-sonnet-latest',
		OWNER: MODEL_OWNERS.ANTHROPIC
	},
	CLAUDE_3_OPUS: {
		NAME: 'Claude 3 Opus',
		CODE: 'claude-3-opus-20240229',
		OWNER: MODEL_OWNERS.ANTHROPIC
	},
	DEEPSEEK_CHAT_V3: {
		NAME: 'DeepSeek chat v3',
		CODE: 'deepseek-chat',
		OWNER: MODEL_OWNERS.DEEPSEEK
	},
	DEEPSEEK_REASONER_V1: {
		NAME: 'DeepSeek R1',
		CODE: 'deepseek-reasoner',
		OWNER: MODEL_OWNERS.DEEPSEEK
	}
}

export const TOKEN_PRICING = {
	[MODELS.GPT_4_OMNI_MINI.CODE]: {
		INPUT: 0.15, // 0.15$ per 1M tokens
		OUTPUT: 0.6 // 0.6$ per 1M tokens
	},
	[MODELS.GPT_4_OMNI.CODE]: {
		INPUT: 5, // 5$ per 1M tokens
		OUTPUT: 15 // 15$ per 1M tokens
	},
	[MODELS.CLAUDE_3_HAIKU.CODE]: {
		INPUT: 0.25, // 0.25$ per 1M tokens
		OUTPUT: 1.25 // 1.25$ per 1M tokens
	},
	[MODELS.CLAUDE_35_HAIKU.CODE]: {
		INPUT: 1, // 1$ per 1M tokens
		OUTPUT: 5 // 5$ per 1M tokens
	},
	[MODELS.CLAUDE_35_SONNET.CODE]: {
		INPUT: 3, // 3$ per 1M tokens
		OUTPUT: 15 // 15$ per 1M tokens
	},
	[MODELS.CLAUDE_3_OPUS.CODE]: {
		INPUT: 15, // 15$ per 1M tokens
		OUTPUT: 75 // 75$ per 1M tokens
	},
	[MODELS.DEEPSEEK_CHAT_V3.CODE]: {
		INPUT: 0.27, // 0.27$ per 1M tokens
		OUTPUT: 1.1 // 1.10$ per 1M tokens
	},
	[MODELS.DEEPSEEK_REASONER_V1.CODE]: {
		INPUT: 0.55, // 0.55$ per 1M tokens
		OUTPUT: 2.19 // 2.19$ per 1M tokens
	}
}
