module.exports = {
  name: 'trophy',
  description: 'Reply ding',
  execute(message) {
    return message.channel.send('Ding!');
  }
}
