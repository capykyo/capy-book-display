// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'localhost',
    href: 'http://localhost:3001',
  },
  writable: true,
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
})

