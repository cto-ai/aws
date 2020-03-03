import { ux, Question } from '@cto.ai/sdk'
import { helpPromptAns } from '../types/prompts'
import { argvObj } from '../types/aws'
import { EDIT_CHOICES } from '../constants/aws'

const { multiBlue } = ux.colors

export const pressEnterToPrompt = (str: string): Question => {
  return {
    type: 'confirm',
    name: 'continue',
    message: `\nPress enter to ${str} →`,
    default: true,
  }
}

export const awsHeaderPrompt = (headers: string[]): Question<helpPromptAns> => {
  return {
    type: 'list',
    name: 'selectedHeader',
    message: '\nPlease select the information details you wish to review',
    choices: headers,
  }
}

export const fuzzyListPrompt = (
  commandList: string[]
): Question<helpPromptAns> => {
  return {
    type: 'autocomplete',
    name: 'command',
    message: `\nSelect the following aws command ${ux.colors.reset.green('→')}`,
    choices: commandList,
  }
}

export const cmdArgvListPrompt = (
  argvList: string[]
): Question<helpPromptAns> => {
  return {
    type: 'checkbox',
    name: 'selectedOptions',
    message: `This command has these arguments. Please choose the one(s) you would like to set:\n`,
    choices: argvList,
  }
}

export const argvsInputPrompt = (option: argvObj): Question<helpPromptAns> => {
  return {
    type: 'input',
    name: 'optValue',
    message: `Please enter the value you want to input for the argument ${option.name}`,
  }
}

export const confirmCommandPrompt = (
  completeCmd: string
): Question<helpPromptAns>[] => [
  {
    type: 'input',
    name: 'cmdConfirmation',
    message: `Are you sure you want to execute the command: ${multiBlue(
      completeCmd
    )}?\nPlease type in 'yes' to confirm and execute command!\n`,
  },
]

export const editCommandPrompt = (
  cmdStr: string
): Question<helpPromptAns>[] => [
  {
    type: 'list',
    name: 'editCmd',
    message: `\nCommand ${multiBlue(
      cmdStr.trim()
    )} not executed!\nPlease select: `,
    choices: EDIT_CHOICES,
  },
]
