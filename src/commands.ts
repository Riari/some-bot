import HelpCommandHandler from './Handlers/Command/Help'
import CatCommandHandler from './Handlers/Command/Cat'
import XIVCommandHandler from './Handlers/Command/XIV'

export interface CommandMap {
  [name: string]: CommandPart
}

export interface CommandPart {
  description?: string
  uses?: Function
  has?: CommandMap
}

const map: CommandMap = {
  '?': {
    uses: HelpCommandHandler.handle
  },
  cat: {
    description: 'Cat stuff.',
    has: {
      random: {
        description: 'Fetch a random image from the hot submissions of one of 15 cat-related subreddits.',
        uses: CatCommandHandler.random
      }
    }
  },
  xiv: {
    description: 'Final Fantasy XIV stuff.',
    has: {
      lookup: {
        has: {
          pc: {
            description: 'Look up a player character.',
            uses: XIVCommandHandler.lookupPC
          },
          fc: {
            description: 'Look up a free company.',
            uses: XIVCommandHandler.lookupFC
          }
        }
      }
    }
  }
}

// Aliases
map.help = map['?']

export default map