import {
  normalizeCompanyName,
  getHashKey,
  isPerson,
  addToHashMap,
  isSingleWord,
} from '@/utils'

describe('normalizeCompanyName', () => {
  test('should convert to lowercase', () => {
    expect(normalizeCompanyName('TEST NAME')).toBe('test name')
  })

  test('should remove &', () => {
    expect(normalizeCompanyName('TEST & NAME')).toBe('test name')
  })

  test('should remove commas and periods', () => {
    expect(normalizeCompanyName('Test, Inc.')).toBe('test')
  })

  test('should remove common business suffixes', () => {
    expect(normalizeCompanyName('Example Corp')).toBe('example')
    expect(normalizeCompanyName('Example Inc')).toBe('example')
    expect(normalizeCompanyName('Example LLC')).toBe('example')
    expect(normalizeCompanyName('Example Ltd')).toBe('example')
    expect(normalizeCompanyName('Example Limited')).toBe('example')
    expect(normalizeCompanyName('Example Corporation')).toBe('example')
    expect(normalizeCompanyName('Example PLC')).toBe('example')
    expect(normalizeCompanyName('Example Co')).toBe('example')
    expect(normalizeCompanyName('Example Company')).toBe('example')
    expect(normalizeCompanyName('Example Studios')).toBe('example')
    expect(normalizeCompanyName('Example Studio')).toBe('example')
    expect(normalizeCompanyName('Example Production')).toBe('example')
    expect(normalizeCompanyName('Example Entertainment')).toBe('example')
    expect(normalizeCompanyName('Example Entertainments')).toBe('example')
    expect(normalizeCompanyName('Example Group')).toBe('example')
    expect(normalizeCompanyName('Example Groups')).toBe('example')
    expect(normalizeCompanyName('Example Game')).toBe('example')
    expect(normalizeCompanyName('Example Games')).toBe('example')
    expect(normalizeCompanyName('Example Presents')).toBe('example')
    expect(normalizeCompanyName('Example Present')).toBe('example')
    expect(normalizeCompanyName('Example Media')).toBe('example')
    expect(normalizeCompanyName('Example Interactive')).toBe('example')
    expect(normalizeCompanyName('Example Digital')).toBe('example')
  })

  test('should normalize whitespace', () => {
    expect(normalizeCompanyName('  Test   Name  ')).toBe('test name')
  })

  test('should handle complex cases', () => {
    expect(normalizeCompanyName('ACME, Inc. Sons Ltd.')).toBe('acme sons')
  })
})

describe('getHashKey', () => {
  test('should create hash key from normalized company name', () => {
    expect(getHashKey('Example Corp')).toBe('example')
  })

  test('should limit word count if specified', () => {
    expect(getHashKey('First Second Third Fourth', 2)).toBe('first-second')
  })

  test('should handle single word names', () => {
    expect(getHashKey('Example')).toBe('example')
  })

  test('should handle multi-word names', () => {
    expect(getHashKey('Example Tech Solutions Inc')).toBe(
      'example-tech-solutions'
    )
  })

  test('should handle names with special characters', () => {
    expect(getHashKey('Example & Co.')).toBe('example')
  })
})

describe('isPerson', () => {
  test('should identify individuals by first name', () => {
    expect(isPerson('John Smith')).toBe(true)
    expect(isPerson('Mary Johnson')).toBe(true)
  })

  test('should return false for business names with keywords', () => {
    expect(isPerson('John Smith Inc')).toBe(false)
    expect(isPerson('John Smith Software Group')).toBe(false)
  })

  test('should return false for non-person names', () => {
    expect(isPerson('Acme Products')).toBe(false)
  })

  test('should handle edge cases with mixed case names', () => {
    expect(isPerson('JOHN smith')).toBe(true)
    expect(isPerson('john SMITH')).toBe(true)
  })

  test('should handle names with extra whitespace', () => {
    expect(isPerson('  John   Smith  ')).toBe(true)
  })
})

describe('addToHashMap', () => {
  test('should add a new key-value pair to the map', () => {
    const map = new Map<string, string[]>()
    addToHashMap(map, 'key1', 'value1')
    expect(map.get('key1')).toEqual(['value1'])
  })

  test('should append to existing values for a key', () => {
    const map = new Map<string, string[]>()
    map.set('key1', ['value1'])
    addToHashMap(map, 'key1', 'value2')
    expect(map.get('key1')).toEqual(['value1', 'value2'])
  })

  test('should handle multiple additions to the same key', () => {
    const map = new Map<string, string[]>()
    addToHashMap(map, 'key1', 'value1')
    addToHashMap(map, 'key1', 'value2')
    addToHashMap(map, 'key1', 'value3')
    expect(map.get('key1')).toEqual(['value1', 'value2', 'value3'])
  })
})

describe('isSingleWord', () => {
  test('should identify strings without hyphens as single words', () => {
    expect(isSingleWord('apple')).toBe(true)
    expect(isSingleWord('banana')).toBe(true)
    expect(isSingleWord('techsolutions')).toBe(true)
  })

  test('should identify strings with hyphens as multi-word', () => {
    expect(isSingleWord('apple-pie')).toBe(false)
    expect(isSingleWord('tech-solutions')).toBe(false)
    expect(isSingleWord('first-second-third')).toBe(false)
  })
})
