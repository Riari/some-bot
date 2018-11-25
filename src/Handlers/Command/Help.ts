import { Message, RichEmbed } from 'discord.js'

import commands from '../../commands'
import resolve from '../../command/resolve'

export default class HelpCommandHandler {
  public static handle (args: Array<string>, message: Message) {
    console.log(args)
    // const embed = new RichEmbed

    // if (!args.length) {
    //   embed.setTitle('Some Bot: Help')
    //   embed.setDescription('Available commands:')
      
    //   for (let commandName in commands) {
    //     if (commands[commandName].hasOwnProperty('description')) {
    //       embed.addField(`/${commandName}`, commands[commandName].description)
    //     }
    //   }
  
    //   embed.setFooter('Type "/help <command> (<subcommand>)" for help with a specific (sub)command.')
  
    // } else {
    //   if (!router.has(args[0])) {
    //     return message.channel.send(`Unrecognised command "${args[0]}". Type /help for a list of available commands.`)
    //   }
      
    //   const command = router.getCommand(args[0])

    //   embed.setTitle(`/${args[0]} <subcommand>`)
    //   embed.setDescription('Subcommands:')

    //   for (var arg in command.args) {
    //     const details = command.args[arg]
    //     embed.addField(arg, details.description)
    //   }

    //   embed.setFooter(`Type "/help ${args[0]} <arg>" for help with a specific subcommand.`)
    // }

    // return message.channel.send(embed)
  }
}