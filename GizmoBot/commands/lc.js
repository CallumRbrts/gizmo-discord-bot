const Discord = require('discord.js');
const sortMode = require('../functions/sortMode.js');

module.exports = {
  name: 'lc',
  description: 'Lists characters - !lc [@username]',
  async execute(message, args, keyvSort, keyvUsers, prefix, bot) {
    let userID = message.member.user.id;
    var res = "";
    if(args[1] == null){
      res = await keyvUsers.get(userID);
      if(!res){
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
    let sort = res["Order"];
    //specify the character list
    let chars = res["Characters"];
    //gets targeted user for the command
    let currentUser = bot.users.get(userID);
    let embed = new Discord.RichEmbed()
      .setColor('#3880ba')
      .setAuthor(currentUser.tag ,currentUser.avatarURL)
      .setTitle('Your game characters:');
    //creates message for the embed field

    if(!sort){
      chars = sortMode.default(chars);
    }else{
      switch (sort[0]) {
        case 'default':
          chars = sortMode.default(chars, sort[1]);
          break;
        case 'alphabetical':
          chars = sortMode.alphabetical(chars, sort[1]);
          break;
        case 'date':
          chars = sortMode.date(chars, sort[1]);
          break;
      }
    }
    res["Characters"] = chars;
    await keyvUsers.set(userID, res);
    msg = sortMode.createMsg(chars);
    embed.addField("Sorted by: " + sort[0].charAt(0).toUpperCase()+sort[0].slice(1),msg);
    return message.channel.send(embed);
  }
}
