// error: aws markup error 
export const InlineMarkupTagError = 'start-string without end-string'

// error: request must contain the parameter  
export const MissingParameterError = '(MissingParameter)'

// error: argument flag is missing
// 'error: argument <> is required'
export const ARGV_REQ_ERR_REGEX = /(?<=aws:)(\s\w*:)(\s\w*)*(--\w*)(-\w*)*(\s\w*)*/gi

// error: argument value is missing
// 'error: argument <> expected one'
export const ARGV_EXPECT_ERR_REGEX = /(?<=aws:)(\s\w*:)(\s\w*)*(--\w*)(-\w*(:))*(\s\w*)*/gi

// get parameter extracted from aws: error: statement
export const getAwsErrorParams = (err: string) => {
  const errArr = err.split(' ')
  const awsErrorHeader = 'error: argument'
  const awsError = errArr.slice(0,2).join(' ')
  if (awsError.toLowerCase() !== awsErrorHeader ) {
    console.log("\ngetAwsErrorParams accepting wrong format of error\n")
    return
  }
  return errArr[2]
}