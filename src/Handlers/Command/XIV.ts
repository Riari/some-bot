import { Message, RichEmbed } from 'discord.js'
import axios from 'axios'

const cheerio = require('cheerio')

import CommandHandler from '../Command'

export const XIV_SUBCOMMANDS = {
  lookup: {
    description: 'Perform a lookup via Lodestone.',
    args: {
      pc: {
        minArgs: 3,
        description: 'Look up a player character',
        usage: 'pc <world> <first name> <last name>'
      }
    }
  }
}

const LODESTONE_BASE_URI = 'https://na.finalfantasyxiv.com'

export default class XIVCommandHandler extends CommandHandler {
  subcommands = XIV_SUBCOMMANDS

  handle = (args: Array<string>, message: Message) => {
    const subcommand = args.shift()

    switch (subcommand) {
      case 'lookup':
        return this.lookup(args, message)
      case 'help':
      case '?':
        if (args[0]) {
          return this.helpForSubcommand(message, args[0])
        }
        return this.help(message)
      default:
        throw new Error('Unrecognised subcommand. Type "/xiv help" for a list of available subcommands.')
    }
  }

  help = (message: Message) => {
    const embed = new RichEmbed

    embed.setTitle('/xiv <subcommand>')
    embed.setDescription('Final Fantasy XIV stuff. Available subcommands:')
    
    for (var command in this.subcommands) {
      embed.addField(command, this.subcommands[command].description)
    }

    message.channel.send(embed)
  }

  helpForSubcommand = (message: Message, subcommand: string) => {
    const embed = new RichEmbed

    if (!this.subcommands[subcommand]) {
      throw new Error('Unrecognised subcommand. Type "/xiv help" for a list of available subcommands.')
    }

    const command = this.subcommands[subcommand]

    embed.setDescription(`${command.description} Arguments:`)

    for (var arg in command.args) {
      const details = command.args[arg]
      embed.addField(`${arg} (${details.description})`, `Usage: /xiv ${subcommand} ${details.usage}`)
    }

    message.channel.send(embed)
  }

  lookup = (args: Array<string>, message: Message) => {
    const type = args.shift()

    if (args.length < this.subcommands.lookup.args[type].minArgs) {
      throw new Error(`Invalid usage. Type "/xiv help ${type} for details.`)
    }

    switch (type) {
      case 'pc':
        return this.lookupPC(args, message)
      default:
        throw new Error(`Lookup type "${type}" is unknown.`)
    }
  }

  lookupPC = (args: Array<string>, message: Message) => {
    const world = args[0]
    const firstName = args[1]
    const lastName = args[2]

    axios.get(LODESTONE_BASE_URI + `/lodestone/character/?q=${firstName}+${lastName}&worldname=${world}`)
      .then(response => {
        if (response.status !== 200) {
          throw new Error(`Unexpected response from Lodestone (received status code ${response.status})`)
        }

        let html = response.data
        let $ = cheerio.load(html)

        const pcLink = LODESTONE_BASE_URI + $('a.entry__link').first().attr('href')

        axios.get(pcLink)
          .then(response => {
            if (response.status !== 200) {
              throw new Error(`Unexpected response from Lodestone (received status code ${response.status})`)
            }

            let html = response.data
            let $ = cheerio.load(html)

            const faceImageURL = $('.frame__chara__face img').attr('src')
            const mainImageURL = $('.character__detail__image a').attr('href')
            const levelString = $('.character__class__data p').first().html()
            const classIcon = $('.character__class_icon img').attr('src')

            const embed = new RichEmbed

            embed.setAuthor(`${firstName} ${lastName}`, faceImageURL, pcLink)
            embed.setThumbnail(classIcon)
            embed.setImage(mainImageURL)
            embed.setURL(pcLink)
            embed.setDescription(levelString + ' thingy')
            
            message.channel.send(embed)
          })
      })
  }
}
