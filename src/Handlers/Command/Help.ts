import { Message, RichEmbed } from 'discord.js'

import CommandHandler from '../Command'
import router from '../../routes'

export default class HelpCommandHandler extends CommandHandler {
  public static handle (args: Array<string>, message: Message) {
    const embed = new RichEmbed

    if (!args.length) {
      embed.setTitle('Some Bot: Help')
      embed.setDescription('Available subcommands:')
      
      for (var commandName in router.commands) {
        embed.addField(`/${commandName}`, router.commands[commandName].description)
      }
  
      embed.setFooter('Type "/help <command> (<subcommand>)" for help with a specific (sub)command.')
  
    } else {
      if (!router.has(args[0])) {
        return message.channel.send(`Unrecognised command "${args[0]}". Type /help for a list of available commands.`)
      }
      
      const command = router.getCommand(args[0])

      embed.setTitle(`/${args[0]} <subcommand>`)
      embed.setDescription('Subcommands:')

      for (var arg in command.args) {
        const details = command.args[arg]
        embed.addField(arg, details.description)
      }

      embed.setFooter(`Type "/help ${args[0]} <arg>" for help with a specific subcommand.`)
    }

    return message.channel.send(embed)
  }
}