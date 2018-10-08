import { Message } from 'discord.js'
import axios from 'axios'
import cheerio from 'cheerio'

import CommandHandler from '../Command'

const LODESTONE_BASE_URI = 'https://na.finalfantasyxiv.com'

export default class XIVCommandHandler extends CommandHandler {
  handle = (args: Array<string>, message: Message) => {
    const subcommand = args.shift()

    switch (subcommand) {
      case 'lookup':
        if (args.length < 4) {
          throw new Error(`${subcommand} expects 4 arguments: <type> <first name> <last name>`)
        }

        return this.lookup(args, message)
    }
  }

  lookup = (args: Array<string>, message: Message) => {
    const type = args.shift()

    switch (type) {
      case 'pc':
        return this.lookupPC(args, message)
      default:
        throw new Error(`lookup type "${type}" is unknown`)
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

        const pcLink = $('a.entry__link').first().attr('href')

        axios.get(pcLink)
          .then(response => {
            if (response.status !== 200) {
              throw new Error(`Unexpected response from Lodestone (received status code ${response.status})`)
            }

            let html = response.data
            let $ = cheerio.load(html)

            const imageURL = $('.character__detail__image a').attr('href')

            message.channel.send(`Here's ${firstName}: ${imageURL}`)
          })
      })
  }
}
