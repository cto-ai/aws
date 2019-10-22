import { sdk, ux} from '@cto.ai/sdk'
import { 
  InlineMarkupTagError,
  MissingParameterError,
  ARGV_EXPECT_ERR_REGEX,
  ARGV_REQ_ERR_REGEX,
  getAwsErrorParams,
} from './awsCli'

// use this for any potential stderr
export const parseAndHandleError = (err: string): void => {
  if (!err) return

  const errorMessage = err.toLowerCase()
  
  switch(true) { 
    case errorMessage.includes(InlineMarkupTagError.toLowerCase()): { 
      sdk.log(`⚠️  ${ux.colors.errorRed("looks like something is wrong with AWS CLI markup. Don't worry. It's not you.")}`)
      break; 
    }
    case ARGV_REQ_ERR_REGEX.test(errorMessage): {
      const filteredErrorMessage = errorMessage.match(ARGV_REQ_ERR_REGEX)
      const params = getAwsErrorParams(filteredErrorMessage.toString().trim())
      sdk.log(`😅  ${ux.colors.errorRed('Oops! Your argument flag is missing:')} ${params}`)
      break;
    }
    case ARGV_EXPECT_ERR_REGEX.test(errorMessage): {
      const filteredErrorMessage = errorMessage.match(ARGV_EXPECT_ERR_REGEX)
      const params = getAwsErrorParams(filteredErrorMessage.toString().trim())
      sdk.log(`😅  ${ux.colors.errorRed('Oops! Your argument value is missing:')} ${params}`)
      break;
    }
    case errorMessage.includes(MissingParameterError.toLowerCase()): {
      const filteredErrorMessasge = errorMessage.split(' ').slice(-3).join(' ')
      sdk.log(`😅  ${ux.colors.errorRed('Oops! You are missing parameter:')} ${filteredErrorMessasge}`)
      break; 
    }
    default: { 
      sdk.log(`🤔  ${ux.colors.errorRed(err)}`)
      break; 
    } 
  } 
}