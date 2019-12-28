module.exports = class Character {
  constructor(name, imageURL){
    this.name = name;
    this.imageURL = imageURL;
  }
  get name() {
    return this.name;
  }
  get imageURL() {
    return this.imageURL;
  }
  set name(x){
    this.name = x;
  }
  set imageURL(x){
    this.imageURL = x;
  }
}
