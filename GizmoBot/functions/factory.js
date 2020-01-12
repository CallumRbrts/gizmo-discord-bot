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
  }
}
