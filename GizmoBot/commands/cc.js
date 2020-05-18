const Discord = require('discord.js');
const imageDir = './images/characters/';

module.exports = {
  name: 'cc',
  description: 'Choose a character to gain xp',
  async execute(message, args, keyvUsers, prefix, bot) {
    let author = message.author.toString();
    let results = "";
    let userID = message.member.user.id;
    if(args[1] == null){
      results = await keyvUsers.get(userID);
      if(!results || results["Characters"].length <= 0){
        return message.channel.send(author+' you do not have any characters to choose!');
      }
      if(results["ChosenCharacter"] == null){
        return message.channel.send(author+ ' you don\'t have a chosen character yet');
      }
      //make this into an embed
      let selectedCharacter = results["Characters"].find(x => x.id == results["ChosenCharacter"]);
      let currentUser = bot.users.get(userID);
      let attach = selectedCharacter.imageURL.split("/");
      let embed = new Discord.RichEmbed()
        .setColor('#3880ba')
        .setTitle('Current Character:')
        .setAuthor(currentUser.tag, currentUser.avatarURL)
        .setDescription('**'+selectedCharacter.name+'**\n' + '**Rarity: **' + selectedCharacter.rarity + '\n **Level: **' + selectedCharacter.level + '\n**XP: **' + selectedCharacter.xp + '\n **Attack: **' + selectedCharacter.attack)
        .setFooter('Owned by: '+ currentUser.username)
        .attachFile(imageDir+selectedCharacter.imageURL)
        .setImage('attachment://'+attach[attach.length -1]);
      return message.channel.send(embed);
      //return message.channel.send(author+ ' your current chosen character is ' + results["ChosenCharacter"]);
    }
    args[1] = Number(args[1]);
    if(isNaN(args[1])){
      return message.channel.send(author + ' please specify a character position');
    }
    //add at beginning
    results = await keyvUsers.get(userID);
    if(!results){
      return message.channel.send(author+' you do not have any characters to show!');
    }
    let charList = results["Characters"];
    console.log(charList);
    //sort the list so that the user doesn't have to lc beforehand
    let index = args[1]-1;
    if(args[1] > charList.length){
      return message.channel.send(author + ' you need to choose a valid character');
    }
    //add the id of the character rather than the whole object
    results["ChosenCharacter"] = charList[index].id;
    console.log(results);
    await keyvUsers.set(userID,results);
    return message.channel.send(charList[index].name + ' was successfully chosen');

    //need to check if character hasn't been deleted

  }
}
