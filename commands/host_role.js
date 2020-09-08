module.exports = {
  name: 'hostrole',
  async execute (msg, args) {
    // Check if a default host role already exists in the database.
    if (!args.length) {
      return msg.client.hostRole.get(msg.guild.id)
        .then((roleId) => {
          const role = msg.guild.roles.cache.get(roleId)
          if (!role) throw new Error()
          msg.reply(` the host role configured for this server is the ${role} role.`)
        })
        .catch(() => msg.reply('An error occured retreiving the host role information.'))
    }

    // Search for role in Discord cache.
    const arg = args[0].match(/[0-9]+/).shift()
    const role = msg.guild.roles.cache.find(role => role.id === arg)

    // Stop the code if channel is has not been found.
    if (!role) return msg.channel.send(`That's not a valid role ${msg.author.username}.`)

    // Store role ID with Keyv into the SQLite DB.
    await msg.client.channel.set(msg.guild.id, role.id)
    msg.channel.send(`Default host role has been set to ${args[0]}.`)
  }
}
