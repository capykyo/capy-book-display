import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
    expect(cn('foo', null, undefined, 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar')
  })

  it('should handle empty strings', () => {
    expect(cn('foo', '', 'bar')).toBe('foo bar')
  })

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('should handle objects', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })
})

