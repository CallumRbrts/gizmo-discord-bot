const Discord = require('discord.js');
const bot = new Discord.Client();
//{ ws: {intents: ['GUILDS','GUILD_MESSAGES', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGE_REACTIONS', 'GUILD_PRESENCES', 'GUILD_MEMBERS']}}
bot.commands = new Discord.Collection();
const fs = require('fs');
const Keyv = require('keyv');
const dir = './images/characters';
const VERSION = '2.1.1';
var {globalPrefix, token, sql} = require('./config.json');
const keyvPrefixes = new Keyv(sql);
const keyvUsers = new Keyv(sql);
var crypto = require('./functions/crypto.js');
var xp = require('./functions/xp.js');
var imagePop = require('./functions/imagePop.js');
var factory = require('./functions/factory.js');
var read = require('fs-readdir-recursive');
var CHANCE = 1; //0.09 is the optimal
var NBFILES = 0;
var FILEDIRS = {};
var COMMANDS = [];
var FILECOLLECTION = {};
var CHARCOLLECTION = {};
var guildsLatestImage = {};
var allGuilds = bot.guilds;
var guildTimers = {};

keyvPrefixes.on('error', err => console.error('Keyv connection error:', err));
keyvUsers.on('error', err => console.error('Keyv connection error:', err));
let c = 0;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	COMMANDS[c] = command;
	bot.commands.set(command.name, command);
	c++;
}
//change this to read every folder in the folder
//and give the FILECOLLECTION an array with the name and the rarity
//modify image pop to implement this

// fs.readdir(dir, (err, files)=>{
//   NBFILES = files.length;
//   console.log('There are ' + NBFILES + ' file(s) in ' + dir);
//   FILEDIRS = files.map(function(files){
//     return files;
//   });
// 	console.log(FILEDIRS);
// });

function fillCollection(){
	for(const file of FILEDIRS){
		//remove dirs if any
		let l = file.split('/');
		let size = l.length - 1;
		let h = l[size].split('.');
		let j = "";
		//fabric funtion will have a collection with key: name, value: obj. And also a function(name) and searches the collection for the name and return an object
		for(let i = 0; i < h.length - 1; i++){
			j += h[i].charAt(0).toUpperCase() + h[i].slice(1).toLowerCase() + " ";
		}
		j = j.substring(0, j.length - 1);
		//fabric function here .search
		//new collection -> key: name, value: obj{name, rarity, imagelink}
		FILECOLLECTION[file] = j;
	}
}

//encrypt data that's saved in the database
//xp system for each char
//music bot = YT and Spotify capabilities
//set limit to amount of chars on one single embed and seperate them into pages and allow page change through reactions

bot.login(token);

bot.on('ready', () => {
  console.log('This bot is getting ready!');
	FILEDIRS = read(dir);
	NBFILES = FILEDIRS.length;
	fillCollection();
	// var filfafdsd = read(dir);
	// console.log(filfafdsd);
	console.log(FILECOLLECTION);
    allGuilds.tap(function(guild){
			guildsLatestImage[guild.id] = "";
    });
	console.log('Preparing Guilds!');
	console.log(guildsLatestImage);

	console.log("Creating Character Collection!");
	CHARCOLLECTION = factory.create();
	//console.log(CHARCOLLECTION);
	console.log('Gizmo is ready!');
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
					case 'help':
						chosenCommand.execute(message, COMMANDS, prefix);
						break;
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
					  	let bool =	chosenCommand.execute(message, args, guildsLatestImage[guild], FILECOLLECTION, keyvUsers, CHARCOLLECTION);
							if(bool === true){
								console.log("Guessed!");
								guildsLatestImage[guild] = "";
								clearTimeout(guildTimers[guild]);
							}
						}
						break;
					case 'cc':
					case 'sort':
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

async function gainxp(message){
	let userID = message.member.user.id;
	let results = await keyvUsers.get(userID);
	if(!results || !results["ChosenCharacter"]){
		return;
	}
	for(let i = 0; i < results["Characters"].length; i++ ){
		if(results["Characters"][i].id === results["ChosenCharacter"]){
			let newStats = xp.gain(message, results["Characters"][i]);
			results["Characters"][i].xp = newStats[0];
			results["Characters"][i].level = newStats[1];
			await keyvUsers.set(userID, results);
			return;
		}
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
			gainxp(message);
			guildPrefix = globalPrefix;
			args = message.content.substring(guildPrefix.length).split(/\s+/);
		  commandSwitch(message, args, guildPrefix, currImage, guildID);
			return;
		} else {
			//get the guild prefixChosenCharacter
			guildPrefix = await keyvPrefixes.get(guildID);
			if(message.content.startsWith(guildPrefix)){
				args = message.content.substring(guildPrefix.length).split(/\s+/);
				commandSwitch(message, args, guildPrefix, currImage, guildID);
			} else {
				//if guild message but no prefix
				gainxp(message);
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
				}, 20000);
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
