import { sdk, ux } from '@cto.ai/sdk'
import { asyncPipe } from './utils/asyncPipe'
import { pressEnterToPrompt } from './prompts/user_prompts'
import { awsPromptLoop } from './prompts/aws_help'
import { awsSetup } from './utils/awsCreds'
import { execPowerMode } from './utils/powerUser'
import { argv } from './types/argvs'
import { track, startTimer, getTotalTime } from './utils/track'

const logo = `█▀▀ ▀▀█▀▀ █▀▀█   █▀▀█ ░▀░   █▀▀█ █░░░█ █▀▀   █▀▀█ █▀▀█
█░░ ░░█░░ █░░█   █▄▄█ ▀█▀   █▄▄█ █▄█▄█ ▀▀█   █░░█ █░░█
▀▀▀ ░░▀░░ ▀▀▀▀   ▀░░▀ ▀▀▀   ▀░░▀ ░▀░▀░ ▀▀▀   ▀▀▀▀ █▀▀▀`

const showPrerunMessage = async () => {
  const res = await sdk.user().catch(err => console.log(err))
  const person = res && res.me ? `, ${res.me.username}` : ' there'

  const greetingLines = [
    `\n🚀  ${ux.colors.bgRed('CTO.ai AWS OP')} 🚀\n`,
    `\nHi${person}! Welcome back and thanks for using the tool, if have any questions be sure to reach out to the CTO.ai team, we're always happy to help!`,
    `⚠️  This Op requires some setup. Here's what you'll need:`,
    `\n✅ AWS Access Key ID`,
    `✅ AWS Secret Access Key`,
    `✅ ssh public and private key pair saved in ~/creds/ directory`,
    `\nFor more info please view the README.`,
  ]

  sdk.log(logo)
  sdk.log(greetingLines.join(`\n`))
  await ux.prompt(pressEnterToPrompt('continue'))
}

const parseArguments = () => {
  const args: argv = sdk.yargs.argv
  if (args && args._.length > 1) {
    sdk.log(`🛑 Unacceptable arguments
  example:
  ops run aws [service]`)
    process.exit(0)
  }
  if (args._.length === 0 && args.s) {
    sdk.log(`🛑 You must provide a service argument if using -s/--s flag
    example:
    ops run aws [service] -s`)
  }
  return args
}

const checkPowerMode = async () => {
  const args = sdk.yargs.argv
  if (args.p || args.powermode) {
    const metadata = {
      isDone: true,
    }
    track(metadata)
    const argv = process.argv.slice(2).filter(e => e !== '-p')
    await execPowerMode(argv)
  }
}

const startPrompt = (args: argv) => {
  // checks to see if service flag is set. Passes argument as service if it is set, if not passes as command
  const service = args._[0] ? args._[0] : ''
  return args.s
    ? awsPromptLoop(service, '', [])
    : awsPromptLoop('', service, [])
}

const main = async () => {
  const startTime = startTimer()
  const createPipeline = await asyncPipe(
    awsSetup,
    checkPowerMode,
    showPrerunMessage,
    parseArguments,
    startPrompt
  )
  try {
    await createPipeline({})
  } catch (err) {
    const totalTime = getTotalTime()
    const metadata = {
      totalTime: `${totalTime} seconds`,
      error: err,
      isDone: false,
    }
    track(metadata)
    console.error(err)
  }
}

main()
