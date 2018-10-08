import { Message } from 'discord.js'

export interface Handler {
  handle(message: Message)
}