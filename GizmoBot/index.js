const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const fs = require('fs');
const Keyv = require('keyv');

const keyvPrefixes = new Keyv('mysql://hart:Ilovemydog@localhost/gizmo');
const keyvUsers = new Keyv('mysql://hart:Ilovemydog@localhost/gizmo');
const dir = './images/characters';
const VERSION = '1.2.2';
var {globalPrefix, token} = require('./config.json');
var crypto = require('./functions/crypto.js');
var imagePop = require('./functions/imagePop.js');
var CHANCE = 1; //0.09 is the optimal
var NBFILES;
var FILEDIRS = [];
var FILECOLLECTION = {};
var guildsLatestImage = {};
var allGuilds = bot.guilds;


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
		FILECOLLECTION[file] = h[0].charAt(0).toUpperCase() + h[0].slice(1);
	}
}

//modify bot to send error message when DM guild only commands
//optimize the prefix again using Keyv in conjunction with allGuilds.tap();
//add a time limit to when you can catch the character
//add the ability to add chars to a users database
//CREATE A COMMAND SWITCH DM FUNCTION THAT HAS SEPERATE COMMANDS
//Create a hint command that allows the user to get the first letter if that chars name
//modify the get.js to make it search through the FILECOLLECTION to determine the answer, maybe it's not faster... actually no it will since it's a collection and not an array (indexing)

bot.login(token);

bot.on('ready', () => {
  console.log('This bot is online!');
	bot.user.setPresence({
		status: "online",
		game: {
			name: globalPrefix + "help",
			type: "PLAYING"
		}
	});
	fillCollection();
	console.log(FILECOLLECTION);
    allGuilds.tap(function(guild){
			guildsLatestImage[guild.id] = "";
    });
	console.log(guildsLatestImage);
});

function commandSwitch(message, args, version, prefix, currImage, guild){
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
					case 'get':
					  let bool =	chosenCommand.execute(message, args, guildsLatestImage[guild], FILECOLLECTION);
						if(bool){
							guildsLatestImage[guild] = "";
						}
						break;
          default:
            chosenCommand.execute(message, args);
            break;
        }

    }
	}else{
		//need to call this function again so that the images may still spawn even when the server prefix hasn't changed
		let currImage = imagePop.spawnImage(message, prefix, CHANCE, FILEDIRS, NBFILES, dir);
		guildsLatestImage[message.guild.id] = currImage;
		console.log(guildsLatestImage);
		return;
	}
}

bot.on('message', async message=>{
  if(message.author.bot){
    return;
  }
	let args;
	if(message.guild){
		let guildPrefix;
		let currImage;
		let guildID = message.guild.id;
		if(!await keyvPrefixes.get(guildID)){
			guildPrefix = globalPrefix;
			args = message.content.substring(guildPrefix.length).split(/\s+/);
		  commandSwitch(message, args, VERSION, guildPrefix, currImage, guildID);
			return;
		} else {
			guildPrefix = await keyvPrefixes.get(guildID);
			if(message.content.startsWith(guildPrefix)){
				args = message.content.substring(guildPrefix.length).split(/\s+/);
				commandSwitch(message, args, VERSION, guildPrefix, currImage, guildID);
			} else {
			  let currImage = imagePop.spawnImage(message, guildPrefix, CHANCE, FILEDIRS, NBFILES, dir);
				guildsLatestImage[guildID] = currImage;
				console.log(guildsLatestImage);
				return;
			}
		}
	}else{
		//DM's -> NEED TO MODIFY TO MAKE IT SO IMAGES DON'T SPAWN IN DM'S
		//CREATE A COMMAND SWITCH DM FUNCTION THAT HAS SEPERATE COMMANDS
		args = message.content.substring(globalPrefix.length).split(/\s+/);
		commandSwitch(message, args, VERSION, globalPrefix, null , null);
	}
});
