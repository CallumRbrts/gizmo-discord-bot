const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
//const token = 'NjU4MzEyMTkyODk4MTA1MzQ0.Xf-Adw.mUM9kTE9H_QLhb0xTAUU9kfIhMo';
//var PREFIX = '!';
const fs = require('fs');
const Keyv = require('keyv');
const keyvPrefixes = new Keyv('mysql://hart:Ilovemydog@localhost/gizmo');
const dir = './images/characters';
const VERSION = '1.2.1';
var {globalPrefix, token} = require('./config.json');
//const globalPrefix = PREFIX;
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
			name: globalPrefix + "help",
			type: "PLAYING"
		}
	})
});

//OPTIMIZATIONS : ADD THIS IN SEPERATE FILE + CHECK IF YOU CAN @ THE BOT TO DO COMMANDS
function imagePop(message, prefix){
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
			.setDescription('Type '+prefix+'get <character> to guess the \n character\'s name!' )
			.setImage('attachment://'+FILEDIRS[imageNumber]);
		message.channel.send(embed);
		return;
	}
}

function commandSwitch(message, args, version, prefix){
	if (message.content.substring(0, prefix.length) == prefix){
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
            chosenCommand.execute(message, args, version);
            break;
          case 'prefix':
            chosenCommand.execute(message, args, prefix, keyvPrefixes);
            break;
          default:
            chosenCommand.execute(message, args);
            break;
        }

    }
	}else{
		//need to call this function again so that the images may still spawn even when the server prefix hasn't changed
		return imagePop(message, prefix);
	}
}

bot.on('message', async message=>{
  if(message.author.bot){
    return;
  }
	let args;
	if(message.guild){
		let guildPrefix;
		if(!await keyvPrefixes.get(message.guild.id)){
			guildPrefix = globalPrefix;
			args = message.content.substring(guildPrefix.length).split(/\s+/);
			console.log('No save');
			commandSwitch(message, args, VERSION, guildPrefix);
			return;
		} else {
			guildPrefix = await keyvPrefixes.get(message.guild.id);
			if(message.content.startsWith(guildPrefix)){
				args = message.content.substring(guildPrefix.length).split(/\s+/);
				console.log('save');
				commandSwitch(message, args, VERSION, guildPrefix);
			} else {
				imagePop(message, guildPrefix);
				return;
			}
		}
	}else{
		args = message.content.substring(globalPrefix.length).split(/\s+/);
		commandSwitch(message, args, VERSION, globalPrefix);
	}
});
