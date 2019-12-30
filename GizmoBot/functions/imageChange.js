const Discord = require('discord.js');
const imageDir = './images/characters/';


module.exports = {
  showChar: function showChar(message, args, results, currentUser, chosenChar){
    //embedded message to be sent
    let embed = new Discord.RichEmbed()
      .setColor('#3880ba')
      .setAuthor(currentUser.tag ,currentUser.avatarURL)
      .setTitle('Character selection:')
      .setDescription('**'+chosenChar.name+'**')
      .attachFile(imageDir+chosenChar.imageURL)
      .setFooter('Owned by: ' + currentUser.username)
      .setImage('attachment://'+chosenChar.imageURL);

    message.channel.send(embed)
      .then(async sent => {
        await sent.react("◀️")
        await sent.react("▶️")
        //sent.react("▶️"); // 'sent' is that message you just sent
        const lFilter = (reaction, user) => reaction.emoji.name === '◀️' && user.id === message.author.id;
        const rFilter = (reaction, user) => reaction.emoji.name === '▶️' && user.id === message.author.id;

        const lCollector = new Discord.ReactionCollector(sent, lFilter, {max:1});
        const rCollector = new Discord.ReactionCollector(sent, rFilter, {max:1});

        //const collector = yeet.createReactionCollector(filter, { time: 15000 });
        lCollector.on('collect', async () => {
          rCollector.stop();
          message.channel.send('Left');
          //code to be added
        });
        rCollector.on('collect', async () => {
          lCollector.stop();
          message.channel.send('Right');
          //code to be added
        });

        lCollector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
      });
  }
}
