const Discord = require('discord.js');
const imageDir = './images/characters/';

// const embed = new Discord.RichEmbed()
//   .setColor('#3880ba')
//   .setTitle('Character selection:');

//change image without destroying embed -> try attaching every image file to the embed and edit between them -> to test
//update embed to look more consistent -> maybe add some variables on the same line -> also try and make things float to the right

module.exports = {
  showChar: async function showChar(message, args, results, currentUser, chosenChar, embed){
    //embedded message to be sent
    embed.setAuthor(currentUser.tag ,currentUser.avatarURL);
    embed.setDescription('**'+chosenChar.name+'** \u200b \u200b \u200b \u200b \u200b \u200b  \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b **Level: **'+ chosenChar.level + '\n **Rarity: **' + chosenChar.rarity + '\n **XP: **' + chosenChar.xp +'\n **Attack: **' + chosenChar.attack +'\n **Defence: **' + chosenChar.defence + '\n **Luck: **' + chosenChar.luck + '\n **Speed: **' + chosenChar.speed);
    //embed.addField("**Rarity: **" + chosenChar.rarity, true);
    embed.setFooter('Owned by: ' + currentUser.username + '\t \t \t' + (args[1]+1) + '/' + results.length);
    embed.attachFile(imageDir+chosenChar.imageURL);
    let attach = chosenChar.imageURL.split("/");
    embed.setImage('attachment://'+attach[attach.length -1]);

    message.channel.send(embed)
      .then(async sent => {
        //react to the message
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
