import axios from 'axios'

const cheerio = require('cheerio')

const LODESTONE_BASE_URI = 'https://na.finalfantasyxiv.com'

export interface LodestonePlayerCharacter {
  link?: string
  face_image_url?: string
  main_image_url?: string
  class_icon_url?: string
  level?: number
}

export default class LodestoneService {
  client = axios
  cheerio = cheerio

  findPC = async (world: string, firstName: string, lastName: string): Promise<LodestonePlayerCharacter> => {
    const search = await this.getDOM(`/lodestone/character/?q=${firstName}+${lastName}&worldname=${world}`)

    const pc: LodestonePlayerCharacter = {}

    let link = null
    search('.entry').each((i, element) => {
      if (search(element).find('.entry__name').html() == `${firstName} ${lastName}`) {
        link = search(element).find('.entry__link').attr('href')
      }
    })
    
    pc.link = LODESTONE_BASE_URI + link

    const profile = await this.getDOM(link)

    pc.face_image_url = profile('.frame__chara__face img').attr('src')
    pc.main_image_url = profile('.character__detail__image a').attr('href')
    pc.level = profile('.character__class__data p').first().html().replace( /^\D+/g, '')
    pc.class_icon_url = profile('.character__class_icon img').attr('src')

    return pc
  }

  getDOM = async (uri: string) => {
    const response = await this.get(uri)

    if (response.status !== 200) {
      throw new Error(`Unexpected response from Lodestone (received status code ${response.status})`)
    }

    let html = response.data
    return cheerio.load(html)
  }

  get = (uri: string) => {
    return this.client.get(LODESTONE_BASE_URI + uri)
  }
}