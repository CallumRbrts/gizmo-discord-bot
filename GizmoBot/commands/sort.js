const sortMode = require('../functions/sortMode.js');

module.exports = {
  name: 'sort',
  description: 'Allows to choose a sorting option for the !lc command',
  async execute(message, args, key) {
    let author = message.author.toString();
    let userID = message.member.user.id;
    let results = await key.get(userID);
    console.log(results);
    if(!results || !results["Characters"]){
      return message.channel.send(author + ' you have no list to sort');
    }
    if(args[1] == null){
      console.log(results);
      return message.channel.send(author + ' your current sorting method is \"' + results.Order[0]+ '\"');
    }
    let order = [];
    args[1] = args[1].toLowerCase();
    switch(args[1]){
      case 'alphabetical':
      case 'date':
      case 'power':
      case 'default':
        if(args[2] != null){
          if(args[2] == 'desc'){
            order.push(args[1]);
            order.push(true);
          }else {
            order.push(args[1]);
            order.push(false);
          }
        }else{
          order.push(args[1]);
          order.push(false);
        }
        results["Order"] = order;
        let chars = results["Characters"];
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
        results["Characters"] = chars;
        await key.set(userID, results);
        if(order[1] == true){
          return message.channel.send(author + ' The sorting method has successfully been changed to \"' + args[1]+ '\" in descending order');
        }else{
          return message.channel.send(author + ' The sorting method has successfully been changed to \"' + args[1]+ '\" in ascending order');
        }
        break;
      default:
        return message.channel.send('This sorting method doesn\'t exist - !sort <alphabetical | date | default | power> [desc]');
    }
  }
}
