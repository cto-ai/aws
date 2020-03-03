import util from 'util'
import childProcess from 'child_process'
import { manObj } from '../types/aws'
import { HEADER_REGEX } from '../utils/regex'
import { parseAndHandleError } from '../errors'
import { keytoStartCase } from '../utils/helpers'

const pExec = util.promisify(childProcess.exec)

export const setManObj = (manStr: string, headers: string[]): manObj => {
  const manObj: manObj = {}
  const processedManStr = manStr.substring(
    manStr.indexOf('\n') + 1,
    manStr.lastIndexOf('\n') - 1
  )
  for (let i = 0; i < headers.length; i++) {
    const startIdx = processedManStr.indexOf(headers[i])
    const endIdx = headers[i + 1] && processedManStr.indexOf(headers[i + 1])
    const content = endIdx
      ? processedManStr.substring(startIdx, endIdx)
      : processedManStr.substring(startIdx)
    manObj[headers[i]] = content
  }
  return manObj
}

const getHeaders = (man: string): string[] => {
  try {
    const arr = man.match(HEADER_REGEX)
    const headers = arr.map(current => current.replace('\n', ''))
    const filteredHeaders = headers.filter(header => header !== 'NAME')
    return filteredHeaders
  } catch (err) {
    if (err.name === 'TypeError') {
      process.exit(0)
    }
  }
}

export const execMan = async (command: string) => {
  const { stdout, stderr } = await pExec(`${command} | col -b`)

  if (stderr) {
    parseAndHandleError(stderr)
  }
  const headers = getHeaders(stdout)
  const manObj = setManObj(stdout, headers)
  const startCasedManObj = keytoStartCase(manObj)
  const notAllowedHeaders = ['Name', 'See also']
  // filters object to notAllowed headers
  const filteredManObj = Object.keys(startCasedManObj)
    .filter(key => !notAllowedHeaders.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: startCasedManObj[key],
      }
    }, {})
  return filteredManObj
}
