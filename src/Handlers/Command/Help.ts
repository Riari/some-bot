import { Message, RichEmbed } from 'discord.js'

import commands from '../../commands'

export default class HelpCommandHandler {
  public static handle (args: Array<string>, message: Message) {
    const embed = new RichEmbed

    if (!args.length) {
      embed.setTitle('Some Bot: Help')
      embed.setDescription('Available commands:')
      
      for (let commandName in commands) {
        if (commands[commandName].hasOwnProperty('description')) {
          embed.addField(`/${commandName}`, commands[commandName].description)
        }
      }
  
      embed.setFooter('Type "/help <command>" for help with a specific command.')
    } else {
      const start = args.shift()

      let resolution = commands[start]
    
      for (const part of args) {
        if (!resolution.hasOwnProperty('has') || !resolution.has[part]) {
          throw new Error(`Unrecognised command '${start} ${args.join(' ')}'`)
        }

        resolution = resolution.has[part]
      }

      let title = `/${start} ${args.join(' ')}`

      if (resolution.accepts) {
        title += ' <' + resolution.accepts.join('> <') + '>'
      }

      embed.setTitle(title)
      embed.setDescription(resolution.description)

      if (resolution.hasOwnProperty('has')) {
        Object.keys(resolution.has).forEach(key => {
          let name = key
    
          if (resolution.has[key].accepts) {
            name += ' <' + resolution.has[key].accepts.join('> <') + '>'
          }

          embed.addField(name, resolution.has[key].description)
        })
      }
    }

    return message.channel.send(embed)
  }
}