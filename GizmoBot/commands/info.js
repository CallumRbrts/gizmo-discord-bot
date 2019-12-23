module.exports = {
  name: 'info',
  description: 'Display information',
  execute(message, args, version) {
    if(args[1] == 'version'){
      message.reply('the bot version is ' + version);
    }else if(args[1] == null){
      message.channel.send('This command requires arguments');
    }else{
      message.channel.send('Invalid Argument!')
        .then(msg => {msg.delete(5000)})
    }
  }
}
