
module.exports = {
  name: 'get',
  description: 'Guess the character that spawned',
  async execute(message, args, guildImage, FILECOLLECTION){
    console.log(FILECOLLECTION[guildImage]);
    if(guildImage === ""){
      message.channel.send('A character hasn\'t spawned yet');
    }else{
    let charName = "";
    for(let i = 1; i < args.length; i++){
      charName += args[i].charAt(0).toUpperCase() + args[i].slice(1).toLowerCase() + " ";
    }
    charName = charName.substring(0, charName.length - 1);
    console.log(charName);
  //  charName = args[1].charAt(0).toUpperCase() + args[1].slice(1);
    if(FILECOLLECTION[guildImage] === charName){
      message.reply(' you have successfully caught ' + charName);
      return true;
    }else{
      message.channel.send('Wrong Answer!');
      return false;
    }
   }
   return false;
  }
}
