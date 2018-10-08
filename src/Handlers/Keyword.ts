import { Message } from 'discord.js'

export default class KeywordHandler {
  handle = (message: Message) => {
    switch (message.content) {
      case 'mlem':
        return message.reply('blep')
      case 'blep':
        return message.reply('mlem')
    }
  }
}
