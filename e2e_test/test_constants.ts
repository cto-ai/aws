const ENTER = '\x0D'
const SPACE = '\x20'
const DOWN = '\x1B\x5B\x42'
const UP = '\x1B\x5B\x41'
const CMD_EC2 = ['\x45', '\x43', '\x32']
const CMD_INGRESS = ['\x49', '\x4E', '\x47', '\x52', '\x45', '\x53', '\x53']
const CMD_YES = ['\x79', '\x65', '\x73']

const ec2AuthorizeSecurityGroupIngressErrorFlow = [
  [ENTER],
  [DOWN, DOWN, DOWN, ENTER],
  [...CMD_EC2, ENTER],
  [DOWN, ENTER],
  [...CMD_INGRESS, ENTER],
  [UP, UP, ENTER],
  [UP, SPACE, ENTER],
  [...CMD_YES, ENTER],
]

const s3lsSuccessFlow = []

export default Object.freeze({
  ec2AuthorizeSecurityGroupIngressErrorFlow,
  s3lsSuccessFlow,
})
