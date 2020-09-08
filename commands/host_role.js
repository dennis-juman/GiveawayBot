module.exports = {
  name: 'hostrole',
  async execute (msg, args) {
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
