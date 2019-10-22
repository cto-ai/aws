import * as fs from 'fs'
import * as path from 'path'

export const writeToFileSync = ({
  dirPath,
  fileName,
  data,
}: {
  dirPath: string
  fileName: string
  data: string | Buffer
}) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    const filePath = path.resolve(dirPath, fileName)
    fs.writeFileSync(filePath, data, 'utf8')
  } catch (err) {
    console.error('‼️', err)
  }
}
