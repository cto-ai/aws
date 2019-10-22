import { filteredArgvObj } from '../types/aws'

// parse man page and return array<header>
export const HEADER_REGEX = /(?<=\n)[A-Z]+\s([A-Z]?)+/g

// Output from command : `aws ec2 <command> help`

// Output from Match Function:
// [ 'NAME', 'DESCRIPTION', 'SYNOPSIS', 'OPTIONS', 'OUTPUT' ]

// Parses through available commands listed in awscli's man page, and matches the avaiable commands.
const COMMAND_REGEX = /(?<=o\s)([a-z]*\d*?)(-?[a-z]*\d?)*/gi

export const filterForCommands = (str: string): string[] => {
  const regexMatch = str.match(COMMAND_REGEX)
  return regexMatch.filter(str => str.length >= 1 && str !== 'help')
}

// Output from command : `aws s3 help`:
// Input into match function:

// "AVAILABLE COMMANDS
//        o cp
//        o ls
//        o mb
//        ... "

// Output from Match Function:
// [
//        cp
//        ls
//        mb
//        ... ]

// Parses for mandatory arguments of a command
const ARGVS_STR_REGEX = /(?<!\[)(?<!\|\s)(--\w*)(-?\w*)*/gi
// Parses for the optional arguments of a command
const OPTIONAL_ARGVS_REGEX = /(?<=\[)(--\w*)(-?\w*)*(?=\s\<)/gi
// Parses for the flags of a command
const OPTIONAL_FLAGS_REGEX = /(?<=\[)(--\w*)(-\w*)* \| (--\w*)(-\w*)*|(?<=\[)(--\w*)(-\w*)*(?=])/gi

export const filterForArgvs = (str: string): filteredArgvObj => {
  const mandArgvs = str.match(ARGVS_STR_REGEX)
  const optArgvs = str.match(OPTIONAL_ARGVS_REGEX)
  const optFlags = str.match(OPTIONAL_FLAGS_REGEX)
  return { mandArgvs, optArgvs, optFlags }
}

// Output from command: `aws ec2 create-image`:
// Input into match function along with argvType = 'mand':
//      "[--description <value>]
//       [--dry-run | --no-dry-run]
//       --instance-id <value>
//       ..."

// Output from Function:
// {
//    mandArgvs: [ --instance-id, --name, ... ]
//    optArgvs: [ --description, --tags, ... ]
//    optFlags: [ --dry-run, --no-dry-run, ... ]
// }

const ARGV_REGEX = /(--\w*)(-\w*)*/gi

export const filterForArgv = (str: string): string[] => {
  return str.match(ARGV_REGEX)
}

// Output from command: `aws ec2 create-image`:
// Input into match function:
//     "[--block-device-mappings <value>]
//      [--description <value>]
//      [--dry-run | --no-dry-run]
//      ..."

// Output from match Function:
// [
//      --block-device-mappings
//      --description
//      --dry-run
//      ... ]

// Parses for the option argument headings
const OPTIONS_HEADER_REGEX = /(--\w*)(-\w*)*\s\s?\(\w*\)|(--\w*)(-?\w*)?\s\|\s(--\w*)(-?\w*)*\s\(\w*\)/gi

export const filterForOptHeaders = (str: string): string[] => {
  return str.match(OPTIONS_HEADER_REGEX)
}

// Output from command: ` aws ec2 create-image `
// Input into match function:
//      "--block-device-mappings (list)
//      The  block  device mappings. This parameter cannot be used to //
//      modify the encryption status of existing volumes or snapshots. To
//      create an AMI with encrypted snapshots, use the CopyImage action.
//
//       --instance-id (string)
//      The ID of the instance.
//
//      --name (string)
//      A name for the new image."

// Output from match function
// [    --block-device-mappings (list),
//      --instance-id (string),
//      --name (string),
//      ...]

// Parses for the type of the argument
const TYPE_REGEX = /\(\w*\)/gi

export const filterForType = (str: string): string[] => {
  return str.match(TYPE_REGEX)
}

// Input into match function:
// [    --block-device-mappings (list),
//      --instance-id (string),
//      --name (string),
//      ...]

// Output from match function:
// [   list,
//     string,
//     string,
//     ...]
