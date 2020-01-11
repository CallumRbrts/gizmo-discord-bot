const Discord = require('discord.js');

module.exports = {
  name: 'delc',
  description: 'Delete a character from your character list - !delc <position>',
  async execute(message, args, keyvUsers, prefix) {
    //gets id of message sender
    let userID = message.member.user.id;
    //converts the argument to a number
    args[1] = Number(args[1]);
    if(args[1] == null || isNaN(args[1])){
      return message.channel.send(message.author.toString() + ' please specify a character position you want to delete');
    }else{
      //gets user from database
      var res = await keyvUsers.get(userID);
      if(!res){
        return message.channel.send(message.author.toString() + ' you have no characters to delete!');
      }
      let list = res["Characters"];
      if(args[1]-1 > list.size){
        return message.channel.send(message.author.toString() + ' you need to choose a valid character to delete');
      }else{
        //shifts index because the user choses a character from a display list starting at 1
        let index = args[1]-1;
        //use splice to delete the specified argument from list and place it in a new array
        let del = list.splice(index, 1);
        message.channel.send(message.author.toString() + ' are you sure you want to delete ' + del[0].name+'? !accept or !deny');
        //waits 10 seconds for users answer
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {time:10000});
        collector.on('collect', async function(message){
          if(message.content.toLowerCase() == prefix+"accept"){
            if(res["ChosenCharacter"].id === del[0].id){
              res["ChosenCharacter"] = null;
            }
            //sets the new deleted list
            res["Characters"] = list;
            await keyvUsers.set(userID, res);
            console.log(res);
            return message.channel.send('Character successfully deleted '+del[0].name+'!');
          }else if(message.content.toLowerCase() == prefix+"deny"){
            message.channel.send('Aborted!');
            return;
          }
        });
      }
    }
  }
}
