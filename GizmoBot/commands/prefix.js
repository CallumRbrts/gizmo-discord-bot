const onlySpecialCharsRegex = /[^a-zA-Z0-9]+$/;

module.exports = {
  name: 'prefix',
  description: 'Change the prefix',
  guildOnly: true,
  async execute(message, args, PREFIX, keyvPrefixes) {
      if(!args[1]){
       // message.channel.send('Prefix is currently "' + PREFIX + '"');
       let get = await keyvPrefixes.get(message.guild.id);
       if(get){
         return message.channel.send('Prefix is currently "' + get + '"' );
       }
        return message.channel.send('Prefix is currently "' + PREFIX + '"' );
      }else if(!message.member.roles.find(r => r.name === "Moderator")){
         message.channel.send('You need the "Moderator" role to use this command. You will need to create the role or get someone to assign it for you.');
      }else if(!onlySpecialCharsRegex.test(args[1])){
         message.reply('The last character of the prefix should be a special character (!,#,?...)')
      }else{
        //PREFIX = args[1];
        await keyvPrefixes.set(message.guild.id, args[1]);
        return message.channel.send('Prefix has been changed to "'+args[1]+'"');
        //message.channel.send('Prefix has been changed to "'+ PREFIX+'"');
        //return PREFIX;
      }
  }
}
