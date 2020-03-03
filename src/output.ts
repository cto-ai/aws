import { sdk, ux } from '@cto.ai/sdk'
import { manObj } from './types/aws'
import {
  COMMANDS_STR,
  SERVICES_STR,
  BACK_COMMAND,
  RUN_STR,
  INFO_STR,
} from './constants/aws'
import { awsHeaderPrompt } from './prompts/user_prompts'
import {
  formatHeaders,
  returnNewCommand,
  handleCmdExec,
  toStartCase,
  getAndConfirmCmdStr,
  displayAdditionalInfo,
} from './utils/helpers'
import { parseAndHandleError } from './errors'

// Outputs the information available to be selected
// At endpoint asks if user wants to select other information or exit the program
export const outputAWS = async (
  awsManPage: manObj,
  currentCmd: string,
  service: string
) => {
  sdk.log(`\n${ux.colors.bold(`aws ${service}${currentCmd}`)}`)
  try {
    const { display, info } = await formatHeaders(awsManPage, currentCmd)
    const startCaseHeaders = display.map(el => toStartCase(el))
    const { selectedHeader } = await ux.prompt(
      awsHeaderPrompt(startCaseHeaders)
    )
    switch (selectedHeader) {
      case BACK_COMMAND:
        return BACK_COMMAND
      case COMMANDS_STR:
      case SERVICES_STR:
        sdk.log(`\n${ux.colors.bold(`aws ${service}${currentCmd}`)}`)
        return await returnNewCommand(awsManPage, selectedHeader)
      case RUN_STR:
        sdk.log(`\n${ux.colors.bold(`aws ${service}${currentCmd}`)}`)
        const { cmdConfirmation, completeCmd } = await getAndConfirmCmdStr(
          awsManPage,
          service
        )
        return await handleCmdExec(
          cmdConfirmation,
          completeCmd,
          awsManPage,
          service
        )
      case INFO_STR:
        return await displayAdditionalInfo(
          awsManPage,
          info,
          currentCmd,
          service
        )
      default:
        break
    }
  } catch (err) {
    parseAndHandleError(JSON.stringify(err, null, 2))
  }
}
