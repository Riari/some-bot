import { Message, RichEmbed } from 'discord.js'

import CommandHandler from '../Command'
import LodestoneService, { LodestonePlayerCharacter } from '../../Services/Lodestone'

export default class XIVCommandHandler extends CommandHandler {
  public static description = 'Final Fantasy XIV stuff.'
  public static subcommands = {
    lookup: {
      description: 'Perform a lookup via Lodestone.',
      args: {
        pc: {
          minArgs: 3,
          description: 'Look up a player character.',
          usage: 'pc <world> <first name> <last name>'
        },
        fc: {
          minArgs: 2,
          description: 'Look up a free company. (Not yet implemented)',
          usage: 'fc <world> <name>'
        }
      }
    }
  }

  handle = (args: Array<string>, message: Message) => {
    const subcommand = args.shift()

    if (!args.length) {
      throw new Error('No arguments supplied. Type "/help xiv" for a list of available subcommands.')
    }

    if (!XIVCommandHandler.subcommands[subcommand].args[args[0]]) {
      throw new Error(`Unrecognised argument '${args[0]}'. Type "/help xiv ${subcommand}" for a list of accepted arguments.`)
    }

    const minArgs = XIVCommandHandler.subcommands[subcommand].args[args[0]].minArgs

    if (args.length < minArgs) {
      throw new Error(`Expected ${minArgs} arguments. Type "/help xiv ${subcommand} for a list of accepted arguments.`)
    }

    switch (subcommand) {
      case 'lookup':
        return this.lookup(args, message)
      default:
        throw new Error('Unrecognised subcommand. Type "/help xiv" for a list of available subcommands.')
    }
  }

  lookup = (args: Array<string>, message: Message) => {
    const type = args.shift()

    if (!XIVCommandHandler.subcommands.lookup.args[type]) {
      throw new Error(`Lookup type "${type}" is unknown.`)
    }

    if (args.length < XIVCommandHandler.subcommands.lookup.args[type].minArgs) {
      throw new Error(`Invalid usage. Type "/xiv help ${type}" for details.`)
    }

    switch (type) {
      case 'pc':
        return this.lookupPC(args, message)
    }
  }

  lookupPC = async (args: Array<string>, message: Message): Promise<any> => {
    const world = args[0]
    const firstName = args[1]
    const lastName = args[2]
    
    const service = new LodestoneService

    const pc: LodestonePlayerCharacter = await service.findPC(world, firstName, lastName)

    const embed = new RichEmbed

    embed.setAuthor(`${firstName} ${lastName}`, pc.face_image_url, pc.link)
    embed.setThumbnail(pc.class_icon_url)
    embed.setImage(pc.main_image_url)
    embed.setURL(pc.link)
    embed.setDescription(`Level ${pc.level}`)
    
    message.channel.send(embed)
  }
}
