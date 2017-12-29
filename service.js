var express = require('express');
  // , router = express.Router()
var app = express();


var mongo = require('mongodb').MongoClient;
var url = process.env.MONGOLAB_URI;

app.get('/:originalUrl', function (req, res) {	
  console.log(req.params.originalUrl); 
 mongo.connect(url, function(err, client) {

 	if(err) throw err; 
 	var db = client.db('fcc-urlsm');
 	 
 // console.log(obj); 
    db.collection('url', function (err, collection) {
      if(err) throw err;
       var error = false;
       for(var i = 0; i < 100; i++){
         var shortUrl = getRandomInt(1, 10000);
         var obj = {original: "www.google.com", short: shortUrl};
         
           collection.insert(obj, function(err, response) {
             if(err){
               if(err.code !== 11000){
                   throw err;
               }
               error = true;
             } else {
               client.close() 
               res.end(JSON.stringify({short_url:"https://ghajl-fcc-url-shortener.glitch.me/" + shortUrl}));
               // console.log(i)
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