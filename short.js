var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
var dburl = process.env.MONGOLAB_URI;
var validUrl = require('valid-url');
  

app.get('/*', function (req, res) {	
  
  console.log(req.params[0]); 
  
  if(!validUrl.isWebUri(req.params[0])){
    res.end(JSON.stringify({error:"wrong Url format"}));
  }
 mongo.connect(dburl, function(err, client) {

 	if(err) throw err; 
 	var db = client.db('fcc-urlsm');
 	 
    db.collection('url', function (err, collection) {
      if(err) throw err;
       var error = false;
       for(var i = 0; i < 100; i++){
         var shortUrl = getRandomInt(1, 10000);
         var obj = {original: req.params[0], short: shortUrl};
         
           collection.insert(obj, function(err, response) {
             if(err){
               if(err.code !== 11000){
                   throw err;
               }
               error = true;
             } else {
               client.close() 
               res.end(JSON.stringify({original_url:req.params[0],short_url:"https://ghajl-fcc-url-shortener.glitch.me/" + shortUrl}));
               error = false;
             }

          });
         if(!error) break;
       }
       
    
    })
  })
})

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = app