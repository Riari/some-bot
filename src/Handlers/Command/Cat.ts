import { Message } from 'discord.js'

export default class CatCommandHandler {
  public static random (args: Array<string>, message: Message) {
    message.reply('test')
  }
}
