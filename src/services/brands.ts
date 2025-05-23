import { brandProcessor } from '@/file/processors/brands'
import { readFileStream, writeToFile } from '@/file/utils'

export type BrandProcessorOptions = {
  brandFreq: number
}

export const createBrandMap = async (
  file: string,
  { brandFreq }: BrandProcessorOptions
) => {
  const brandFreqMap = new Map<string, number>()

  await readFileStream({
    filePath: file,
    resultsMap: brandFreqMap,
    lineProcessor: brandProcessor,
  })

  const popularBrandsArr = Array.from(brandFreqMap.entries())
    .filter(([_, frequency]) => frequency >= brandFreq)
    .map(([name]) => name)

  writeToFile('brands.json', popularBrandsArr)

  return new Set<string>(popularBrandsArr)
}
