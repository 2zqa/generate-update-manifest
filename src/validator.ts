export default class Validator {
  private _errors: Map<string, string>

  constructor() {
    this._errors = new Map()
  }

  // Note that ReadonlyMap is not foolproof:
  // https://stackoverflow.com/q/50046573
  get errors(): ReadonlyMap<string, string> {
    return this._errors
  }

  public toJSON(): string {
    return JSON.stringify(Object.fromEntries(this._errors), null, 2)
  }

  public isValid(): boolean {
    return this._errors.size === 0
  }

  public addError(inputName: string, message: string): void {
    if (!this._errors.has(inputName)) {
      this._errors.set(inputName, message)
    }
  }

  public check(isValid: boolean, key: string, message: string): void {
    if (!isValid) {
      this.addError(key, message)
    }
  }
}
