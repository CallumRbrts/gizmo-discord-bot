const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const fs = require('fs');
const Keyv = require('keyv');
const keyvPrefixes = new Keyv('mysql://hart:Ilovemydog@localhost/gizmo');
const keyvUsers = new Keyv('mysql://hart:Ilovemydog@localhost/gizmo');
const dir = './images/characters';
const VERSION = '1.3.1';
var {globalPrefix, token} = require('./config.json');
var crypto = require('./functions/crypto.js');
var imagePop = require('./functions/imagePop.js');
var CHANCE = 1; //0.09 is the optimal
var NBFILES;
var FILEDIRS = [];
var FILECOLLECTION = {};
var guildsLatestImage = {};
var allGuilds = bot.guilds;
var guildTimers = {};

keyvPrefixes.on('error', err => console.error('Keyv connection error:', err));
keyvUsers.on('error', err => console.error('Keyv connection error:', err));

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

function fillCollection(){
	for(const file of FILEDIRS){
		let h = file.split('.');
		let j = "";
		for(let i = 0; i < h.length - 1; i++){
			j += h[i].charAt(0).toUpperCase() + h[i].slice(1).toLowerCase() + " ";
		}
		j = j.substring(0, j.length - 1);
		FILECOLLECTION[file] = j;
	}
}

//optimize the prefix again using Keyv in conjunction with allGuilds.tap();
//Create a hint command that allows the user to get the first letter if that chars name
//encrypt data that's saved in the database
//xp system for each char
//music bot = YT and Spotify capabilities
//set limit to amount of chars on one single embed and seperate them into pages and allow page change through reactions
//add the ability to sort the list of captured characters
//delete the user table with my tag in the database -> cleanup
//add the ability to select a character from the list of user chars and display information

//find a way to speed up the select command
//test the select and lc command with Oscar

bot.login(token);

bot.on('ready', () => {
  console.log('This bot is online!');
	fillCollection();
	console.log(FILECOLLECTION);
    allGuilds.tap(function(guild){
			guildsLatestImage[guild.id] = "";
    });
	console.log(guildsLatestImage);
	bot.user.setPresence({
		status: "online",
		game: {
			name: "over " + bot.guilds.size + " servers | " + globalPrefix + "help",
			type: "WATCHING"
		}
	});
});

function commandSwitch(message, args, prefix, currImage, guild){
	if (message.content.substring(0, prefix.length) == prefix){
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
						if(message.channel.type != "dm"){
            	chosenCommand.execute(message, args, prefix, keyvPrefixes);
					  }else {
					  	message.channel.send('Can\'t do that in DM\'s!');
					  }
            break;
					case 'hint':
					case 'get':
						if(message.channel.type != "dm"){
					  	let bool =	chosenCommand.execute(message, args, guildsLatestImage[guild], FILECOLLECTION, keyvUsers);
							if(bool){
								guildsLatestImage[guild] = "";
								clearTimeout(guildTimers[guild]);
							}
						}
						break;
					case 'select':
					case 'delc':
					case 'lc':
						chosenCommand.execute(message, args, keyvUsers, prefix, bot);
						break;
          default:
            chosenCommand.execute(message, args);
            break;
        }

    }
	}else{
		//need to call this function again so that the images may still spawn even when the server prefix hasn't changed
		if(message.channel.type != "dm"){
			let currImage = imagePop.spawnImage(message, prefix, CHANCE, FILEDIRS, NBFILES, dir);
			guildsLatestImage[message.guild.id] = currImage;
			console.log(guildsLatestImage);
		}
		return;
	}
}

bot.on('message', async message=>{
  if(message.author.bot){
    return;
  }
	let args;
	//if message was sent in a guild
	if(message.guild){
		let guildPrefix;
		let currImage;
		let timer;
		let guildID = message.guild.id;
		//if we don't have the guild prefix stored
		if(!await keyvPrefixes.get(guildID)){
			guildPrefix = globalPrefix;
			args = message.content.substring(guildPrefix.length).split(/\s+/);
		  commandSwitch(message, args, guildPrefix, currImage, guildID);
			return;
		} else {
			//get the guild prefix
			guildPrefix = await keyvPrefixes.get(guildID);
			if(message.content.startsWith(guildPrefix)){
				args = message.content.substring(guildPrefix.length).split(/\s+/);
				commandSwitch(message, args, guildPrefix, currImage, guildID);
			} else {
				//if guild message but no prefix
			  let currImage = imagePop.spawnImage(message, guildPrefix, CHANCE, FILEDIRS, NBFILES, dir);
				guildsLatestImage[guildID] = currImage;
				if(guildsLatestImage[guildID] != ""){
					clearTimeout(guildTimers[guildID]);
					console.log('timer cleared');
				}
				//was trying to set a timer by creating a collection of timers for each guild and accessing them periodically to reset each timer
				timer = setTimeout(() => {
					if(guildsLatestImage[guildID]!= ""){
					guildsLatestImage[guildID] = "";
					}
				}, 10000);
				guildTimers[guildID] = timer;
				console.log(guildsLatestImage);
				return;
			}
		}
	}else{
		//DM's
		args = message.content.substring(globalPrefix.length).split(/\s+/);
		commandSwitch(message, args, globalPrefix, null , null);
	}
});
