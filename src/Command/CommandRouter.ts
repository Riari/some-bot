import { Message } from 'discord.js'

import { Command } from './Command'

export interface CommandList {
  [name: string]: Command
}

export default class CommandRouter {
  private _commands: CommandList = {}

  get commands () {
    return this._commands
  }

  add (name: string) {
    const command = new Command(name)
    this._commands[name] = command
    return this._commands[name]
  }

  alias (command: string, name: string) {
    if (!this.has(command)) {
      throw new Error(`Tried to set alias for unregistered command '${command}'`)
    }

    this._commands[name] = this._commands[command]
  }

  has (command: string) {
    return !!this._commands[command]
  }

  getCommand (command: string) {
    if (!this.has(command)) {
      throw new Error(`Tried to get unregistered command '${command}'`)
    }

    return this._commands[command]
  }

  getHandler (command: string) {
    if (!this.has(command)) {
      throw new Error(`Tried to get handler for unregistered command '${command}'`)
    }

    return this._commands[command].handler
  }

  dispatch (command: string, args: Array<string>, message: Message) {
    const handler = this.getHandler(command)
    return handler(args, message)
  }
}
