import { Message, RichEmbed } from 'discord.js'

import CommandRouter from '../CommandRouter'

export default class HelpHandler {
  handle = (command: string, args: Array<string>, message: Message) => {
    const embed = new RichEmbed
    const router = new CommandRouter

    if (!args.length) {
      embed.setTitle('Some Bot: Help')
      embed.setDescription('Available subcommands:')
      
      for (var commandName in router.getMap()) {
        embed.addField(`/${commandName}`, router.getMap()[commandName].description)
      }
  
      embed.setFooter('Type "/help <command> (<subcommand>)" for help with a specific (sub)command.')
  
    } else {

      if (!router.has(args[0])) {
        return message.channel.send(`Unrecognised command "${args[0]}". Type /help for a list of available commands.`)
      }
      
      const handler = router.getHandler(args[0])

      switch (args.length) {
        case 1:
          // Just the command

          embed.setTitle(`/${args[0]} <subcommand>`)
          embed.setDescription('Subcommands:')
  
          for (var subcommand in handler.subcommands) {
            const details = handler.subcommands[subcommand]
            embed.addField(subcommand, details.description)
          }

          embed.setFooter(`Type "/help ${args[0]} <subcommand>" for help with a specific subcommand.`)
          break
        case 2:
          // Command and subcommand

          if (!handler.subcommands[args[1]]) {
            return message.channel.send(`Unrecognised subcommand "${args[1]}" for /${args[0]}. Type "/help ${args[0]}" for a list of available subcommands.`)
          }

          embed.setTitle(`/${args[0]} ${args[1]}`)
          embed.setDescription('Arguments:')
  
          for (var arg in handler.subcommands[args[1]].args) {
            const details = handler.subcommands[args[1]].args[arg]
            embed.addField(arg, `${details.description}\nUsage: ${details.usage}`)
          }
          break
      }
    }

    return message.channel.send(embed)
  }
}