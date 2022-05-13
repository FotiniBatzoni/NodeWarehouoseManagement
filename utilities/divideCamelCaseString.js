module.exports = function(action){

    let start=0;
    const end = action.length-1;

    for(let i=0;i<end;i++){
        if(action[i]==action[i].toUpperCase()){
            start = i;
            break;
        }
    }

    const model = action.substr(start,end);

    return model;

}