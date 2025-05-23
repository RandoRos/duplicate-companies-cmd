import type { FileLineProcessor } from '@/file/utils'
import { getHashKey, isPerson, addToHashMap } from '@/utils'
import { levenshteinDistance, lengthBaseIncludes } from '@/comparsions'

export type DuplicateProcessorOptions = {
  brands?: Set<string>
  levenshtein?: boolean
  levenshteinThreshold?: number
}

export const findDuplicatesProcessor: FileLineProcessor<
  string[],
  DuplicateProcessorOptions
> = (() => {
  let lastLine: string | null = null
  let lastKey: string = ''

  return async (line, resultsMap, options) => {
    if (isPerson(line)) {
      return
    }

    const hashKey = getHashKey(line, 2)

    if (hashKey.length < 2) {
      return
    }

    if (options?.brands) {
      const brands = options.brands
      const isMatch = lengthBaseIncludes(hashKey, lastKey)
      const key = isMatch ? lastKey : hashKey

      if (brands.has(key)) {
        addToHashMap(resultsMap, key, line)
        if (!isMatch) {
          lastKey = hashKey
        }
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
    lastKey = hashKey
  }
})()
