const axios = require('axios');
const cheerio = require('cheerio');
const https = require("https");


const getversion = async(url, name, displayErrors, callback) => {
    try{
        axios(url).then(response => {
    const html = response.data;
    const $c = cheerio.load(html);

    $c("div.JHTxhe").find(".IxB2fe > .hAyfc").each(function(){
        const title1 = $c(this).find(".BgcNfc").text();

        const vers = $c(this).find(".htlgb > .IQ1z0d > .htlgb").text();

         if(title1 != "" || title1 != " " || title1 != null)
         if(vers != "" || vers != " " || vers != null){

            if(title1.toLowerCase().includes('current version')){
       if(/^([0-9])([0-9,.])*([0-9])$/.test(vers)){
           return callback(vers);
       }else{
        return callback(null);
    }
    }



         }
    });
}).catch(function(errr){
    if(errr.toString().includes("Error: Request failed with status code 404")){
        throw new Error(`The app "${name}" doesn't exists. Try your self ${url}`);
    }else{
        if(displayErrors){
            if(!displayErrors.length && typeof displayErrors !== 'boolean')
            throw new Error(`the displayErrors property cannot be empty and the type must be boolean.`);

        if(displayErrors === true){
        throw new Error(errr);
        }
    }
    }
});


}catch(err){
    throw new Error(err);
}


};


function cmpVersion(a, b) {
    var i, cmp, len;
    a = (a + '').split('.');
    b = (b + '').split('.');
    len = Math.max(a.length, b.length);
    for( i = 0; i < len; i++ ) {
        if( a[i] === undefined ) {
            a[i] = '0';
        }
        if( b[i] === undefined ) {
            b[i] = '0';
        }
        cmp = parseInt(a[i], 10) - parseInt(b[i], 10);
        if( cmp !== 0 ) {
            return (cmp < 0 ? -1 : 1);
        }
    }
    return 0;
}

function ltVersion(a, b) {
    return cmpVersion(a, b) < 0;
}



Array.prototype.resli = function(qtd){
  const arr = [];
  
  for(const i in this){
    if(i < qtd){
      arr.push(this[i]);
    }
  }
 
 return arr;
};


function requester(opts){
  return new Promise(resolve =>{
  
  const url = `https://play.google.com/store/search?c=apps&q=${opts.term}&hl=en_us`;
  


var request = https.get(url, function (res) {
  let html = "";
    
    res.on('data', function (chunk) {
        html += chunk;
     
    });
    
    let canCheck = true;
    
    function reg(){
    let elements = html.match(/<a\s+(?:[^>]*?\s+)?href="\/store\/apps\/details\?id=([^"]*)"/igm);
    
 
     if(elements)
    if(elements.length >= opts.num){
      request.end();
    }else{
      canCheck = true;
    }
    }
    
    
    setInterval (()=>{
       if(canCheck === true){
         reg();
         canCheck = false;
       }
    }, 100);
    
    
    
    res.on('end', function () {
      canCheck = false;
     
    let apr = [];
    
    let elements = html.match(/<a\s+(?:[^>]*?\s+)?href="\/store\/apps\/details\?id=([^"]*)"/igm);

   
    if(elements)
    for(var uri of elements){
      const appId = uri.match(/href="([^"]*?)".*/gi)[0].replace(/href="\/?/g, '').replace(/"$/g, '').match(/id=(.*?)+/gi)[0].replace(/id=/g, '');
      
     
      if(!apr.includes(appId)){
        apr.push(appId);
      }
    }
    
    if(opts.num)
    apr = apr.resli(opts.num);

    
    return resolve(apr);

    });
    
  });
  
  
});
};








class App {
    #_events = {};
    #_versions = [];

    constructor() {
        this.#_events = {};
        this.#_versions = [];
      }
    
      /**
       * 
       * @param {String} appid The App ID for update.
       * @param {EventListener} listener The event.
       * @param {Object} options The options management.
       * @returns {Object} Returns the app info when a new update has been released.
       */
      on(appid, options, listener) {
        if(!appid || !options || !listener)  throw new Error(`Cannot find all required arguments, lang and appid`);
        
        if(typeof appid === "string"){
          const name = appid;
          
        let _canCheck = true;
        
        if(options['startMessage']){
            if(!options['startMessage'].length && typeof options['startMessage'] !== 'boolean')
            throw new Error(`the repeat property cannot be empty and the type must be boolean.`);

            if(options['startMessage'] === true)
            console.log(`${name}: checking for update...`);
        }


        if (!this.#_events[name]) this.#_events[name] = [];


    
     
        this.#_events[name].push(listener);



        try{
           const emit = (name, data) => {
                if (!this.#_events[name]) return;
            
                const fireCallbacks = (callback) => {
                  callback(data);
                };
            
                this.#_events[name].forEach(fireCallbacks);
              };
            

              const start = () =>{
                var url = `https://play.google.com/store/apps/details?id=${name}&hl=en_us`;
                
          
              
                getversion(url, name, options['displayErrors'], version => {
                    if(version){
                      let lver;
                      
                                     
           
         
                      loop1:
                      for(let vrs of this.#_versions)
                      if(vrs.name === name){
                      lver = vrs.version;
                      break loop1;
                      }
                      
                                      
       
               
                      
                        if(!lver){
                            this.#_versions.push({name: name, version: version});
                        }else{
                     

                        if(options['repeat']){
                            if(!options['repeat'].length && typeof options['repeat'] !== 'boolean')
                            throw new Error(`the repeat property cannot be empty and the type must be boolean.`);

                        if(options['repeat'] === true){
                        if(ltVersion(lver, version)){
                  
                    for(let vrs2 in this.#_versions)
                    if(this.#_versions[vrs2].name === name){
                      this.#_versions[vrs2].version = version;
                    }


                    emit(name, {appId: name, version: version});
                        }else{
                            emit(name, {appId: name, version: undefined});
                       }
                        }else{
                            if(ltVersion(lver, version)){
                  
                    for(let vrs2 in this.#_versions)
                    if(this.#_versions[vrs2].name === name){
                      this.#_versions[vrs2].version = version;
                    }
    
                        emit(name, {appId: name, version: version});
                            }
                        }
                    }else{
                        if(ltVersion(lver, version)){
                  
                  for(let vrs2 in this.#_versions)
                    if(this.#_versions[vrs2].name === name){
                      this.#_versions[vrs2].version = version;
                    }
                    
                    
                    emit(name, {appId: name, version: version});
                        }
                    }
                    }
                    _canCheck = true;
                    }else{
                            _canCheck = false;

                            
                        if(options['displayErrors']){
                            if(!options['displayErrors'].length && typeof options['displayErrors'] !== 'boolean')
                            throw new Error(`the displayErrors property cannot be empty and the type must be boolean.`);

                        if(options['displayErrors'] === true){
                        throw new Error(`The app ${name} not contains version avaiable`);
                        }
                    }
                    }
                });
            }

            if(options['ms']){
                if(options['ms'] && typeof options['ms'] === 'number'){
                    if(options['ms'] >= 500){
            setInterval(()=>{
                if(_canCheck === true){
                start();
                //_canCheck = false;
                }
            }, options['ms']);
        }else{
            throw new Error(`The miliseconds cannot be less than 500.`);
        }
        }else{
            throw new Error(`the ms property cannot be empty and the type must be numeric.`);
        }
            }else{
                setInterval(()=>{
                    if(_canCheck === true){
                    start();
                   // _canCheck = false;
                    }
                }, 500);
            }

        }catch(err){console.log(err)}
        
        
        }else{
          throw new Error("the appId must be of the string type");
        }
      };


      
      /**
       * 
       * @param {String} appid The App ID for get info.
       * @param {String} lang The language for info translation, example: en-us, es-es, pt-br...
       * @returns {Object} Returns the app info.
       */
      getInfo = async(appid, lang) => {
        return new Promise((resolve, reject) => {
        if(!lang || !appid) reject(new Error(`Cannot find required arguments, lang and appid`));

        const url = `https://play.google.com/store/apps/details?id=${appid}&hl=${lang}`;
          

        axios(url).then(response => {
    
    var app = {
      name: '',
      correction: '',
      description: '',
      version: '',
      factory: '',
      image: '',
      others: []
    };
      const html = response;
      const $c = cheerio.load(html);
      const desc = [];
      const namer = [];
      const image = [];
      const descrip = [];
      let versAtual = undefined;
  
      $c("div.JHTxhe").find(".IxB2fe > .hAyfc").each(function(){
          desc.push($c(this).find(".htlgb > .IQ1z0d > .htlgb").text());
          const title1 = $c(this).find(".BgcNfc").text();
          const text1 = $c(this).find(".htlgb > .IQ1z0d > .htlgb").text();
  
           if(title1 != "" || title1 != " " || title1 != null)
           if(text1 != "" || text1 != " " || text1 != null)
           app.others.push({title: title1, text: text1});
  
  
      });
      $c("div.JHTxhe").find(".hAyfc > .htlgb > .IQ1z0d > .htlgb").each(function(){
          const vers = $c(this).text();
  
         if(/^([0-9])([0-9,.])*([0-9])$/.test(vers)){
           versAtual = vers;
         }
      });
      $c(".AHFaub").each(function(){
          namer.push($c(this).text());
      });
      $c("img.T75of").each(function(){
          image.push($c(this).attr("src"));
      });
      
      $c("div.PHBdkd").find(".DWPxHb > span > div").each(function(){
          descrip.push($c(this).text());
      });
  
     app.name = namer[0];
     app.version = versAtual;
     app.correction = desc[1];
     app.description = descrip[0];
     app.factory = desc[13];
     app.image = image[0];
  
    resolve(app);
  
  }).catch(function(errr){
    if(errr.toString().includes("Error: Request failed with status code 404")){
        reject(new Error(`The app doesn't exits. Try your self ${url}`));
    }else{
        reject(new Error(`Request failed: ${errr}`));
    }
});

          });
      };
      
      
      
      
      search = async(opts) => {
  return new Promise(function (resolve, reject) {
    if(opts['term'])
    if(typeof opts.term !== "string")
    throw new Error('The term property must be of the string type');
    
    
    if (!opts || !opts.term) {
      throw new Error('Search term missing');
    }

    if (opts['num'])
    if(typeof opts.num === "number"){
    if(opts.num > 50) {
      throw new Error("The number of results can't exceed 50");
    }
    }else{
      throw Error("The num property must be of the numeric type.");
    }
 

    return requester(opts)
      .then(resolve);
  });

      };
      
      
      
      
      
      
      
}

module.exports = App;
