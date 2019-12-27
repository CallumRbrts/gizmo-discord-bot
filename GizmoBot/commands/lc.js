const Discord = require('discord.js');

module.exports = {
  name: 'lc',
  description: 'Lists characters',
  async execute(message, args, keyvUsers) {
    let userID = message.member.user.tag;
    if(args[1] == null){
      let res = await keyvUsers.get(userID);
      let msg = "";
      let embed = new Discord.RichEmbed()
        .setColor('#3880ba')
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setTitle('Your game characters:');
      for(let i = 0; i < res.length; i++){
        msg += res[i] + '\n';
      //  embed.addField(name='**'+res[i]+'**',value="\u200b");

      }
      embed.addField("Sorted by : nothing rn",'**'+msg+'**');
      message.channel.send(embed);
    }
  }
}
