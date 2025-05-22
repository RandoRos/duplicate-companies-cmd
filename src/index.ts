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
  .action(async (file, options) => {
    console.log('Finding potential duplicate company names in:', file)

    const params: { brands?: Set<string> } = {}

    if (options.brands) {
      console.log('Using brand names for comparison')
      params.brands = await createBrandMap(file)
    }

    const duplicates = await findDuplicateCompanies(file, params)

    if (options.output) {
      writeToFile(options.output, duplicates)
    }

    console.log(`Found ${Object.keys(duplicates).length} potential duplicates`)
  })
  .parse(process.argv)
