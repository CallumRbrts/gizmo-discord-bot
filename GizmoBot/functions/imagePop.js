const Discord = require('discord.js');

module.exports = {
  spawnImage: function (message, prefix, CHANCE, FILEDIRS, NBFILES, dir ) {
    let pop = Math.random();
  	//chance to send a random image of a game character
  	if(pop < CHANCE){
  		//message.channel.send('I am in');
  	 let imageNumber = Math.floor (Math.random() * (NBFILES - 1 + 1));
  		//Next create a data structure with the file dir,
  		let name = FILEDIRS[imageNumber].substring(0, FILEDIRS[imageNumber].indexOf('.'));
  		name = name.charAt(0).toUpperCase() + name.slice(1);
  		let embed = new Discord.RichEmbed()
  			.setColor('#3880ba')
  			.setTitle('New character has been discovered!')
  			.attachFiles([dir+'/'+FILEDIRS[imageNumber]])
  			.setDescription('Type '+prefix+'get <character> to guess the \n character\'s name!' )
  			.setImage('attachment://'+FILEDIRS[imageNumber]);
  		message.channel.send(embed);
  		return FILEDIRS[imageNumber];
  	}
 }
};
