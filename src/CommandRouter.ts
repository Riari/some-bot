import { Message } from 'discord.js'

import XIVCommandHandler from './Handlers/Command/XIV'

export default class CommandRouter {
  map = {
    'xiv': XIVCommandHandler
  }

  getMap = () => {
    return this.map
  }

  has = (command: string) => {
    return !!this.map[command]
  }

  getHandler = (command: string) => {
    if (!this.has(command)) {
      throw new Error(`Tried to get handler for unregistered command '${command}'`)
    }

    return this.map[command]
  }

  dispatch = (command: string, args: Array<string>, message: Message) => {
    const handler = this.getHandler(command)

    return (new handler).handle(args, message)
  }
}
