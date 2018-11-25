import { Message, RichEmbed } from 'discord.js'

import LodestoneService, { LodestonePlayerCharacter } from '../../Services/Lodestone'

export default class XIVCommandHandler {
  public static async lookupPC (args: Array<string>, message: Message) {
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

  public static async lookupFC (args: Array<string>, message: Message) {
    message.channel.send('Not implemented yet.')
  }
}