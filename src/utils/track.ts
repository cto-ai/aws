import yargs from 'yargs'
import { sdk } from '@cto.ai/sdk'

interface metadata {
  error?: string
  totalTime?: string
  awsHelp?: string
  isDone: boolean
}

export const track = async (metadata: metadata) => {
  const trackedData = {
    os: sdk.getHostOS(),
    command: ['aws', ...yargs.argv._],
    ...metadata,
  }
  if (trackedData.command.length === 1) {
    delete trackedData.command
  }
  if ('awsHelp' in metadata) {
    trackedData['command'] = trackedData.awsHelp
      .split(' ')
      .filter(el => el !== '')
    trackedData['powerUserArgs'] = ['aws', ...yargs.argv._]
    delete trackedData.awsHelp
  }
  sdk.track(['track', 'aws'], trackedData)
}

let startTime
let endTime

export const startTimer = (): number => {
  startTime = process.hrtime()[0]
  return startTime
}

export const endTimer = (): number => {
  endTime = process.hrtime()[0]
  return endTime
}

export const getTotalTime = (): number => {
  endTimer()
  return endTime - startTime
}
