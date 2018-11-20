import CommandRouter from './Command/CommandRouter'

import HelpCommandHandler from './Handlers/Command/Help'
import CatCommandHandler from './Handlers/Command/Cat'

const router = new CommandRouter

router.add('?')
  .describe('Show help.')
  .use(HelpCommandHandler.handle)

router.alias('?', 'help')

router.add('cat')
  .describe('Cats.')
  .accept('random', {
    description: 'Fetch a random image from the hot submissions of one of 15 cat-related subreddits.',
    usage: 'cat random',
    handler: CatCommandHandler.random
  })

export default router