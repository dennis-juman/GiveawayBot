module.exports = {
  name: 'setup',
  execute (msg, args) {
    msg.channel.send('Do you want to change the default prefix?\n(`!`/`skip`)')
      .then(() => {
        const filter = response => response.author.id === msg.author.id
        return msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
      })
      .then(response => {
        if (['abort', 'stop', 'exit', 'quit', 'cancel'].includes(response.first().content.toLowerCase())) throw new Error()

        // Skip to next step if user doesn't wants to skip to the next question.
        if (['skip', 'next'].includes(response.first().content.toLowerCase())) return response

        // Continue setup, set prefix into Keyv value store
        msg.client.prefix.set(msg.guild.id, response.first().content)
        return msg.reply(` prefix has been set to \`${response.first().content}\`.`)
      })
      .then(() => {
        // Ask the next question
        return msg.channel.send('Do you want to set up a host role?\n(`@role`/`skip`)')
      })
      .then(() => {
        // Filter and await answer to the question.
        const filter = response => response.author.id === msg.author.id
        return msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
      })
      .then(response => {
        // Set the role in the db
        if (['abort', 'stop', 'exit', 'quit', 'cancel'].includes(response.first().content.toLowerCase())) throw new Error()

        // Skip to next step if user doesn't wants to skip to the next question.
        if (['skip', 'next'].includes(response.first().content.toLowerCase())) return response

        if (response.first().mentions.roles.size) {
          msg.client.hostRole.set(msg.guild.id, response.first().mentions.roles.first().id)
          return msg.reply(` role has been set to ${response.first().mentions.roles.first()}.`)
        }
      })
      .then(() => {
        // Ask the next question
        return msg.channel.send('Do you want to set up a default giveaway channel?\n(`#channel`/`skip`)')
      })
      .then(() => {
        // Filter and await answer to the question.
        const filter = response => response.author.id === msg.author.id
        return msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
      })
      .then(response => {
        // Set the role in the db
        if (['abort', 'stop', 'exit', 'quit', 'cancel'].includes(response.first().content.toLowerCase())) throw new Error()

        // Skip to next step if user doesn't wants to skip to the next question.
        if (['skip', 'next'].includes(response.first().content.toLowerCase())) return response

        if (response.first().mentions.channels.size) {
          msg.client.channel.set(msg.guild.id, response.first().mentions.channels.first().id)
          return msg.reply(` channel has been set to ${response.first().mentions.channels.first()}.`)
        }
      })
      .then(() => {
        // Ask the next question
        return msg.channel.send('Do you want to set up a role that can access the bot\'s configuration?.\n(`@role`/`skip`)')
      })
      .then(() => {
        // Filter and await answer to the question.
        const filter = response => response.author.id === msg.author.id
        return msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
      })
      .then(response => {
        // Set the role in the db
        if (['abort', 'stop', 'exit', 'quit', 'cancel'].includes(response.first().content.toLowerCase())) throw new Error()

        // Skip to next step if user doesn't wants to skip to the next question.
        if (['skip', 'next'].includes(response.first().content.toLowerCase())) return response

        if (response.first().mentions.roles.size) {
          msg.client.adminRole.set(msg.guild.id, response.first().mentions.roles.first().id)
          return msg.reply(` administrator role has been set to ${response.first().mentions.roles.first()}.`)
        }
      })
      .then(() => msg.reply(' setup has been completed!'))
      .catch(() => {
        msg.reply(' setup has been aborted.')
      })
  }
}
