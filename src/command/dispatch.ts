import { Message } from 'discord.js'
import resolve from './resolve'

export default function dispatch (line: string, message: Message) {
  const command = resolve(line)
  return command.handler(command.args, message)
}