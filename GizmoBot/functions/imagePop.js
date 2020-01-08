const Discord = require('discord.js');

module.exports = {
  spawnImage: function (message, prefix, CHANCE, FILEDIRS, NBFILES, dir ) {
    let pop = Math.random();
    console.log(FILEDIRS);
  	//chance to send a random image of a game character
  	if(pop < CHANCE){
  	 let imageNumber = Math.floor (Math.random() * (NBFILES - 1 + 1));
  		let name = FILEDIRS[imageNumber].substring(0, FILEDIRS[imageNumber].indexOf('.'));
  		name = name.charAt(0).toUpperCase() + name.slice(1);
      let attach = FILEDIRS[imageNumber].split("/");
      //embed message to be sent
  		let embed = new Discord.RichEmbed()
  			.setColor('#3880ba')
  			.setTitle('New character has been discovered!')
  			.attachFiles([dir+'/'+FILEDIRS[imageNumber]])
  			.setDescription('Type '+prefix+'get <character> to guess the \n character\'s name!' )
  			.setImage('attachment://'+attach[attach.length - 1]);
  		message.channel.send(embed);
  		return FILEDIRS[imageNumber];
  	}
 }
};
