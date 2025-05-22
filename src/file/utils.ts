import fs from 'node:fs'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'

export type FileLineProcessor = (
  line: string,
  resultsMap: Map<string, string[]>
) => Promise<void>

type ReadStreamParams = {
  filePath: string
  resultsMap: Map<string, string[]>
  lineProcessor: FileLineProcessor
}

export const readFileStream = async ({
  filePath,
  resultsMap,
  lineProcessor,
}: ReadStreamParams): Promise<void> => {
  const stream = fs.createReadStream(filePath, {
    encoding: 'utf-8',
    highWaterMark: 1024,
  })

  stream.on('error', (err) => {
    console.error('Error reading file: ', err.message)
    stream.destroy()
    throw err
  })

  const rl = createInterface({
    input: stream,
    crlfDelay: Infinity,
  })

  try {
    for await (const line of rl) {
      if (!line.trim()) continue

      await lineProcessor(line, resultsMap)
    }
  } catch (err) {
    console.error('Error processing file: ', err)
    throw err
  } finally {
    rl.close()
    stream.destroy()
  }
}

export const writeToFile = <T>(
  outputFileName: string,
  obj: Record<string, T>
) => {
  fs.writeFileSync(
    path.resolve(process.cwd(), 'files', outputFileName),
    JSON.stringify(obj, null, 2)
  )
}
