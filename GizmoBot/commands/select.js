const Discord = require('discord.js');
const imageDir = './images/characters/';

module.exports = {
  name: 'select',
  description: 'Displays information about a selected character',
  async execute(message, args, keyvUsers, prefix, bot) {
    if(args[1] == null){
      return message.channel.send('Please specify a character position to view information. !select <number>');
    }
    let userID = message.member.user.id;
    let results = await keyvUsers.get(userID);
    if(!results){
      return message.channel.send('You do not have any characters to display');
    }
    if(args[1] > results.length){
      return message.channel.send(message.author.toString() + ' please specify a valid character position');
    }
    let chosenChar = results[args[1]-1];
    let currentUser = bot.users.get(userID);
    let embed = new Discord.RichEmbed()
      .setColor('#3880ba')
      .setAuthor(currentUser.tag ,currentUser.avatarURL)
      .setTitle('Character selection:')
      .setDescription('**'+chosenChar.name+'**')
      .attachFile(imageDir+chosenChar.imageURL)
      .setFooter('Owned by: ' + currentUser.username)
      .setImage('attachment://'+chosenChar.imageURL);
    return message.channel.send(embed);
  }
}
