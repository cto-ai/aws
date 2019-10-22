import { Config } from '../types/aws'
import { sdk } from '@cto.ai/sdk'
import { getConfig } from '@cto.ai/sdk/dist/sdk'

const CONFIG_KEY = 'config'

export const writeConfig = async (newConfigObj: Partial<Config>) => {
  const oldConfigObj = await sdk.getConfig(CONFIG_KEY)
  const mergedConfigObj = {
    ...oldConfigObj,
    ...newConfigObj,
  }

  if (!mergedConfigObj.AWS) mergedConfigObj.AWS = {}

  await sdk.setConfig(CONFIG_KEY, mergedConfigObj)
  return mergedConfigObj
}

export const readConfig = async () => {
  return getConfig(CONFIG_KEY)
}
