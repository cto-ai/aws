export interface manObj {
  DESCRIPTION?: string
  SYNOPSIS?: string
  OPTIONS?: string
  EXAMPLES?: string
  OUTPUT?: string
  'AVAILABLE COMMANDS'?: string
  'AVAILABLE SERVICES'?: string
}

export interface argvObj {
  name?: string
  input?: boolean
  valueType?: string
  displayName?: string
  type?: string
  helpInfo?: string
  mandatory?: boolean
  checked?: boolean
}

export interface filteredArgvObj {
  mandArgvs?: RegExpMatchArray | null
  optArgvs?: RegExpMatchArray | null
  optFlags?: RegExpMatchArray | null
}

export type cmdObj = {
  completeCmd: string
  cmdConfirmation: string
}

export type argvDisplayObj = {
  name: string
  disabled: boolean
}

export type AWSConfig = {
  accessKeyId: string
  accessKeySecret: string
  region: string
}
