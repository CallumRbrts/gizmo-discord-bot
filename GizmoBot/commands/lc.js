const Discord = require('discord.js');

module.exports = {
  name: 'lc',
  description: 'Lists characters',
  async execute(message, args, keyvUsers, prefix) {
    let userID = message.member.user.id;
    var res = "";
    if(args[1] == null){
      res = await keyvUsers.get(userID);
    }else{
      //need to cut off the addon's that pinging someone adds
      let format = args[1].slice(2);
      format = format.slice(prefix.length);
      format = format.substring(0, format.length-1);
      res = await keyvUsers.get(format);
    }
    if(!res){
      return message.channel.send(message.author.toString()+' this user hasn\'t captured anything yet')
    }
    //add error if they haven't got anything
    console.log(res);
    let msg = "";
    let embed = new Discord.RichEmbed()
      .setColor('#3880ba')
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setTitle('Your game characters:');
    for(let i = 0; i < res.length; i++){
      msg += i+1 +'. **'+ res[i] + '**\n';
      //  embed.addField(name='**'+res[i]+'**',value="\u200b");
      }
    embed.addField("Sorted by : nothing rn",msg);
    message.channel.send(embed);
  }
}
