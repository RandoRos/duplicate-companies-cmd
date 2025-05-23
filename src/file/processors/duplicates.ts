import type { FileLineProcessor } from '@/file/utils'
import { getHashKey, isPerson, addToHashMap } from '@/utils'
import { levenshteinDistance } from '@/comparsions'

export type DuplicateProcessorOptions = {
  brands?: Set<string>
  levenshtein?: boolean
  levenshteinThreshold?: number
}

let lastLine: string | null = null

export const findDuplicatesProcessor: FileLineProcessor<
  string[],
  DuplicateProcessorOptions
> = async (line, resultsMap, options) => {
  if (isPerson(line)) {
    return
  }

  const hashKey = getHashKey(line, 2)

  if (hashKey.length < 2) {
    return
  }

  if (options?.brands) {
    const brands = options.brands
    const brandKey = getHashKey(line, 2)

    if (brands.has(brandKey)) {
      addToHashMap(resultsMap, brandKey, line)
      return
    }
  }

  if (options?.levenshtein) {
    if (lastLine) {
      const threshold = options.levenshteinThreshold ?? 0.5
      const distance = levenshteinDistance(lastLine, line)
      if (distance >= threshold) {
        const key = getHashKey(lastLine, 2)
        addToHashMap(resultsMap, key, line)
        return
      }
    }
  }

  addToHashMap(resultsMap, hashKey, line)

  lastLine = line
}
