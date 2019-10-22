import { sdk } from '@cto.ai/sdk'
import * as util from 'util'
import * as childProcess from 'child_process'
import { track } from '../utils/track'

const pExec = util.promisify(childProcess.exec)

export const execPowerMode = async (args: string[]) => {
  const command = args.join(' ')
  try {
    const { stdout, stderr } = await pExec(`aws ${command}`)
    sdk.log(stdout)
    process.exit(0)
  } catch (e) {
    const metadata = {
      error: e,
      isDone: false,
    }
    track(metadata)
    sdk.log(e.stderr)
    process.exit(0)
  }
}
