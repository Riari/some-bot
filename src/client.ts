import { Client } from 'discord.js'

const client = new Client

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
})

client.login(process.env.SOME_BOT_DISCORD_AUTH_TOKEN)

export default client