import fs from 'node:fs'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'

export type FileLineProcessor<T, O = void> = (
  line: string,
  resultsMap: Map<string, T>,
  options?: O
) => Promise<void>

type ReadStreamParams<T, O = void> = {
  filePath: string
  resultsMap: Map<string, T>
  lineProcessor: FileLineProcessor<T, O>
  options?: O
}

export const readFileStream = async <T, O>({
  filePath,
  resultsMap,
  lineProcessor,
  options,
}: ReadStreamParams<T, O>): Promise<void> => {
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

      await lineProcessor(line, resultsMap, options)
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
  obj: Record<string, T> | string[] | string
) => {
  fs.writeFileSync(
    path.resolve(process.cwd(), 'files', outputFileName),
    JSON.stringify(obj, null, 2)
  )
}
