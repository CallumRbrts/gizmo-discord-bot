module.exports = {
  name: 'purge',
  description: 'Deletes a certain number of messages',
  userPermissions: ['MANAGE_MESSAGES'],
  execute(message, args) {
    // if(!message.member.roles.find(r => r.name === "Moderator")){
    //   return message.channel.send('You need the "Moderator" role to use this command. You will need to create the role or get someone to assign it for you.');
    // }else
    if(!args[1]){
      message.channel.bulkDelete(2);
    }
    else{
      message.channel.bulkDelete(args[1]);
    }
  }
}
