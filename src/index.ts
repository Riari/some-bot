import { Message } from 'discord.js'
import client from './client'

import router from './routes'
import KeywordHandler from './Handlers/Keyword'

function handleError(error: Error, message: Message) {
  console.error(error)
  message.channel.send(`[Error] ${error.message}`)
}

client.on('ready', () => client.user.setActivity('with wool. Type /? for help.'))

client.on('message', (message: Message) => {
  if (message.content.startsWith('/')) {
    const args = message.content.split(' ')
    const command = args.shift().substr(1)

    if (!command) {
      return
    }

    if (!router.has(command)) {
      return console.log(`No registered handler for command '${command}'; ignoring`)
    }

    try {
      router.dispatch(command, args, message).catch(error => handleError(error, message))
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