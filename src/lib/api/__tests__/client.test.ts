import { extractArticle } from '../client'

// Mock fetch
global.fetch = jest.fn() as jest.Mock

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset environment variables
    if (typeof process !== 'undefined') {
      process.env.NODE_ENV = 'test'
      process.env.NEXT_PUBLIC_API_URL_DEV = 'http://localhost:3000/api/extract'
      process.env.NEXT_PUBLIC_API_URL_PROD = 'https://capy-book-fetch.vercel.app/api/extract'
    }
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('extractArticle', () => {
    it('should successfully extract article', async () => {
      const mockResponse = {
        success: true,
        data: {
          title: 'Test Title',
          content: 'Test Content',
          author: 'Test Author',
          prevLink: null,
          nextLink: 'https://quanben.io/n/xuanjiezhimen/2.html',
          bookName: 'Test Book',
          description: 'Test Description',
        },
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await extractArticle('https://quanben.io/n/xuanjiezhimen/1.html')

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Test Title')
        expect(result.data.content).toBe('Test Content')
      }
    })

    it('should handle API errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => JSON.stringify({ error: 'Invalid URL' }),
      })

      const result = await extractArticle('invalid-url')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeDefined()
      }
    })

    it('should handle network errors', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const result = await extractArticle('https://quanben.io/n/xuanjiezhimen/1.html')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeDefined()
        expect(result.message).toContain('网络请求失败')
      }
    })

    it('should handle invalid response format', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'format' }),
      })

      const result = await extractArticle('https://quanben.io/n/xuanjiezhimen/1.html')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeDefined()
      }
    })
  })
})

