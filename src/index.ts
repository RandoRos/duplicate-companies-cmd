import { Command } from '@commander-js/extra-typings'

import { findDuplicateCompanies } from '@/services/duplicates'
import { writeToFile } from '@/file/utils'

const program = new Command()

program
  .name('find-company-duplicates')
  .description('Find potential duplicate company names')
  .version('1.0.0')
  .argument('<file>', 'Path to the file containing company names')
  .option('-o, --output <output>', 'Output file path')
  .action(async (file, options) => {
    console.log('Finding potential duplicate company names in:', file)

    const duplicates = await findDuplicateCompanies(file)

    if (options.output) {
      writeToFile(options.output, duplicates)
    }

    console.log(`Found ${Object.keys(duplicates).length} potential duplicates`)
  })
  .parse(process.argv)
