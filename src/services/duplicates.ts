import { findDuplicatesProcessor } from '@/file/processors/duplicates'
import { readFileStream } from '@/file/utils'

type Params = {
  brands?: Set<string>
}

export const findDuplicateCompanies = async (
  file: string,
  params: Params = {}
): Promise<Record<string, string[]>> => {
  const resultsMap = new Map<string, string[]>()

  await readFileStream({
    filePath: file,
    resultsMap,
    lineProcessor: findDuplicatesProcessor,
    options: {
      brands: params.brands,
    },
  })

  // Filter out companies with only one value
  const filteredCompaniesObject = Object.fromEntries(
    Array.from(resultsMap.entries()).filter(([_, values]) => values.length > 1)
  )

  return filteredCompaniesObject
}
