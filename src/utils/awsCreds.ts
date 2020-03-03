import { sdk, ux } from '@cto.ai/sdk'
import { AWSConfig } from '../types/aws'
import { AWS_REGIONS } from '../constants/aws'
import { writeToFileSync } from './writeToFileSync'
import { AWS_DIR } from '../constants/dirPath'

const getFlags = (): string[] => process.argv.filter(arg => arg.startsWith('-'))

export const writeCredentials = async (
  accessKeyId: string,
  accessKeySecret: string,
  awsDir: string
) => {
  const awsCredentials = `[default]\naws_access_key_id = ${accessKeyId}\naws_secret_access_key = ${accessKeySecret}\n`
  writeToFileSync({
    dirPath: awsDir,
    fileName: 'credentials',
    data: awsCredentials,
  })
}

export const writeRegion = async (region: string, awsDir: string) => {
  const awsConfigs = `[default]\nregion = ${region}\n`
  writeToFileSync({
    dirPath: awsDir,
    fileName: 'config',
    data: awsConfigs,
  })
}

/**
 * Takes in a Config object and the desired directory to write the
 * credentials and config file to
 */
export const configureAws = async (AWSConfig: AWSConfig, awsDir: string) => {
  const { accessKeyId, accessKeySecret, region } = AWSConfig

  await writeRegion(region, awsDir)
  await writeCredentials(accessKeyId, accessKeySecret, awsDir)
}

export const awsSetup = async () => {
  const { AWS_ACCESS_KEY_ID } = await sdk.getSecret('AWS_ACCESS_KEY_ID')
  const { AWS_ACCESS_KEY_SECRET } = await sdk.getSecret('AWS_ACCESS_KEY_SECRET')
  const { AWS_REGION } = await ux.prompt({
    type: 'list',
    name: 'AWS_REGION',
    message: `\nSelect AWS default region ${ux.colors.reset.green('→')}`,
    choices: AWS_REGIONS,
  })

  const flags = getFlags()
  const hasSignInFlag = flags.includes('-s') || flags.includes('--signin')

  if (
    !hasSignInFlag &&
    AWS_ACCESS_KEY_ID &&
    AWS_ACCESS_KEY_SECRET &&
    AWS_REGION
  ) {
    const configs = {
      accessKeyId: AWS_ACCESS_KEY_ID,
      accessKeySecret: AWS_ACCESS_KEY_SECRET,
      region: AWS_REGION,
    }
    await configureAws(configs, AWS_DIR)
    return configs
  } else {
    awsSetup()
  }
}
