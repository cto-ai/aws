export const COMMANDS_STR = 'Available commands'
export const RUN_STR = 'Run'
export const SERVICES_STR = 'Available services'
export const SYNOPSIS_STR = 'Synopsis'
export const BACK_COMMAND = 'Back'
export const EXIT_STR = 'Exit'
export const EDIT_CHOICES = [
  'Edit command',
  'Choose a different command',
  EXIT_STR,
]
export const OPTION_STR = 'Options'
export const INFO_STR = 'More info'

const regionCodes = {
  'us-east-1': 'US East (N. Virginia)',
  'us-east-2': 'US East (Ohio)',
  'us-west-1': 'US West (N. California)',
  'us-west-2': 'US West (Oregon)',
  'ca-central-1': 'Canada (Central)',
}

const TOTAL_LENGTH = 18

export const AWS_REGIONS = Object.entries(regionCodes).map(
  ([code, longName]: [string, string]) => {
    const nSpaces = Array.from({ length: TOTAL_LENGTH - code.length }).join(' ')
    return {
      name: `${code}${nSpaces}${longName}`,
      value: code,
      short: code,
    }
  }
)
