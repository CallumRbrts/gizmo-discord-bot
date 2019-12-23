module.exports = {
  name: 'trophy',
  description: 'Reply ding',
  execute(message) {
    message.channel.send('Ding!');
  }
}
