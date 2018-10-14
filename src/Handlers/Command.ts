import { Message } from 'discord.js'

export default class CommandHandler {
  public static description: string
  public static subcommands: object

  handle = (args: Array<string>, message: Message) => {

  }
}