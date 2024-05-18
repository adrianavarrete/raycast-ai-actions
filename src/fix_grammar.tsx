import CommandResponseLayoutComponent from './shared/command_response_layout'
import { getPreferenceValues } from '@raycast/api'

const { prompt_fix_grammar } = getPreferenceValues()

export default function FixGrammarCommand() {
	return CommandResponseLayoutComponent({ response: prompt_fix_grammar })
}
