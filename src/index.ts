import { Command } from '@commander-js/extra-typings'

import { readFileStream, writeMapToFile } from '@/file/utils'
import { fileProcessor } from '@/file/processors'

const program = new Command()

program
  .name('find-company-duplicates')
  .description('Find potential duplicate company names')
  .version('1.0.0')
  .argument('<file>', 'Path to the file containing company names')
  .option('-o, --output <output>', 'Output file path')
  .action(async (file, options) => {
    console.log('Finding potential duplicate company names in:', file)
    const resultsMap = new Map<string, string[]>()
    await readFileStream({
      filePath: file,
      resultsMap,
      lineProcessor: fileProcessor,
    })

    if (options.output) {
      writeMapToFile(options.output, resultsMap)
    }

    console.log(`Found ${resultsMap.size} potential duplicates`)
  })
  .parse(process.argv)
