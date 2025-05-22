import type { FileLineProcessor } from '@/file/utils'
import { getHashKey, isPerson } from '@/utils'
import { lengthBaseIncludes } from '@/comparsions'

let lastBrandName: string | null = null

export const brandProcessor: FileLineProcessor<number> = async (
  line,
  brandMap
) => {
  if (isPerson(line)) return

  const brand = getHashKey(line, 2)

  if (brand.length < 2) return

  const isMatch =
    lastBrandName && lengthBaseIncludes(brand, lastBrandName)

  if (lastBrandName && isMatch) {

    if (brandMap.has(lastBrandName)) {
      const count = brandMap.get(lastBrandName) || 0
      brandMap.set(lastBrandName, count + 1)
    }
  } else {
    if (brandMap.has(brand)) {
      const count = brandMap.get(brand)
      if (count) {
        brandMap.set(brand, count + 1)
      }
    } else {
      brandMap.set(brand, 1)
      lastBrandName = brand
    }
  }
}
