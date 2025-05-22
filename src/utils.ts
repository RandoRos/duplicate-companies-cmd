import {
  businessKeywords,
  listOfMaleNames,
  listOfFemaleNames,
} from '@/datasets'

export const normalizeCompanyName = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/&/g, 'and')
    .replace(/[,.]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export const getHashKey = (str: string): string => {
  const words = normalizeCompanyName(str).split(/\s+/)

  return words.slice(0, 2).join('-')
}

export const isPerson = (str: string) => {
  const words = str.trim().toLocaleLowerCase().split(/\s+/)

  if (words.length > 2 && businessKeywords.some((k) => words.includes(k))) {
    return false
  }

  // Check common EN first names
  const firstName = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  if (listOfMaleNames.has(firstName) || listOfFemaleNames.has(firstName)) {
    return true
  }

  return false
}
