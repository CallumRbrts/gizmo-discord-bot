const onlySpecialCharsRegex = /[^a-zA-Z0-9]+$/;

module.exports = {
  name: 'prefix',
  description: 'Change the prefix',
  guildOnly: true,
  userPermissions: ['MANAGE_MESSAGES'],
  async execute(message, args, PREFIX, keyvPrefixes) {
      //if there is no second argument
      if(!args[1]){
       //gets the guild prefix from database
       let get = await keyvPrefixes.get(message.guild.id);
       //if not null
       if(get){
         return message.channel.send('Prefix is currently "' + get + '"' );
       }
        return message.channel.send('Prefix is currently "' + PREFIX + '"' );
      // }else if(!message.member.roles.find(r => r.name === "Moderator")){
      //    message.channel.send('You need the "Moderator" role to use this command. You will need to create the role or get someone to assign it for you.');
      }else if(!onlySpecialCharsRegex.test(args[1])){
         message.reply('The last character of the prefix should be a special character (!,#,?...)')
      }else{
        //sets the guild prefix in the database
        await keyvPrefixes.set(message.guild.id, args[1]);
        return message.channel.send('Prefix has been changed to "'+args[1]+'"');
      }
  }
}
