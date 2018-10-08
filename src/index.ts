import { Message } from 'discord.js'
import client from './client'

import KeywordHandler from './Handlers/Keyword'
import XIVCommandHandler from './Handlers/Command/XIV'

client.on('message', (message: Message) => {
  if (message.content.startsWith('/')) {
    const commandHandlers = {
      'xiv': XIVCommandHandler
    }

    const args = message.content.split(' ')
    const command = args.shift().substr(1)

    if (!command || !args.length) {
      throw new Error('Invalid command format.')
    }

    if (!commandHandlers[command]) {
      return message.channel.sendMessage("I don't recognise that command, sorry.")
    }

    const handler = new commandHandlers[command]

    try {
      handler.handle(args, message)
    } catch (error) {
      console.error(error)
      message.channel.send(`[Error] ${error.message}`)
    }
  } else {
    const handler = new KeywordHandler

    try {
      handler.handle(message)
    } catch (error) {
      console.error(error)
      message.channel.send(`[Error] ${error.message}`)
    }
  }
})