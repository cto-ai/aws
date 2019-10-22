import { filterForOptHeaders, filterForType } from './regex'

// Goes through options string and parses and returns the info and type of the command
export const setOptObj = (optStr: string) => {
  const optObj = {} // { <option_name>: { <option_content>: '...', <option_type>: 'string' }}
  const optHeaders = getOptHeaders(optStr)
  const filteredType = filterForType(optHeaders.join(' '))
  for (let i = 0; i < optHeaders.length; i++) {
    const startIdx = optStr.indexOf(optHeaders[i]) + optHeaders[i].length
    const endIdx = optHeaders[i + 1] && optStr.indexOf(optHeaders[i + 1])
    const content = endIdx
      ? optStr.substring(startIdx, endIdx)
      : optStr.substring(startIdx)
    optObj[optHeaders[i]] = {
      // get rid of extra whitespace and formatting spaces
      helpInfo: content
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/-\s/g, ''),
      // remove brackets around string
      type: filteredType[i].replace(/\(|\)/g, ''),
    }
  }
  return optObj
}

const getOptHeaders = (optStr: string): string[] => {
  const arr = filterForOptHeaders(optStr)
  if (arr) {
    const headers = arr.map(current => current.replace('\n', ''))
    return headers
  } else {
    return []
  }
}
