module.exports = {
  name: 'hint',
  description: 'Gives the first letter of name from the latest guild character' ,
  execute(message, args, guildImage, FILECOLLECTION) {
    if(!FILECOLLECTION[guildImage]){
      return message.channel.send('No character to give a hint about!');
    }
    let charName = FILECOLLECTION[guildImage];
    console.log(charName);
    charName = charName.charAt(0).toUpperCase();
    console.log(charName);
    message.channel.send('The first letter of the character\'s name is ' + charName);
  }
}
