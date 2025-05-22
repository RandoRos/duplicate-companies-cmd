import { fileProcessor } from '@/file/processors'
import { readFileStream } from '@/file/utils'

export const findDuplicateCompanies = async (
  file: string
): Promise<Record<string, string[]>> => {
  const resultsMap = new Map<string, string[]>()

  await readFileStream({
    filePath: file,
    resultsMap,
    lineProcessor: fileProcessor,
  })

  // Filter out companies with only one value
  const filteredCompaniesObject = Object.fromEntries(
    Array.from(resultsMap.entries()).filter(([_, values]) => values.length > 1)
  )

  return filteredCompaniesObject
}
