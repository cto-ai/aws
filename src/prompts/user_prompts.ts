import { Question, AutoCompleteQuestion } from '@cto.ai/inquirer'
import { ux } from '@cto.ai/sdk'
import { helpPromptAns } from '../types/prompts'
import * as fuzzy from 'fuzzy'
import { argvObj } from '../types/aws'
import { EDIT_CHOICES } from '../constants/aws'

const { multiBlue } = ux.colors

export const pressEnterToPrompt = (str: string): Question<helpPromptAns>[] => [
  {
    type: 'input',
    name: 'continue',
    message: `\nPress enter to ${str} →`,
    afterMessage: ' ',
    transformer: input => ' ',
  },
]

export const awsHeaderPrompt = (
  headers: string[]
): Question<helpPromptAns>[] => [
  {
    type: 'list',
    name: 'selectedHeader',
    message: '\nPlease select the information details you wish to review',
    afterMessage: '\nInformation has been selected',
    choices: headers,
  },
]

export const fuzzyListPrompt = (
  commandList: string[]
): AutoCompleteQuestion<helpPromptAns>[] => [
  {
    type: 'autocomplete',
    name: 'command',
    message: `\nSelect the following aws command ${ux.colors.reset.green('→')}`,
    source: (answers, input) => {
      input = input || ''
      return new Promise(resolve => {
        const fuzzyResult = fuzzy.filter(input, commandList)
        resolve(fuzzyResult.map(el => el.original))
      })
    },
    afterMessage: `${ux.colors.reset.green('✓')} Command selected!`,
  },
]

export const cmdArgvListPrompt = (
  argvList: argvObj[]
): Question<helpPromptAns>[] => {
  return [
    {
      type: 'checkbox',
      name: 'selectedOptions',
      message: `This command has these arguments. Please choose the one(s) you would like to set:\n`,
      choices: argvList,
      afterMessage: '\nYou have selected: ',
    },
  ]
}

export const argvsInputPrompt = (
  option: argvObj
): Question<helpPromptAns>[] => [
  {
    type: 'input',
    name: 'optValue',
    message: `Please enter the value you want to input for the argument ${option.name}`,
    afterMessage: 'You have entered: ',
    afterMessageAppend: ` ${ux.colors.primary('as the value for')} ${
      option.name
    }`,
  },
]

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
