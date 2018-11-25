import commands from '../commands'

export interface ResolvedCommand {
  handler: Function
  accepts: Array<string>
  args: Array<string>
}

export default function resolve (line: string): ResolvedCommand {
  const parts = line.split(' ')
  const start = parts.shift()

  if (!commands[start]) {
    throw new Error(`Tried to resolve unknown command '${start}'`)
  }

  let resolution = commands[start]
  let size = 0

  for (const part of parts) {
    if (!resolution.hasOwnProperty('has') || !resolution.has[part]) {
      // Break if no further resolution can be made
      break
    }

    size++
    resolution = resolution.has[part]
  }

  if (!resolution.hasOwnProperty('uses') || typeof resolution.uses !== 'function') {
    throw new Error(`Tried to resolve incomplete command '${line}'`)
  }

  const command: ResolvedCommand = {
    handler: resolution.uses,
    accepts: resolution.accepts || [],
    args: parts.slice(size)
  }

  return command
}
