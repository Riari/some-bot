import { Message } from 'discord.js'

import { Handler } from '../Interfaces/Handler'

export default class KeywordHandler implements Handler {
  handle = (message: Message) => {
    switch (message.content) {
      case 'mlem':
        return message.reply('blep')
      case 'blep':
        return message.reply('mlem')
    }
  }
}
