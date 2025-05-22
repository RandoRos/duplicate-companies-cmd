export const lengthBaseIncludes = (a: string, b: string) => {
  const [shorter, longer] = a.length < b.length ? [a, b] : [b, a]

  if (!shorter.includes('-') && longer.includes('-')) {
    const firstWord = longer.split('-')[0]
    return longer.includes(firstWord)
  }

  const lengthDifference = longer.length - shorter.length

  if (shorter.length < 3 && lengthDifference > 3) {
    return false
  }

  return longer.includes(shorter)
}
