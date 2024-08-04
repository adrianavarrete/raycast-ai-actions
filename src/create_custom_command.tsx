import { Action, ActionPanel, Form } from '@raycast/api'
import { useForm, FormValidation } from '@raycast/utils'

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
					link: `raycast://extensions/adria_navarrete/ai-actions/custom-command?arguments=${encodeURIComponent(
						JSON.stringify({
							prompt: itemProps.prompt.value,
							modelName: itemProps.modelName.value
						})
					)}`
				}}
			/>
		</ActionPanel>
	)

	return (
		<Form actions={ActionView}>
			<Form.TextField title="Model" placeholder="select model" {...itemProps.modelName} />
			<Form.TextField title="Prompt" placeholder="Enter last name" {...itemProps.prompt} />
		</Form>
	)
}
