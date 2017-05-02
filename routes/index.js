var express = require('express');
var fs = require('file-system');
var Cloudant = require('cloudant');
var cloudant = Cloudant({
  "username": "95aa768a-4661-4cfa-bf90-6eab77f14154-bluemix",
  "password": "aef7be9fff4c0fc5cde478ed173cd0fc008d6b015f70e0b1e3364fd3acc9ab51",
  
});


var router = express.Router();



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
					console.log(req.body.context);
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


router.get('/storedata', function(req, res, next) {
	cloudant.db.create('mydb', function() {
		var mydb = cloudant.db.use('mydb');
		mydb.insert(
			{
				product : "phone",
				brand   : "iphone",
        			model   : "7s",
				color	: "gold",
				memory	: "16gb",
				price	: 45000
			}, 'phone', function(err, body, header) {
     								 if (err) {
      								  return console.log('[mydb.insert] ', err.message);
    								  }

      								console.log('You have inserted data.');
			                                        console.log(body);
			    	     });
		);
	}).then(function(response){
 	res.send(response);
 });
});


router.get('/getdata', function(req, res, next) {
	var db = cloudant.db.use('myDB');
	db.collection('MyCollection').find().then(function(response){
 	res.send(response);
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
