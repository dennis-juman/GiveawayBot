// Dependencies.
const Discord = require('discord.js')
const Sequelize = require('sequelize')
const fs = require('fs')

// Discord bot.
const client = new Discord.Client()

// Object deconstruction.
const { token, prefix } = require('./config.json')

// Collections (similar to the JS Map object).
client.commands = new Discord.Collection()

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
client.on('message', msg => {
  // Check who sent the message.
  if (msg.author.bot || !msg.content.startsWith(prefix)) return

  // Parsing string to arguments and command name.
  const args = msg.content.trim().slice(prefix.length).toLowerCase().split(/ +/)
  const commandName = args.shift()

  // Command handler.
  // Check if command exists.
  if (!client.commands.has(commandName)) return

  // Execute command.
  console.log(client.commands.get(commandName))
  client.commands.get(commandName).execute(msg, args)
})
