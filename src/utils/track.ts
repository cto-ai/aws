import { sdk } from '@cto.ai/sdk'

/*
 - user info
 - command 
 - error messages
 - time spent in ops
 - did user finish ops?
*/

interface metadata {
  error?: string
  totalTime?: string
  isDone: boolean
}

export const track = async (metadata: metadata) => {
  sdk.track(['track', 'aws'], {
    user: await sdk.user(),
    os: sdk.getHostOS(),
    isContainer: sdk.isContainer(),
    command: ['aws', ...sdk.yargs.argv._],
    ...metadata,
  })
}

export const startTimer = (): number => {
  return process.hrtime()[0]
}

export const endTimer = (): number => {
  return process.hrtime()[0]
}
