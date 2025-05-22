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
