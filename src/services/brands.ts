import { brandProcessor } from '@/file/processors/brands'
import { readFileStream, writeToFile } from '@/file/utils'

export const createBrandMap = async (file: string) => {
  const brandFreqMap = new Map<string, number>()

  await readFileStream({
    filePath: file,
    resultsMap: brandFreqMap,
    lineProcessor: brandProcessor,
  })

  const popularBrandsArr = Array.from(brandFreqMap.entries())
    .filter(([_, frequency]) => frequency >= 4)
    .map(([name]) => name)

  writeToFile('brands.json', popularBrandsArr)

  return new Set<string>(popularBrandsArr)
}
