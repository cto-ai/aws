import 'mocha'
import { spawn, ChildProcess } from 'child_process'
import concat from 'concat-stream'

const sendInput = (inputs: string[], child: ChildProcess, timeout: number) => {
  if (!inputs.length) {
    return child.stdin.end()
  }
  const [firstInput, ...remainingInputs] = inputs
  setTimeout(() => {
    child.stdin.write(firstInput)
    sendInput(remainingInputs, child, timeout)
  }, timeout)
}

const createProcess = (processPath: string, args: string[]): ChildProcess => {
  args = [processPath].concat(args)
  return spawn('ts-node', args)
}

export const execute = (
  processPath: string,
  args: string[],
  input: string[]
) => {
  const childProcess = createProcess(processPath, args)
  childProcess.stdout.setEncoding('utf-8')
  sendInput(input, childProcess, 1200)

  return new Promise((resolve, reject) => {
    childProcess.stderr.once('data', err => {
      reject(err.toString())
    })
    childProcess.on('error', err => {
      reject(err)
    })
    childProcess.stdout.pipe(
      concat(result => {
        resolve(result.toString())
      })
    )
    childProcess.on('close', () => {})
  })
}
