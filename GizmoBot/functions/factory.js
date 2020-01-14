var uniqid = require('uniqid');

module.exports = {
  create: function(){
    var CHARCOLLECTION = {};
    var char = new Object();
    char = {name:"Ratchet", xp:0, level:1, rarity:"Very Rare", race:"lombax", imageURL:""};
    CHARCOLLECTION[char.name] = char;
    char = {name:"Clank", xp:0, level:1, rarity:"Ultra Rare", race:"robot", imageURL:""};
    CHARCOLLECTION[char.name] = char;
    char = {name:"Nathan Drake", level:1, xp:0, rarity:"Ultra Rare", race:"human", imageURL:""};
    CHARCOLLECTION[char.name] = char;

    return CHARCOLLECTION;
  },
  generateStats: function(character){
    var min = 0;
    var max = 0;
    switch (character.rarity) {
      case 'Common':
        min = 10;
        max = 40;
        break;
      case 'Uncommon':
        min = 20;
        max = 60;
        break;
      case 'Rare':
        min = 40;
        max = 80;
        break;
      case 'Very Rare':
        min = 60;
        max = 100;
        break;
      case 'Ultra Rare':
        min = 80;
        max = 120;
        break;
    }
    character.attack = Math.floor(Math.random() * (max - min + 1) +min);
    return character;
  },
  createObject: function(length, CHARCOLLECTION, charName, guildImage){
    let today = new Date();
    let date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;
    //char constructor
    var obj = new Object();
    obj = CHARCOLLECTION[charName];
    obj.imageURL = guildImage;
    obj.dateCaptured = dateTime;
    obj.captureOrder = length + 1;
    obj.id = uniqid();

    obj = module.exports.generateStats(obj);
    return obj;
  }

}
