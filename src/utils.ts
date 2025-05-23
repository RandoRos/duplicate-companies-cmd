import {
  businessKeywords,
  listOfMaleNames,
  listOfFemaleNames,
} from '@/datasets'

export const normalizeCompanyName = (
  str: string,
  removeKeywords: boolean = true
): string => {
  let normalized = str
    .toLowerCase()
    .normalize('NFD')
    .replace(/&/g, '')
    .replace(/[,.:;]/g, '')
    .replace(/['"]/g, '')
    // Extended list of company legal suffixes - international
    .replace(
      /\b(inc|incorporated|llc|ltd|limited|corp|corporation|plc|co|company|gmbh|ag|sa|se|nv|spa|oy|ab|as|bv|kk|pte|srl|oü)\b/gi,
      ''
    )

  if (removeKeywords) {
    normalized = normalized.replace(
      /\b(studios?|production|entertainments?|groups?|games?|presents?|media|interactive|digital|technologies|software|solutions|development|worldwide)\b/gi,
      ''
    )
  }

  return normalized.replace(/\s+/g, ' ').trim()
}

export const getHashKey = (str: string, wordCount?: number): string => {
  const words = normalizeCompanyName(str, false).split(/\s+/)

  return words.slice(0, wordCount || words.length).join('-')
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

export const addToHashMap = (
  map: Map<string, string[]>,
  key: string,
  value: string
) => {
  if (map.has(key)) {
    const values = map.get(key)
    if (values) {
      values.push(value)
    }
  } else {
    map.set(key, [value])
  }
}

export const isSingleWord = (str: string) => {
  return str.split(/-/).length === 1
}
