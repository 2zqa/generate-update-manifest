import Validator from '../src/validator'

describe('Validator', () => {
  let validator: Validator

  beforeEach(() => {
    validator = new Validator()
  })

  describe('addError', () => {
    it('adds an error to the internal map', () => {
      validator.addError('inputName', 'error message')
      expect(validator.errors.size).toBe(1)
      expect(validator.errors.get('inputName')).toBe('error message')
    })

    it('does not add a duplicate error', () => {
      validator.addError('inputName', 'error message')
      validator.addError('inputName', 'new error message')
      expect(validator.errors.size).toBe(1)
      expect(validator.errors.get('inputName')).toBe('error message')
    })
  })

  describe('isValid', () => {
    it('returns true when there are no errors', () => {
      expect(validator.isValid()).toBe(true)
    })

    it('returns false when there are errors', () => {
      validator.addError('inputName', 'error message')
      expect(validator.isValid()).toBe(false)
    })
  })

  describe('toJSON', () => {
    it('returns a JSON string representation of the internal map', () => {
      validator.addError('input-name', 'error message')
      expect(validator.toJSON()).toBe('{\n  "input-name": "error message"\n}')
    })
  })

  describe('check', () => {
    it('adds an error when isValid is false', () => {
      validator.check(false, 'inputName', 'error message')
      expect(validator.errors.size).toBe(1)
      expect(validator.errors.get('inputName')).toBe('error message')
    })

    it('does not add an error when isValid is true', () => {
      validator.check(true, 'inputName', 'error message')
      expect(validator.errors.size).toBe(0)
    })
  })
})
