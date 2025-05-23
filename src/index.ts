import { Command } from '@commander-js/extra-typings'

import { findDuplicateCompanies } from '@/services/duplicates'
import { createBrandMap } from '@/services/brands'

import { writeToFile } from '@/file/utils'

const program = new Command()

program
  .name('find-company-duplicates')
  .description('Find potential duplicate company names')
  .version('1.0.0')
  .argument('<file>', 'Path to the file containing company names')
  .option('-o, --output <output>', 'Output file path')
  .option(
    '--brands [frequency]',
    'Use brand names for comparison with optional frequency (default 4)'
  )
  .option(
    '-l, --levenshtein [threshold]',
    'Use Levenshtein distance algorithm for comparison with optional threshold (default 0.5)'
  )
  .action(async (file, options) => {
    console.log('Finding potential duplicate company names in:', file)

    const brands = options.brands
      ? await createBrandMap(file, {
          brandFreq:
            typeof options.brands === 'string' ? Number(options.brands) : 4,
        })
      : undefined

    try {
      const duplicates = await findDuplicateCompanies(file, {
        brands,
        levenshtein: !!options.levenshtein,
        levenshteinThreshold:
          typeof options.levenshtein === 'string'
            ? Number(options.levenshtein)
            : 0.5,
      })

      if (options.output) {
        writeToFile(options.output, duplicates)
      } else {
        console.log(Object.values(duplicates))
      }

      console.log(
        `Found ${Object.keys(duplicates).length} potential duplicate groups`
      )
    } catch (error) {
      console.error('Error occured when processing file', error)
      process.exit(1)
    }
  })
  .parse(process.argv)
