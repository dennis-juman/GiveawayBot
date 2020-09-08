// Dependencies.
const Discord = require('discord.js')
const Sequelize = require('sequelize')
const Keyv = require('keyv')
const fs = require('fs')

// Discord bot.
const client = new Discord.Client()

// Object deconstruction.
const { token, defaultPrefix } = require('./config.json')

// Collections (similar to the JS Map object).
client.commands = new Discord.Collection()

// Keyv - used to store user bot setting preferences.
const storageAdapter = 'sqlite://database.sqlite3'
client.prefix = new Keyv(storageAdapter, { namespace: 'prefix' })
client.channel = new Keyv(storageAdapter, { namespace: 'channel' })
client.hostRole = new Keyv(storageAdapter, { namespace: 'hostRole' })

// Bot ready status.
client.once('ready', () => {
  console.log(`${client.user.tag} is ready!`)
})

// Store command files into commands collection for easy access.
const commandFilenames = fs.readdirSync('./commands/').filter(filename => filename.endsWith('.js'))
commandFilenames.forEach(filename => {
  const command = require(`./commands/${filename}`)
  client.commands.set(command.name, command)
})

// Log in.
client.login(token)

// Bot message listener.
client.on('message', async msg => {
  // Check if command starts with bot prefix.
  let prefix = defaultPrefix
  if (msg.channel.type === 'text') prefix = await client.prefix.get(msg.guild.id) || defaultPrefix
  if (msg.author.bot || !msg.content.startsWith(prefix)) return

  // Parsing string to arguments and command name.
  const args = msg.content.trim().slice(prefix.length).toLowerCase().split(/ +/)
  const commandName = args.shift()

  // Check if command exists.
  const command = client.commands.get(commandName)
  if (!command) return
  if (msg.channel.type === 'dm' && !command.dm) return msg.channel.send('This command is only allowed inside servers.')

  // Execute command.
  try {
    client.commands.get(commandName).execute(msg, args)
  } catch (err) {
    console.error('Error executing command.', err)
  }
})
