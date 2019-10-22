import { sdk } from '@cto.ai/sdk'
import { execMan } from '../utils/manParse'
import { manObj } from '../types/aws'
import { checkForCommands } from '../utils/helpers'
import { BACK_COMMAND } from '../constants/aws'
import { outputAWS } from '../output'
import { track } from '../utils/track'

// recursive solution for aws cli loop
export const awsPromptLoop = async (
  service: string,
  command: string,
  history: string[]
) => {
  return execMan(`aws ${service}${command} help`).then(
    async (result: manObj) => {
      const metadata = {
        awsHelp: `aws ${service}${command} help`,
        isDone: false
      }
      track(metadata)

      const output = checkForCommands(result)
      await sdk.setState('command', command)
      // Check if user wants to return to previous selection before exiting
      const newCommand = await outputAWS(result, command, service)
      if (newCommand === BACK_COMMAND) {
        return awsPromptLoop(service, history.pop() || '', history)
      }
      // Recursive exit condition
      if (!output) {
        return newCommand
      }
      history.push(command)
      const nextCommand = `${command} ${newCommand.command}`
      return awsPromptLoop(service, nextCommand, history)
    }
  )
}
