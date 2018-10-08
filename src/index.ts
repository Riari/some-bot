import { Message } from 'discord.js'
import client from './client'

import { Handler } from './Interfaces/Handler'
import KeywordHandler from './Handlers/Keyword'
import CommandHandler from './Handlers/Command'

client.on('message', (message: Message) => {
  const handler: Handler = message.content.startsWith('/')
    ? new CommandHandler
    : new KeywordHandler
  
  handler.handle(message)
})