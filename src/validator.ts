/**
 * A class representing a validator that can be used to validate input data.
 */
export default class Validator {
  /**
   * Matches RFC 4122 UUIDs with curly brackets.
   */
  static readonly uuidRegex = /^\{[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}\}$/i

  /**
   * Matches e-mail addresses according to the HTML spec.
   *
   * @see {@link https://html.spec.whatwg.org/#valid-e-mail-address}
   */
  static readonly emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  private _errors: Map<string, string>

  /**
   * Creates a new validator.
   *
   * @example
   * const validator = new Validator()
   * const email = core.getInput('email') // e.g. 'john.doe@example.com'
   * validator.check(Validator.emailRegex.test(email), 'email', 'Email is invalid')
   * console.log(validator.isValid()) // true
   */
  constructor() {
    this._errors = new Map()
  }

  /**
   * Returns a readonly map of the errors.
   * @see https://stackoverflow.com/q/50046573
   */
  get errors(): ReadonlyMap<string, string> {
    // Note that ReadonlyMap doesn't prevent writing during runtime, only
    // during compile time.
    return this._errors
  }

  /**
   * Returns a JSON representation of the errors.
   * @returns A string representing the JSON object of errors.
   */
  toJSON(): string {
    return JSON.stringify(Object.fromEntries(this._errors), null, 2)
  }

  /**
   * Returns true if the errors map doesn't contain any entries.
   */
  isValid(): boolean {
    return this._errors.size === 0
  }

  /**
   * Adds an error message to the map (so long as no entry already exists for
   * the given key).
   * @param inputName - The name of the input that caused the error.
   * @param message - The error message.
   */
  addError(inputName: string, message: string): void {
    if (!this._errors.has(inputName)) {
      this._errors.set(inputName, message)
    }
  }

  /**
   * Stores an error message if isValid is false.
   * @param isValid - A boolean indicating if the check is valid.
   * @param key - The name of the input that caused the error.
   * @param message - The error message.
   */
  check(isValid: boolean, key: string, message: string): void {
    if (!isValid) {
      this.addError(key, message)
    }
  }
}
