var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
var dburl = process.env.MONGOLAB_URI;
  
app.get(/^\/(\d+)$/, function (req, res) {	


  mongo.connect(dburl, function(err, client) {

    if(err) throw err; 
    var db = client.db('fcc-urlsm');
 	 
    db.collection('url', function (err, collection) {
      if(err) throw err;
         
           collection.findOne({"short": +req.params[0]}, function(err, response){
             if(err) throw err;
             client.close();
               if (response) {
                 res.redirect(response.original)
               } else {
                  res.end(JSON.stringify({error:"This url is not on the database."}));
               }
           })
    
     })
    })
})


module.exports = app