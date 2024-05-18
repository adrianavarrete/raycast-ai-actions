import { Detail } from '@raycast/api'

export default function AiActionConfigurationComponent({ commandName }: { commandName: string }) {
	return <Detail markdown={commandName} />
}
