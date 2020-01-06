module.exports = {
  alphabetical: function (results, reverse){
    if(reverse){
      results.sort(function(a, b){
        if(a.name > b.name) { return -1; }
        if(a.name < b.name) { return 1; }
        return 0;
      });
    }else{
      results.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      });
    }
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
  date: function (results, reverse){
    if(reverse){
      results.sort(function(a,b){
        return new Date(a.dateCaptured) - new Date(b.dateCaptured);
      });
    }else{
      results.sort(function(a,b){
        return new Date(b.dateCaptured) - new Date(a.dateCaptured);
      });
    }
    return results;
  },
  default: function(results, reverse){
    if(reverse){
      results.sort(function(a,b){return b.captureOrder-a.captureOrder;});
    }else{
      results.sort(function(a,b){return a.captureOrder-b.captureOrder;});
    }
    return results;
  }
  //sort by initial order
  //sort by level
}
