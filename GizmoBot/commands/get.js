
module.exports = {
  name: 'get',
  description: 'Guess the character that spawned',
  async execute(message, args, guildImage, FILECOLLECTION){
    if(guildImage === ""){
      message.channel.send('A character hasn\'t spawned yet')
    }else{
    let guess = args[1].toLowerCase()+'.png';
    if(guess === guildImage){
      let charName = args[1].charAt(0).toUpperCase() + args[1].slice(1);
      message.reply(' you have successfully caught ' + charName)
      return true;
    }else{
      message.channel.send('Wrong Answer!')
    }
   }
  }
}
