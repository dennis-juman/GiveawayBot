module.exports = {
  name: 'prefix',
  async execute (msg, args) {
    await msg.client.prefix.set(msg.guild.id, args[0])
    msg.reply(`Prefix changed to \`${args[0]}\`.`)
  }
}
