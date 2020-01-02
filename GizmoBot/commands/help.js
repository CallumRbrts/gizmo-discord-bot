const Discord = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Sends StackOverflow link',
  execute(message, COMMANDS, prefix) {
    var embed = new Discord.RichEmbed()
      .setColor('#3880ba')
      .setTitle('Command list:');
    for(let i = 0; i < COMMANDS.length; i++){
      if(i % 25 === 0 && i !== 0){
        message.author.send(embed);
        embed = new Discord.RichEmbed()
          .setColor('#3880ba');
      }
      embed.addField('**'+prefix+COMMANDS[i].name + '** : ', COMMANDS[i].description);
    }
    message.author.send(embed);
  }
}
