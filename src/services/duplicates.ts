import {
  findDuplicatesProcessor,
  type DuplicateProcessorOptions,
} from '@/file/processors/duplicates'
import { readFileStream } from '@/file/utils'

export const findDuplicateCompanies = async (
  file: string,
  params: DuplicateProcessorOptions
): Promise<Record<string, string[]>> => {
  const resultsMap = new Map<string, string[]>()

  await readFileStream({
    filePath: file,
    resultsMap,
    lineProcessor: findDuplicatesProcessor,
    options: params,
  })

  // Filter out companies with only one value
  const filteredCompaniesObject = Object.fromEntries(
    Array.from(resultsMap.entries()).filter(([_, values]) => values.length > 1)
  )

  return filteredCompaniesObject
}
