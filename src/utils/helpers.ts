import * as util from 'util'
import * as childProcess from 'child_process'
import { sdk, ux } from '@cto.ai/sdk'
import { filterForCommands } from './regex'
import { manObj, argvObj } from '../types/aws'
import {
  cmdArgvListPrompt,
  fuzzyListPrompt,
  argvsInputPrompt,
  editCommandPrompt,
  confirmCommandPrompt,
  awsHeaderPrompt,
  pressEnterToPrompt,
} from '../prompts/user_prompts'
import {
  COMMANDS_STR,
  RUN_STR,
  SERVICES_STR,
  EDIT_CHOICES,
  INFO_STR,
  BACK_COMMAND,
} from '../constants/aws'
import { parseAndHandleError } from '../errors'
import { generateArgvsObj } from './argvParse'
import { cmdObj } from '../types/aws'
import { awsPromptLoop } from '../prompts/aws_help'
import { outputAWS } from '../output'

const pExec = util.promisify(childProcess.exec)

export const keytoStartCase = (obj: manObj): Object => {
  const keys = Object.keys(obj)
  const newObj = {}
  keys.forEach(key => {
    const startCasedKey = toStartCase(key)
    newObj[startCasedKey] = obj[key]
  })
  return newObj
}

export const toStartCase = (str: string): string => {
  const retStr = str.toLowerCase()
  return retStr.charAt(0).toUpperCase() + retStr.slice(1)
}

export const formatHeaders = async (awsManPage: manObj, currentCmd: string) => {
  if (!checkForCommands(awsManPage)) {
    awsManPage[RUN_STR] = await sdk.getState('command')
  }
  const headerFilter = [RUN_STR, COMMANDS_STR, SERVICES_STR]
  const allHeaders = Object.keys(awsManPage)
  const info = allHeaders.filter(header => !headerFilter.includes(header))
  // Add Back heading for info displays
  info.push(BACK_COMMAND)
  const topLevelHeaders = allHeaders.filter(header =>
    headerFilter.includes(header)
  )
  // Does not present Back heading if at top level
  const display =
    currentCmd === ''
      ? [...topLevelHeaders, INFO_STR]
      : [...topLevelHeaders, INFO_STR, BACK_COMMAND]
  return { display, info }
}

export const checkForCommands = (awsManPage: manObj): string => {
  return awsManPage[COMMANDS_STR] || awsManPage[SERVICES_STR]
}

export const returnNewCommand = async (
  awsManPage: manObj,
  selectedHeader: string
) => {
  const cmdArr = filterForCommands(awsManPage[selectedHeader])
  return await ux.prompt(fuzzyListPrompt(cmdArr))
}

// gets user selected arguments in form of ANSI wrapped string[] from prompt and returns a string with their selected options and input value
export const getSelectedArgvs = async (argvs: argvObj[]): Promise<string> => {
  const { selectedOptions } = await ux.prompt(cmdArgvListPrompt(argvs))
  return await argvsInput(selectedOptions, argvs)
}

const argvsInput = async (
  selectedOptions: string[],
  argvs: argvObj[]
): Promise<string> => {
  let optionStr = '' // '--dry-run --name test --reboot'
  for (let i = 0; i < selectedOptions.length; i++) {
    const optInfo = argvs.find(argv => argv.name === selectedOptions[i])
    if (optInfo.input) {
      const { optValue } = await ux.prompt(argvsInputPrompt(optInfo))
      optionStr += `${optInfo.name} ${optValue} `
    } else {
      optionStr += `${optInfo.name} `
    }
  }
  return optionStr
}

// parses and generates arguments for a chosen command, returns the completed command and user confirmation to run cmd in an Obj
export const getAndConfirmCmdStr = async (
  awsManPage: manObj,
  service: string
): Promise<cmdObj> => {
  const argvs: argvObj[] = generateArgvsObj(awsManPage)
  const optStr = await getSelectedArgvs(argvs)
  const completeCmd = `aws ${service}${awsManPage[RUN_STR]} ${optStr}`
  const { cmdConfirmation } = await ux.prompt(confirmCommandPrompt(completeCmd))
  return { completeCmd, cmdConfirmation }
}

export const handleCmdExec = async (
  confirmation: string,
  cmdStr: string,
  awsManPage: manObj,
  service: string
): Promise<void> => {
  if (confirmation === 'yes') {
    const { stdout, stderr } = await pExec(`${cmdStr} | col -b`)
    if (stderr) {
      parseAndHandleError(stderr)
    }
    sdk.log(stdout)
  } else {
    handleUnexecutedCmd(cmdStr, awsManPage, service)
  }
}

const handleUnexecutedCmd = async (
  cmdStr: string,
  awsManPage: manObj,
  service: string
) => {
  const { editCmd } = await ux.prompt(editCommandPrompt(cmdStr))
  if (editCmd === EDIT_CHOICES[0]) {
    // Calls to get input for existing command, and calls parent function again
    const { cmdConfirmation, completeCmd } = await getAndConfirmCmdStr(
      awsManPage,
      service
    )
    await handleCmdExec(cmdConfirmation, completeCmd, awsManPage, service)
  } else if (editCmd === EDIT_CHOICES[1]) {
    await awsPromptLoop(service, '', [])
  } else if (editCmd === EDIT_CHOICES[2]) {
    sdk.log("Exiting op, thank you for using CTO.ai's AWS Op! 👋")
    process.exit(0)
  }
}

// Displays additional information about a specific command, i.e. description of the command
export const displayAdditionalInfo = async (
  awsManPage: manObj,
  infoHeaders: string[],
  currentCmd: string,
  service: string
) => {
  sdk.log(`\n${ux.colors.bold(`aws ${service}${currentCmd}`)}`)
  const { selectedHeader } = await ux.prompt(awsHeaderPrompt(infoHeaders))
  if (selectedHeader === BACK_COMMAND) {
    return outputAWS(awsManPage, currentCmd, service)
  } else {
    sdk.log(`\n${ux.colors.bold(`aws ${service}${currentCmd}`)}`)
    sdk.log(awsManPage[selectedHeader])
  }
  await ux.prompt(pressEnterToPrompt('return to previous menu'))
  return displayAdditionalInfo(awsManPage, infoHeaders, currentCmd, service)
}
