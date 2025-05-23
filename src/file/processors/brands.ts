import type { FileLineProcessor } from '@/file/utils'
import { getHashKey, isPerson } from '@/utils'
import { lengthBaseIncludes } from '@/comparsions'

export const brandProcessor: FileLineProcessor<number> = (() => {
  let lastKey: string | null = null

  return async (line, brandMap) => {
    if (isPerson(line)) return

    const brand = getHashKey(line, 1)

    if (brand.length < 2) return

    const isMatch = lastKey && lengthBaseIncludes(brand, lastKey)

    if (lastKey && isMatch) {
      if (brandMap.has(lastKey)) {
        const count = brandMap.get(lastKey) || 0
        brandMap.set(lastKey, count + 1)
        return
      }
    } else {
      if (brandMap.has(brand)) {
        const count = brandMap.get(brand)
        if (count) {
          brandMap.set(brand, count + 1)
        }
      } else {
        brandMap.set(brand, 1)
      }
      lastKey = brand
    }
  }
})()
