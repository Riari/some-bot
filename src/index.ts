import { Message } from 'discord.js'
import client from './client'

import dispatch from './command/dispatch'
import KeywordHandler from './Handlers/Keyword'

function handleError(error: Error, message: Message) {
  console.error(error)
  message.channel.send(`[Error] ${error.message}`)
}

client.on('ready', () => client.user.setActivity('with wool. Type /? for help.'))

client.on('message', (message: Message) => {
  if (message.author.bot) {
    return
  }

  if (message.content.startsWith('/')) {
    const line = message.content.substr(1)

    try {
      dispatch(line, message)
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