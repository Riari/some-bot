import { Message } from 'discord.js'
import client from './client'

import KeywordHandler from './Handlers/Keyword'
import XIVCommandHandler from './Handlers/Command/XIV'

function handleError(error: Error, message: Message) {
  console.error(error)
  message.channel.send(`[Error] ${error.message}`)
}

client.on('message', (message: Message) => {
  if (message.content.startsWith('/')) {
    const commandHandlers = {
      'xiv': XIVCommandHandler
    }

    const args = message.content.split(' ')
    const command = args.shift().substr(1)

    if (!command) {
      return
    }

    if (!commandHandlers[command]) {
      return console.log(`No registered handler for command '${command}'; ignoring`)
    }

    const handler = new commandHandlers[command]

    try {
      handler.handle(args, message).catch(error => handleError(error, message))
    } catch (error) {
      handleError(error, message)
    }
  } else {
    const handler = new KeywordHandler

    try {
      handler.handle(message)
    } catch (error) {
      handleError(error, message)
    }
  }
})