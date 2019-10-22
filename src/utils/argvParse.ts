import { filterForArgvs, filterForArgv } from './regex'
import { argvObj, manObj } from '../types/aws'
import { SYNOPSIS_STR, OPTION_STR } from '../constants/aws'
import { setOptObj } from './optionParse'
import * as inquirer from '@cto.ai/inquirer'

// refactor to have less repeating funct calls
export const generateArgvsObj = (awsManPage: manObj): argvObj[] => {
  const allArgvs: argvObj | any[] = [] // [{ name: --dry-run, value: false, required: false, value_type: null }]
  const optObj = setOptObj(awsManPage[OPTION_STR])
  const { mandArgvs, optArgvs, optFlags } = filterForArgvs(
    awsManPage[SYNOPSIS_STR]
  )
  if (mandArgvs) {
    allArgvs.push(new inquirer.Separator('Mandatory Fields'))
    pushFilteredObj(mandArgvs, allArgvs, optObj, true, true)
  }
  if (optArgvs) {
    allArgvs.push(new inquirer.Separator('Optional Fields'))
    pushFilteredObj(optArgvs, allArgvs, optObj, true, false)
  }
  if (optFlags) {
    const filteredOptFlags = filterForArgv(optFlags.join(' '))
    pushFilteredObj(filteredOptFlags, allArgvs, optObj, false, false)
  }
  return allArgvs
}

const pushFilteredObj = (
  filteredArr: string[],
  targetArr: argvObj[],
  optObj,
  value: boolean,
  mandatory: boolean
) => {
  // Combines type and help info from options parsing to available argvs
  filteredArr.forEach(argv => {
    for (let optionEntry in optObj) {
      const filteredOpt = filterForArgv(optionEntry)
      if (filteredOpt[0] === argv) {
        const argvObj: argvObj = {
          name: argv,
          input: value,
          type: optObj[optionEntry].type,
          helpInfo: optObj[optionEntry].helpInfo,
          mandatory,
          checked: mandatory,
        }
        targetArr.push(argvObj)
      }
    }
  })
}
