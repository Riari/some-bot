import { Message, RichEmbed } from 'discord.js'

import CommandHandler from '../Command'

export default class CatCommandHandler extends CommandHandler {
  public static random (args: Array<string>, message: Message) {
    message.reply('test')
  }
}