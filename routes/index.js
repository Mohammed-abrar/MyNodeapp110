var express = require('express');
var fs = require('file-system');


var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');

var db = monk('mongodb://akshaykumargowdar:h7GKkbvWVPZ2vwr9@myapplication-shard-00-00-rplbd.mongodb.net:27017,myapplication-shard-00-01-rplbd.mongodb.net:27017,myapplication-shard-00-02-rplbd.mongodb.net:27017/MyApplication?ssl=true&replicaSet=MyApplication-shard-0&authSource=admin');
//var db = monk('localhost:27017/MyApplicationDatabase');

//db.createCollection("MyCollection", { capped : true, size : 5242880, max : 5000 } )


//db.collection('mycollection').insert({"username" : "abrar" });

//db.collection('mycollection').find().then(function(response){
//	console.log(response);
//});

/*db.collection('MyCollection').find({"brand" : "iphone"},{"model" : 1}).then(function(response) {
	
while (!(response.hasNext())){
console.log(JSON.parse(respone.hasNext));
}
});
*/

var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

var watson = require('watson-developer-cloud');

var conversation = watson.conversation({
  username: 'e4550c76-2732-4319-99a3-a5ba24353928',
  password: 'LePjWTbZIsCx',
  version: 'v1',
  version_date: '2017-04-14'
});


var context = {};
var response;
var product = '';
var brand = '';
var model = '';
var color = '';
var memory = '';
var price;

router.get('/firstcall', function(req, res, next) {
	
  					conversation.message({
  					workspace_id: 'f9fa4f80-fef3-49eb-b5cb-ca1b40d77e52',
  				 	input: {'text': " " },
  						
						},  function(err, response) {
  										if (err)
    										console.log('error:', err);
  										else
										{
										  context = response.context;
    										  res.send(response.output);
										  
										}
									     });

                                       
					});


router.post('/consecutivecalls', function(req, res) {
					conversation.message({
  					workspace_id: 'f9fa4f80-fef3-49eb-b5cb-ca1b40d77e52',
  				 	input: {'text': req.body.question },
  						context: context
						},  function(err, response) {
  										if (err)
    										console.log('error:', err);
  										else
										{
										  context = response.context;
										  console.log(response.entities[0].value);
    										  res.send(response.output);
										}
									     });

                                       
					});

var text_to_speech = new TextToSpeechV1({
    username: '69bfd0da-dd82-416c-8043-901a66dda6b0',
    password: 'yT2ZMmqPKrDv',
    headers: {
    'X-Watson-Learning-Opt-Out': 'true'
    }
});

var speech_to_text = new SpeechToTextV1({
    username : "87f6b0a7-4d1c-4c27-ae4b-177463cfd33f",
    password : "iDzdOBlQ61v2" ,
	headers: {
    'X-Watson-Learning-Opt-Out': 'true'
  }
});

router.get('/texttospeech', function(req, res, next) {
	var params = {
  text: 'Welocme to node js',
  voice: 'en-US_AllisonVoice',
  accept: 'audio/wav'
};
// Pipe the synthesized text to a file.
text_to_speech.synthesize(params).on('error', function(error) {
  console.log('Error:', error);
}).pipe(fs.createWriteStream('./public/audio/audio2.wav'));
	
});
  
 
router.get('/speechtotext', function(req, res, next) {
	
    var params = {
    audio: fs.createReadStream('./public/audio/audio1.wav'),
    content_type: 'audio/wav',
    timestamps: true,
    word_alternatives_threshold: 0.9,
    continuous: true
  };
// Pipe the synthesized text to a file.
 speech_to_text.recognize(params, function(error, transcript) {
    if (error)
      console.log('Error:', error);
    else
      res.send(transcript.results[0].alternatives[0].transcript);
      
  });
	
});


/*router.get('/storedata', function(req, res, next) {
	
	db.collection('MyCollection').insert().then(function(response) {
			res.send(response);
			});
	
});*/


router.get('/getdata', function(req, res, next) {
	db.collection('MyCollection').find({"brand" : "iphone"},{"_id" : 0, "model" : 1, "brand" : 0}).then(function(response){
		res.send(response[0].model);
 	
 	});
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/conversationapp', function(req,res,next) { 
	res.render('conversation');
});
module.exports = router;
