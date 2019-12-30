const Discord = require('discord.js');
var imageChange = require('../functions/imageChange.js');


module.exports = {
  name: 'select',
  description: 'Displays information about a selected character',
  async execute(message, args, keyvUsers, prefix, bot) {
    let userID = message.member.user.id;
    let author = message.author.toString();
    var results = "";
    if(args[1] == null){
      return message.channel.send('Please specify a character position to view information. !select <number>');
    }
    if(args[2] == null){
       results = await keyvUsers.get(userID);
       if(!results){
         return message.channel.send(author+' you do not have any characters to display');
       }
    }else{
      let format = args[2].slice(2);
      format = format.slice(prefix.length);
      format = format.substring(0, format.length-1);
      userID = format;
      try{
        bot.users.get(userID).id;
      }
      catch(err){
        return message.channel.send('This user doesn\'t exist');
      }
      results = await keyvUsers.get(format);
      if(!results){
        return message.channel.send(author+' this user hasn\'t captured anything yet');
      }
    }

    if(args[1] > results.length){
      return message.channel.send(author + ' please specify a valid character position');
    }
    let chosenChar = results[args[1]-1];
    //targeted user
    let currentUser = bot.users.get(userID);
    imageChange.showChar(message, args, results, currentUser, chosenChar);
    }

}
