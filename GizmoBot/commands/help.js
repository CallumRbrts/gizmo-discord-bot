module.exports = {
  name: 'help',
  description: 'Sends StackOverflow link',
  execute(message) {
    message.channel.send('https://stackoverflow.com/');
  }
}
