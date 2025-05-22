import type { FileLineProcessor } from '@/file/utils'
import { getHashKey, isPerson } from '@/utils'

type DuplicateProcessorOptions = {
  brands?: Set<string>
}

export const findDuplicatesProcessor: FileLineProcessor<
  string[],
  DuplicateProcessorOptions
> = async (line, resultsMap, options) => {
  if (isPerson(line)) {
    return
  }

  const hashKey = getHashKey(line, 2)

  if (options?.brands) {
    const brands = options.brands
    const brandKey = getHashKey(line, 1)

    if (brands.has(brandKey)) {
      if (resultsMap.has(brandKey)) {
        const companyList = resultsMap.get(brandKey)
        if (companyList) {
          companyList.push(line)
        }
      } else {
        resultsMap.set(brandKey, [line])
      }
      return
    }
  }

  if (resultsMap.has(hashKey)) {
    const duplicates = resultsMap.get(hashKey)
    duplicates?.push(line)
  } else {
    resultsMap.set(hashKey, [line])
  }
}
