module.exports = {
  name: 'channel',
  async execute (msg, args) {
    // Search for channel in Discord cache.
    const arg = args[0].match(/[0-9]+/).shift()
    const channel = msg.client.channels.cache.find(channel => channel.id === arg)

    // Stop the code if channel is has not been found.
    if (!channel) return msg.channel.send(`That's not a valid channel ${msg.author.username}.`)

    // Store channel ID with Keyv into the SQLite DB.
    await msg.client.channel.set(msg.guild.id, channel.id)
    msg.channel.send(`Default channel has been set to ${args[0]}.`)
  }
}
