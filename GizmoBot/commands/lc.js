const Discord = require('discord.js');

module.exports = {
  name: 'lc',
  description: 'Lists characters - !lc [@username]',
  async execute(message, args, keyvUsers, prefix, bot) {
    let userID = message.member.user.id;
    var res = "";
    if(args[1] == null){
      res = await keyvUsers.get(userID);
      if(res.length==0){
        return message.channel.send(message.author.toString()+' you do not have any characters to show!');
      }
    }else{
      //cuts off the addon's that pinging someone adds
      let format = args[1].slice(2);
      format = format.slice(prefix.length);
      format = format.substring(0, format.length-1);
      userID = format;
      //test if the entered argument is a user
      try{
        bot.users.get(userID).id;
      }
      catch(err){
        return message.channel.send('This user doesn\'t exist');
      }
      //gets user from database
      res = await keyvUsers.get(format);
      if(!res){
        return message.channel.send(message.author.toString()+' this user hasn\'t captured anything yet');
      }
    }

    let msg = "";
    //gets targeted user for the command
    let currentUser = bot.users.get(userID);
    let embed = new Discord.RichEmbed()
      .setColor('#3880ba')
      .setAuthor(currentUser.tag ,currentUser.avatarURL)
      .setTitle('Your game characters:');
    //creates message for the embed field
    for(let i = 0; i < res.length; i++){
      //need to change this as a field cannot exceed 256 characters
      msg += i+1 +'. **'+ res[i].name + '**\n';
    }
    embed.addField("Sorted by : catch order",msg);
    return message.channel.send(embed);
  }
}
