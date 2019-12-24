const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
//const token = 'NjU4MzEyMTkyODk4MTA1MzQ0.Xf-Adw.mUM9kTE9H_QLhb0xTAUU9kfIhMo';
//var PREFIX = '!';
const fs = require('fs');
const Keyv = require('keyv');
const keyvPrefixes = new Keyv('mysql://hart:Ilovemydog@localhost/gizmo');
const dir = './images/characters';
const VERSION = '1.1.0';
var {PREFIX, token} = require('./config.json');
var crypto = require('./crypto.js');
var CHANCE = 1; //0.09 is the optimal
var NBFILES;
var FILEDIRS = [];

keyvPrefixes.on('error', err => console.error('Keyv connection error:', err));

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

fs.readdir(dir, (err, files)=>{
  NBFILES = files.length;
  console.log('There are ' + NBFILES + ' file(s) in ' + dir);
  FILEDIRS = files.map(function(files){
    return files;
  });
  console.log(FILEDIRS);
});

bot.login(token);

bot.on('ready', () => {
  console.log('This bot is online!');
	bot.user.setPresence({
		status: "online",
		game: {
			name: PREFIX + "help",
			type: "PLAYING"
		}
	})
});

function imagePop(message){
	let pop = Math.random();
	//chance to send a random image of a game character
	if(pop < CHANCE){
		//message.channel.send('I am in');
		//
	 let imageNumber = Math.floor (Math.random() * (NBFILES - 1 + 1));
		//ways to hide image name: 1- try embedding the image, 2- use dictionary 3-make it like waifu bot
		//Next create a data structure with the file dir,
		let name = FILEDIRS[imageNumber].substring(0, FILEDIRS[imageNumber].indexOf('.'));
		name = name.charAt(0).toUpperCase() + name.slice(1);
		let embed = new Discord.RichEmbed()
			.setColor('#3880ba')
			.setTitle('New character has been discovered!')
			.attachFiles([dir+'/'+FILEDIRS[imageNumber]])
			.setDescription('Type '+PREFIX+'get <character> to guess the \n character\'s name!' )
			.setImage('attachment://'+FILEDIRS[imageNumber]);
		message.channel.send(embed);
		return;
	}
}

bot.on('message', async message=>{
  if(message.author.bot){
    return;
  }
	let args;

	if(message.guild){
		let prefix;
		if(!await keyvPrefixes.get(message.guild.id)){
			prefix = PREFIX;
		} else {
			const guildPrefix = await keyvPrefixes.get(message.guild.id);
			if(message.content.startsWith(guildPrefix)){
				prefix = guildPrefix;
				PREFIX = prefix;
			}
		}
		//Consider getting rid of this so I don't have a disgusting code duplication
		// if(!prefix){
	  //   return imagePop(message);
		// }
		if(prefix){
			args = message.content.substring(prefix.length).split(/\s+/);
		}

	}else{
		args = message.content.substring(PREFIX.length).split(/\s+/);
	}

	if (message.content.substring(0, PREFIX.length) == PREFIX){
  //args = message.content.substring(PREFIX.length).split(/\s+/);
    let command = args[0].toLowerCase();

    //checks collection for the command, if found then proceed
    if(bot.commands.has(command)){
        //store the command object to avoid code duplication
        let chosenCommand = bot.commands.get(command);
        console.log(command + ' is being used!');
        //for commands with extra attributes needed in the prototypes or returning results are seperated
        switch(command){
          case 'info':
            chosenCommand.execute(message, args, VERSION);
            break;
          case 'prefix':
            chosenCommand.execute(message, args, PREFIX, keyvPrefixes);
            break;
          default:
            chosenCommand.execute(message, args);
            break;
        }

    }
	}else{
		//need to call this function again so that the images may still spawn even when the server prefix hasn't changed
		return imagePop(message);
	}
});
