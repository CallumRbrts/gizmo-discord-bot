const Discord = require('discord.js');
const imageDir = './images/characters/';

// const embed = new Discord.RichEmbed()
//   .setColor('#3880ba')
//   .setTitle('Character selection:');

module.exports = {
  showChar: async function showChar(message, args, results, currentUser, chosenChar, embed){
    //embedded message to be sent

    embed.setAuthor(currentUser.tag ,currentUser.avatarURL);
    embed.setDescription('**'+chosenChar.name+'**');
    embed.setFooter('Owned by: ' + currentUser.username + '\t \t \t' + (args[1]+1) + '/' + results.length);
    embed.attachFile(imageDir+chosenChar.imageURL)
    embed.setImage('attachment://'+chosenChar.imageURL);

    message.channel.send(embed)
      .then(async sent => {
        //react to th message
        await sent.react("◀️")
        await sent.react("▶️")
        //create a filter for the left and right collector
        const lFilter = (reaction, user) => reaction.emoji.name === '◀️' && user.id === message.author.id;
        const rFilter = (reaction, user) => reaction.emoji.name === '▶️' && user.id === message.author.id;
        //declare a collector for the left and right arrow reactions
        const lCollector = new Discord.ReactionCollector(sent, lFilter, {max:1, time: 40000});
        const rCollector = new Discord.ReactionCollector(sent, rFilter, {max:1, time: 40000});
        lCollector.on('collect', async () => {
          //stop other collectors
          rCollector.stop();
          lCollector.stop();
          //if we hit the first item of the list jump to last item
          if(args[1] === 0){
            args[1] = results.length - 1;
            console.log(args);
          }else{
            args[1] = args[1] - 1;
            console.log(args);
          }
          let newChar = results[args[1]];
          let newEmbed = new Discord.RichEmbed({
            color: embed.color,
            title: embed.title
          });
          sent.edit(message.channel.bulkDelete(1));
          return sent.edit(showChar(message, args, results, currentUser, results[args[1]], newEmbed));
        });

        rCollector.on('collect', async () => {
          lCollector.stop();
          rCollector.stop();
          //if we hit the last item jump to the first
          if(args[1] === results.length - 1){
            args[1] = 0;
          }else {
            args[1] = args[1] + 1;
          }
          let newChar = results[args[1]];
          let newEmbed = new Discord.RichEmbed({
            color: embed.color,
            title: embed.title
          });
          sent.edit(message.channel.bulkDelete(1));
          return sent.edit(showChar(message, args, results, currentUser, results[args[1]], newEmbed));
        });

        lCollector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
        rCollector.on('collect', r => console.log(`Collected ${r.emoji.name}`));

      })

  }
}
