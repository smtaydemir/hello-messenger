var express = require('express')
var parser  = require('body-parser')
var request = require('request');
var app     = express()

app.use(parser.json());

var token = "<FB-PAGE-TOKEN>";

// Verify token
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === '<VERIFY-TOKEN>') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

// Send a text message
function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

// Receive Messages
app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
      sendTextMessage(sender, "Text received, echo: "+ text);
    }
  }
  res.sendStatus(200);
});


app.listen(process.env.PORT || 3000);
