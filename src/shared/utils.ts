import { Toast, getPreferenceValues, showToast } from '@raycast/api'
import { MODEL_OWNERS, OPEN_AI_MODELS } from './constants'

type Model = {
	modelOwner: string
	model: string
}

export function getModel(): Model {
	const { defaultModel } = getPreferenceValues()

	if (OPEN_AI_MODELS.some(model => model === defaultModel)) {
		return { modelOwner: MODEL_OWNERS.OPEN_AI, model: defaultModel }
	}
	return { modelOwner: '', model: '' }
}

export async function showToastApiKeyError({ modelOwner }: { modelOwner: string }) {
	await showToast(Toast.Style.Failure, `Error: Configure the API Key for ${modelOwner}`)
}

export async function showToastModelError() {
	await showToast(Toast.Style.Failure, `Error: Model has not been set`)
}

export function isApiKeyConfigured({ modelOwner }: { modelOwner: string }) {
	const { openAiApiKey } = getPreferenceValues()

	switch (modelOwner) {
		case MODEL_OWNERS.OPEN_AI:
			return Boolean(openAiApiKey)
		default:
			return false
	}
}
