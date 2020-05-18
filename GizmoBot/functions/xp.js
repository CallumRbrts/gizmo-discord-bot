var xpTable = {};
for(let i = 0; i < 101; i++){
  let num = Math.pow((i/2), 2);
  xpTable[i] = num * 100;
}

module.exports = {
  gain: function(message, currentChar){ //currentXP, currentLevel, name) {
    let currentXP = currentChar.xp;
    let currentLevel = currentChar.level;
    let currentName = currentChar.name;
    currentXP += 20;
    if(currentXP >= xpTable[currentLevel]){
      currentLevel += 1;
      message.channel.send('Congratulations '+message.author.toString()+'! Your ' + currentName + ' is now level ' + currentLevel);
      return [currentXP, currentLevel];
    }
    return [currentXP, currentLevel];
  }
}
