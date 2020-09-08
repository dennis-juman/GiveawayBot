const { Message } = require('discord.js')
const channel = require('./channel')

const questions = [
  {
    question: 'Do you want to change the default prefix?\n(`!`/`skip`)',
    type: 'prefix'
  },
  {
    question: 'Do you want to set up a role that can access the bot\'s configuration?.\n(`@role`/`skip`)',
    type: 'role'
  },
  {
    question: 'Do you want to set up a default giveaway channel?\n(`#channel`/`skip`)',
    type: 'channel'
  },
  {
    question: 'Do you want to set up a host role?\n(`@role`/`skip`)',
    type: 'role'
  }
]

module.exports = {
  name: 'setup',
  execute (msg, args) {
    msg.channel.send('What would you like your bot prefix to be?')
      .then(() => {
        const filter = response => response.author.id === msg.author.id
        return msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
      })
      .then(response => {
        if (['abort', 'stop', 'exit', 'quit', 'cancel'].includes(response.first().content.toLowerCase())) throw new Error()

        // Skip to next step if user doesn't wants to skip to the next question and abort if argument equals to something inside of the array.
        if (['skip', 'next'].includes(response.first().content.toLowerCase())) return

        // Continue setup, set prefix into Keyv value store
        msg.client.prefix.set(msg.guild.id, response.first().content)
        return msg.reply(` prefix has been set to \`${response.first().content}\`.`)
      })
      .catch((err) => {
        msg.reply(' setup has been aborted.')
        console.error(err)
      })
  }
}
