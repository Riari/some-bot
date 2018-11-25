import commands from '../commands'

export interface ResolvedCommand {
  handler: Function
  args: Array<string>
}

export default function resolve (line: string): ResolvedCommand {
  const parts = line.split(' ')
  const start = parts.shift()

  if (!!commands[start]) {
    throw new Error(`Tried to get unknown command '${start}`)
  }

  let resolution = commands[start]
  let size = 1

  for (const [index, part] of parts.entries()) {
    if (resolution[part]) {
      resolution = resolution[part]
      size = index
    } else {
      // Break at the first unrecognised part as it's likely to be an argument for the given command
      break
    }
  }

  if (!resolution.hasOwnProperty('uses') || typeof resolution.uses !== 'function') {
    throw new Error(`Tried to resolve incomplete command '${line}'`)
  }

  const command: ResolvedCommand = {
    handler: resolution.uses,
    args: parts.slice(size)
  }

  return command
}
