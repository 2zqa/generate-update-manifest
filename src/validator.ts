/**
 * A class representing a validator that can be used to validate input data.
 */
export default class Validator {
  // https://stackoverflow.com/a/13653180 plus the addition of the curly braces
  public static readonly uuidRegex =
    /^\{[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}\}$/i

  // https://html.spec.whatwg.org/#valid-e-mail-address
  public static readonly emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  private _errors: Map<string, string>

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
  public toJSON(): string {
    return JSON.stringify(Object.fromEntries(this._errors), null, 2)
  }

  /**
   * Returns true if the errors map doesn't contain any entries.
   */
  public isValid(): boolean {
    return this._errors.size === 0
  }

  /**
   * Adds an error message to the map (so long as no entry already exists for
   * the given key).
   * @param inputName - The name of the input that caused the error.
   * @param message - The error message.
   */
  public addError(inputName: string, message: string): void {
    if (!this._errors.has(inputName)) {
      this._errors.set(inputName, message)
    }
  }

  /**
   * Stores an error message if the isValid check is not valid.
   * @param isValid - A boolean indicating if the check is valid.
   * @param key - The name of the input that caused the error.
   * @param message - The error message that's added if the check is not valid.
   */
  public check(isValid: boolean, key: string, message: string): void {
    if (!isValid) {
      this.addError(key, message)
    }
  }
}
