import {
  parseBookUrl,
  isValidBookUrl,
  extractBookId,
  extractChapterNumber,
} from '../urlParser'

describe('urlParser', () => {
  describe('parseBookUrl', () => {
    it('should parse valid book URL correctly', () => {
      const url = 'https://quanben.io/n/xuanjiezhimen/1.html'
      const result = parseBookUrl(url)

      expect(result).not.toBeNull()
      expect(result?.bookId).toBe('xuanjiezhimen')
      expect(result?.chapterNumber).toBe(1)
      expect(result?.fullUrl).toBe(url)
    })

    it('should parse URL with different book ID', () => {
      const url = 'https://quanben.io/n/another-book/42.html'
      const result = parseBookUrl(url)

      expect(result).not.toBeNull()
      expect(result?.bookId).toBe('another-book')
      expect(result?.chapterNumber).toBe(42)
    })

    it('should handle URLs with whitespace', () => {
      const url = '  https://quanben.io/n/xuanjiezhimen/1.html  '
      const result = parseBookUrl(url)

      expect(result).not.toBeNull()
      expect(result?.fullUrl).toBe('https://quanben.io/n/xuanjiezhimen/1.html')
    })

    it('should return null for invalid URL format', () => {
      expect(parseBookUrl('invalid-url')).toBeNull()
      expect(parseBookUrl('https://example.com')).toBeNull()
      expect(parseBookUrl('https://quanben.io/n/xuanjiezhimen')).toBeNull()
    })

    it('should return null for invalid chapter number', () => {
      expect(parseBookUrl('https://quanben.io/n/xuanjiezhimen/0.html')).toBeNull()
      expect(parseBookUrl('https://quanben.io/n/xuanjiezhimen/-1.html')).toBeNull()
    })

    it('should return null for empty or null input', () => {
      expect(parseBookUrl('')).toBeNull()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(parseBookUrl(null as any)).toBeNull()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(parseBookUrl(undefined as any)).toBeNull()
    })
  })

  describe('isValidBookUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidBookUrl('https://quanben.io/n/xuanjiezhimen/1.html')).toBe(true)
      expect(isValidBookUrl('https://quanben.io/n/another-book/42.html')).toBe(true)
    })

    it('should return false for invalid URLs', () => {
      expect(isValidBookUrl('invalid-url')).toBe(false)
      expect(isValidBookUrl('https://example.com')).toBe(false)
      expect(isValidBookUrl('')).toBe(false)
    })
  })

  describe('extractBookId', () => {
    it('should extract book ID from valid URL', () => {
      expect(extractBookId('https://quanben.io/n/xuanjiezhimen/1.html')).toBe('xuanjiezhimen')
      expect(extractBookId('https://quanben.io/n/another-book/42.html')).toBe('another-book')
    })

    it('should return null for invalid URL', () => {
      expect(extractBookId('invalid-url')).toBeNull()
      expect(extractBookId('')).toBeNull()
    })
  })

  describe('extractChapterNumber', () => {
    it('should extract chapter number from valid URL', () => {
      expect(extractChapterNumber('https://quanben.io/n/xuanjiezhimen/1.html')).toBe(1)
      expect(extractChapterNumber('https://quanben.io/n/xuanjiezhimen/42.html')).toBe(42)
    })

    it('should return null for invalid URL', () => {
      expect(extractChapterNumber('invalid-url')).toBeNull()
      expect(extractChapterNumber('')).toBeNull()
    })
  })
})

