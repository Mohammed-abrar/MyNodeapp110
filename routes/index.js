var express = require('express');
var fs = require('file-system');
var router = express.Router();

var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

var watson = require('watson-developer-cloud');

var conversation = watson.conversation({
  username: '5043ed03-83d8-4e15-883f-c24ad92d1254',
  password: 'KMdzXlqvxLXu',
  version: 'v1',
  version_date: '2017-04-24'
});


var context = {};
var response;

router.get('/firstcall', function(req, res, next) {
	
  					conversation.message({
  					workspace_id: '1e018105-1f52-4539-acbe-ac166b80631a',
  				 	input: {'text': " " },
  						context: context
						},  function(err, response) {
  										if (err)
    										console.log('error:', err);
  										else
    										  res.send(response.output.text[0]);
									     });

                                       
					});


router.post('/consecutivecalls', function(req, res) {
	
  					conversation.message({
  					workspace_id: '1e018105-1f52-4539-acbe-ac166b80631a',
  				 	input: {'text': "search for phone" },
  						context: context
						},  function(err, response) {
  										if (err)
    										console.log('error:', err);
  										else
										{
										  context = response.context;
    										  res.send(response.output.text[0]);
										}
									     });

                                       
					});
router.get('/consecutivecalls', function(req, res) {
	
  					conversation.message({
  					workspace_id: '1e018105-1f52-4539-acbe-ac166b80631a',
  				 	input: {'text': "search for phone" },
  						context: context
						},  function(err, response) {
  										if (err)
    										console.log('error:', err);
  										else
										{
										  context = response.context;
    										  res.send(response.output.text[0]);
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


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/conversationapp', function(req,res,next) { 
	res.render('conversation');
});
module.exports = router;
