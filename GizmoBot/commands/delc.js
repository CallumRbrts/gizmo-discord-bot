const Discord = require('discord.js');

module.exports = {
  name: 'delc',
  description: 'Delete a character from your character list',
  async execute(message, args, keyvUsers, prefix) {
    let userID = message.member.user.id;
    args[1] = Number(args[1]);
    if(args[1] == null || isNaN(args[1])){
      message.channel.send(message.author.toString() + ' please specify a character position you want to delete');
    }else{
      var res = await keyvUsers.get(userID);
      if(args[1]-1 > res.size){
        message.channel.send(message.author.toString() + ' you need to chose a valid character to delete');
      }else{
        //timer to do it with a "Are you sure?"
        let index = args[1]-1;
        let del = res.splice(index, 1);
        message.channel.send(message.author.toString() + ' are you sure you want to delete ' + del+'? !accept or !deny');
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {time:10000});
        collector.on('collect', async function(message){
          if(message.content.toLowerCase() == prefix+"accept"){
            await keyvUsers.set(userID, res);
            console.log(res);
            message.channel.send('Character successfully deleted '+del[0]+'!');
          }else if(message.content.toLowerCase() == prefix+"deny"){
            message.channel.send('Aborted!');
            return;
          }
        });
      }
    }
  }
}
