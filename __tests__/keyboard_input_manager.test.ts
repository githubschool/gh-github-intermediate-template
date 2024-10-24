import { jest } from '@jest/globals'

const { KeyboardInputManager } = await import(
  '../src/keyboard_input_manager.js'
)

describe('KeyboardInputManager', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('todo', () => {
    it('Create some unit tests', async () => {
      expect(true).toBe(true)
    })
  })
})
