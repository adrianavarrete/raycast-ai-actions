import { keys } from 'lodash'
import { Action, ActionPanel, Form } from '@raycast/api'
import { useForm, FormValidation } from '@raycast/utils'
import { MODELS } from './shared/constants'

type FormValues = {
	prompt: string
	modelName: string
}

export default function Command() {
	const { itemProps } = useForm<FormValues>({
		onSubmit() {
			return
		},
		validation: {
			modelName: FormValidation.Required,
			prompt: FormValidation.Required
		}
	})

	const ActionView = (
		<ActionPanel>
			<Action.CreateQuicklink
				quicklink={{
					link: `raycast://extensions/adria_navarrete/ai-actions/custom_command?arguments=${encodeURIComponent(
						JSON.stringify({
							prompt: itemProps.prompt.value,
							modelName: itemProps.modelName.value
						})
					)}`
				}}
			/>
		</ActionPanel>
	)

	const availableModels = keys(MODELS)

	return (
		<Form actions={ActionView}>
			<Form.Dropdown title="Model" {...itemProps.modelName}>
				{availableModels.map(model => {
					return <Form.Dropdown.Item value={model} title={MODELS[model].NAME} key={model} />
				})}
			</Form.Dropdown>
			<Form.TextField
				title="Prompt"
				placeholder="Write the prompt using {selection} for the selected text"
				info="the key '{selection}' is required to refer to the selected text."
				{...itemProps.prompt}
			/>
		</Form>
	)
}
