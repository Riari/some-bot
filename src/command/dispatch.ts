import { Message } from 'discord.js'
import resolve from './resolve'

export default function dispatch (line: string, message: Message) {
  const command = resolve(line)

  if (command.args.length < command.accepts.length) {
    throw new Error(`Received ${command.args.length} arguments, but expected ${command.accepts.length}`)
  }

  return command.handler(command.args, message)
}
