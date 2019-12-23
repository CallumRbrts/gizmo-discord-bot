module.exports = {
  name: 'ping',
  description: 'Reply pong',
  execute(message) {
    message.channel.send('pong');
  }
}
  // ping: function(message) {
  //   message.channel.send('pong');
  // }
