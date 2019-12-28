const character = require('../objects/character.js');

module.exports = {
  name: 'get',
  description: 'Guess the character that spawned',
  guildOnly: true,
  async execute(message, args, guildImage, FILECOLLECTION, keyvUsers){
    if(guildImage === ""){
     return message.channel.send('A character hasn\'t spawned yet');
    }else{
    let charName = "";
    for(let i = 1; i < args.length; i++){
      charName += args[i].charAt(0).toUpperCase() + args[i].slice(1).toLowerCase() + " ";
    }
    charName = charName.substring(0, charName.length - 1);
    if(FILECOLLECTION[guildImage] === charName){

      message.channel.send(message.author.toString() + ' has have successfully caught ' + charName);
      let results = new Array();
      let userID = message.member.user.id;
      results = await keyvUsers.get(userID);
      if(!results){
        results = new Array();
      }
      let today = new Date();
      let date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let dateTime = date+' '+time;
      let obj = {
        name:charName,
        imageURL:guildImage,
        dateCaptured:dateTime
      }
      console.log(obj.dateCaptured);
      results.push(obj);
      await keyvUsers.set(userID, results);
      console.log(results);

      // list = await keyvUsers.get(userID);
      // message.channel.send('List of '+userID+'\'s chars: \n' + list);
      return true;
    }else{
      message.channel.send('Wrong Answer!');
      return false;
    }
   }
   return false;
  }
}
