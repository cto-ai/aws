import * as path from 'path'

export const OPS_DIR = '/ops'
export const TMP_DIR = '/tmp'
export const ROOT_DIR = '/root'

export const MANIFESTS_DIR = path.resolve(TMP_DIR, 'manifests')
export const CREDS_DIR = path.resolve(ROOT_DIR, 'creds')
export const AWS_DIR = path.resolve(process.env.HOME || '', '.aws')
