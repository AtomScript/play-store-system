const cheerioModule = require('cheerio');
const qdb = require('quick.db');
module.exports.addApp = function addApp(appid, version){
    if(appid && version){
    const appid1 = appid.replace(/\./g, '');

    qdb.set(appid1, version);
    }else{
        throw new Error(`The app ID and version cannot be empty`);
    }
}

module.exports.getAllApps = function getAllApps(){
    return (qdb.all());
}

module.exports.appExits = function appExits(appid){
    const appid1 = appid.replace(/\./g, '');
    return (qdb.has(appid1));
}

module.exports.getApp = function getApp(appid){
    if(appid){
    const appid1 = appid.replace(/\./g, '');
    if(qdb.has(appid1)){
    const valueA = qdb.get(appid1);


    if(valueA)
    {
        return (valueA);
    }
    else
    {
        return (undefined)
    }
}else{
  return(null);
}

    }else{
        throw new Error(`The app ID cannot be empty`);
    }
};
