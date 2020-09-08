function checkForUserAbort (response) {
	if (
	  [
		'abort', 
		'stop', 
		'exit', 
		'quit', 
		'cancel', 
		'madamada',
	  ].includes(getFirst(response))
	) {
	  throw new Error("Aborted by user")
	}
  }
  
  function getFirst (response) {
	return response.first().content.toLowerCase();
  }
  
  function sameAuthor (message) {
	return response => message.author.id === response.author.id
  }
  
  class {
	execute (msg, args) {
	  msg.channel.send('What would you like your bot prefix to be?')
	  .then(() => {
		return msg.channel.awaitMessages(sameAuthor(msg), { max: 1, time: 60000, errors: ['time'] })
	  })
	  .then(response => {
		checkForUserAbort(response);
		
		// Skip to next step if user doesn't wants to skip to the next question and abort if argument equals to something inside of the array.
		if (['skip', 'next'].includes(getFirst(response))) return response
  
		// Continue setup, set prefix into Keyv value store
		const newPrefix = response.first().content
		msg.client.prefix.set(msg.guild.id, newPrefix)
		return msg.reply(`Prefix has been set to \`${newPrefix}\`.`)
	  })
	  .then(() => {
		return msg.channel.send('Do you want to set up a role that can access the bot\'s configuration?')
	  })
	  .then(response => {
		console.log(response.mentions.roles.size)
		return msg.channel.awaitMessages(sameAuthor(msg), { max: 1, time: 60000, errors: ['time'] })
	  })
	  .then(response => {
		checkForUserAbort(response);
		if (response.first().mentions.roles.size) {
		  console.log('works')
		}
		console.log('Didn\'t stop execution.')
	  })
	  .catch(() => {
		msg.reply(' setup has been aborted.')
	  })
	}
  }