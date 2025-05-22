import type { FileLineProcessor } from '@/file/utils'
import { getHashKey, isPerson } from '@/utils'

export const fileProcessor: FileLineProcessor = async (line, resultsMap) => {
  if (isPerson(line)) {
    return
  }

  const hashKey = getHashKey(line)

  if (resultsMap.has(hashKey)) {
    const duplicates = resultsMap.get(hashKey)
    duplicates?.push(line)
  } else {
    resultsMap.set(hashKey, [line])
  }
}
