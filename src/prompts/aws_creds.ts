import { ux } from '@cto.ai/sdk'
import { AWS_REGIONS } from '../constants/aws'
import { Question } from '@cto.ai/sdk'
import { AWSConfig } from '../types/aws'

export type reSignInAnswers = {
  useSavedConfig: boolean
}

export const reSignInQuestion: Question<reSignInAnswers>[] = [
  {
    type: 'confirm',
    name: 'useSavedConfig',
    message:
      '🖥  Do you want to use the AWS credentials saved in your local config?',
  },
]

export const awsQuestions: Question<AWSConfig>[] = [
  {
    type: 'input',
    name: 'accessKeyId',
    message: `\nPlease enter your AWS Access Key ID ${ux.colors.reset.green(
      '→'
    )}\n${ux.colors.secondary(
      'Access this via the AWS Management Console > Security Credentials > Access Keys'
    )}\n\n${ux.colors.white('🔑 Access Key ID:')}`,
  },
  {
    type: 'password',
    name: 'accessKeySecret',
    message: `\nPlease enter your AWS Access Key Secret ${ux.colors.reset.green(
      '→'
    )}\n\n🤫  ${ux.colors.white('Access Key Secret:')}`,
  },
  {
    type: 'list',
    name: 'region',
    message: `\nSelect AWS default region ${ux.colors.reset.green('→')}`,
    choices: AWS_REGIONS,
  },
]
