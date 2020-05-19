const sortMode = require('../functions/sortMode.js');
const factory = require('../functions/factory.js');

module.exports = {
  name: 'get',
  description: 'Guess the character that spawned - !get <guess>',
  guildOnly: true,
  async execute(message, args, guildImage, FILECOLLECTION, keyvUsers, CHARCOLLECTION){
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
      let results = {};
      let userID = message.member.user.id;
      results = await keyvUsers.get(userID);
      if(!results){
        results = {};
        results["Characters"] = [];
        results["Order"] = ["default", false];
      }
      var obj = factory.createObject(results["Characters"].length, CHARCOLLECTION, charName, guildImage);
      console.log(obj);
      results["Characters"].push(obj);
      let order = results["Order"];
      //sort
      let chars = results["Characters"];
      if(!order){
        chars = sortMode.default(chars);
      }else{
        switch (order[0]) {
          case 'default':
            chars = sortMode.default(chars, order[1]);
            break;
          case 'alphabetical':
            chars = sortMode.alphabetical(chars, order[1]);
            break;
          case 'date':
            chars = sortMode.date(chars, order[1]);
            break;
        }
      }
      results["Characters"] = chars;
      await keyvUsers.set(userID, results);
      return true;
    }else{
      message.channel.send('Wrong Answer!');
      return false;
    }
   }
   return false;
  }
}
