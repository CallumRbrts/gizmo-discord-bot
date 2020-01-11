module.exports = {
  name: 'cc',
  description: 'Choose a character to gain xp',
  async execute(message, args, keyvUsers) {
    let author = message.author.toString();
    let results = "";
    let userID = message.member.user.id;
    if(args[1] == null){
      results = await keyvUsers.get(userID);
      if(!results){
        return message.channel.send(author+' you do not have any characters to choose!');
      }
      if(results["ChosenCharacter"] == null){
        return message.channel.send(author+ ' you don\'t have a chosen character yet');
      }
      //make this into an embed
      return message.channel.send(author+ ' your current chosen character is ' + results["ChosenCharacter"].name);
    }
    args[1] = Number(args[1]);
    if(isNaN(args[1])){
      return message.channel.send(author + ' please specify a character position');
    }
    results = await keyvUsers.get(userID);
    if(!results){
      return message.channel.send(author+' you do not have any characters to show!');
    }
    let charList = results["Characters"];
    //sort the list so that the user doesn't have to lc beforehand
    let index = args[1]-1;
    if(index > charList.size){
      return message.channel.send(author + ' you need to choose a valid character');
    }
    let cc = charList.slice(index, 1);
    cc = cc[0];
    results["ChosenCharacter"] = cc;
    console.log(results);
    await keyvUsers.set(userID,results);
    return message.channel.send(cc.name + ' was successfully chosen');

    //need to check if character hasn't been deleted

  }
}
