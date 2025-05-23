import maleNames from '@stdlib/datasets-male-first-names-en'
import femaleNames from '@stdlib/datasets-female-first-names-en'

export const listOfMaleNames = new Set<string>(maleNames())
export const listOfFemaleNames = new Set<string>(femaleNames())

// Some common keywords used in business names
export const businessKeywords = [
  'inc',
  'llc',
  'ltd',
  'corporation',
  'company',
  'studio',
  'game',
  'software',
  'entertainment',
  'group',
  'plc',
  'corp',
  'gmbh',
]
