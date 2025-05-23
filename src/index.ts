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
  .option('--brands', 'Use brand names for comparison')
  .option(
    '--bf, --brand-freq <number>',
    'Use Cosine similarity algorithm for comparison',
    '4'
  )
  .option(
    '-l, --levenshtein',
    'Use Levenshtein distance algorithm for comparison'
  )
  .action(async (file, options) => {
    console.log('Finding potential duplicate company names in:', file)

    let brands

    if (options.brands) {
      console.log('Using brand names for comparison')
      brands = await createBrandMap(file, {
        brandFreq: Number(options.brandFreq),
      })
    }

    if (options.levenshtein) {
      console.log('Using Levenshtein distance algorithm for comparison')
    }

    const duplicates = await findDuplicateCompanies(file, {
      brands,
      levenshtein: options.levenshtein,
    })

    if (options.output) {
      writeToFile(options.output, duplicates)
    }

    console.log(
      `Found ${Object.keys(duplicates).length} potential duplicate group names`
    )
  })
  .parse(process.argv)
