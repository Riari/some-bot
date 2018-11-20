export interface CommandArgument {
  description: string
  usage: string
  handler: Function
}

export interface CommandArgumentList {
  [name: string]: CommandArgument
}

export class Command {
  private _name: string = null
  private _description: string = null
  private _handler: Function = null
  private _args: CommandArgumentList = {}

  get name (): string {
    return this._name
  }

  get description (): string {
    return this._description
  }

  get handler (): Function {
    return this._handler
  }

  get args (): CommandArgumentList {
    return this._args
  }

  constructor (name: string) {
    this._name = name
  }

  // Sets a description for this command.
  describe (text: string) {
    this._description = text
    return this
  }

  // Registers a handler to handle this command directly without arguments.
  use (handler: Function) {
    this._handler = handler
    return this
  }

  // Registers an argument accepted by this command.
  accept (arg: string, properties: CommandArgument) {
    this._args[arg] = properties
    return this
  }
}
