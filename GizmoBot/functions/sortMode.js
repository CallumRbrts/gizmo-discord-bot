module.exports = {
  alphabetical: function (results){
    results.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });
    return results;
  },
  createMsg: function (results){
    let msg = "";
    for(let i = 0; i < results.length; i++){
      //need to change this as a field cannot exceed 256 characters
      msg += i+1 +'. **'+ results[i].name + '**\n';
    }
    return msg;
  },
  date: function (results){
    results.sort(function(a,b){
      console.log(new Date(b.dateCaptured));
      return new Date(b.dateCaptured) - new Date(a.dateCaptured);
    });
    return results;
  }
}
