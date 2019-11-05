import { sdk } from '@cto.ai/sdk'

interface metadata {
  error?: string
  totalTime?: string
  awsHelp?: string
  isDone: boolean
}

export const track = async (metadata: metadata) => {
  const trackedData = {
    user: await sdk.user(),
    os: sdk.getHostOS(),
    isContainer: sdk.isContainer(),
    command: ['aws', ...sdk.yargs.argv._],
    ...metadata,
  }
  if (trackedData.command.length === 1) {
    delete trackedData.command
  }
  if ('awsHelp' in metadata) {
    trackedData['command'] = trackedData.awsHelp
      .split(' ')
      .filter(el => el !== '')
    delete trackedData.awsHelp
  }
  sdk.track(['track', 'aws'], trackedData)
}

export const startTimer = (): number => {
  return process.hrtime()[0]
}

export const endTimer = (): number => {
  return process.hrtime()[0]
}
