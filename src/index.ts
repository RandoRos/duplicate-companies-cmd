import { Command } from '@commander-js/extra-typings'

import { readFileStream } from '@/file/utils'
import { fileProcessor } from '@/file/processors'

const program = new Command()

program
  .name('find-company-duplicates')
  .description('Find potential duplicate company names')
  .version('1.0.0')
  .argument('<file>', 'Path to the file containing company names')
  .action(async (file, options) => {
    console.log('Finding potential duplicate company names in:', file)
    const resultsMap = new Map<string, string[]>()
    await readFileStream({
      filePath: file,
      resultsMap,
      lineProcessor: fileProcessor,
    })

    console.log('Result duplicate map: ', resultsMap)
  })
  .parse(process.argv)
