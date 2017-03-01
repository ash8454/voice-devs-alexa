var Alexa = require('alexa-sdk');

//Data
var alexaMeetups = require('./data/alexaMeetups');

//helpers
var convertArrayToReadableString = require('./helpers/convertArrayToReadableString');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  'LaunchRequest': function () {
    this.emit(':ask', 'Welcome to Voice Devs!', 'Try saying hello!');
  },

  'Hello': function () {
    this.emit(':tell', 'Hi there!');
  },

 'AlexaMeetupNumbers': function () {
   var meetupNumbers = alexaMeetups.length;
   this.emit(':ask', `I currently know of ${meetupNumbers} Alexa developer meetups.
   Check to see if your city is one of them!`, 'How can i help?')
 },

 'AlexaMeetupCityCheck': function () {
   // Get Slot Values
   var USCitySlot = this.event.request.intent.slots.USCity.value;
   var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

   // Get city
   var city;
   if (USCitySlot) {
     city = USCitySlot;
   } else if (EuropeanCitySlot) {
     city = EuropeanCitySlot;
   } else {
     this.emit(':ask', 'Sorry, I didn\'t recognize that city name.', 'How can i help?');
   }

   // Check for city
   var cityMatch = '';
   for (var i = 0; i < alexaMeetups.length; i++){
     if (alexaMeetups[i].city.toLowerCase() === city.toLowerCase()) {
       cityMatch = alexaMeetups[i].city;
     }
   }

   // Add London Audio
   var londonAudio = ``;
   if (city.toLowerCase() === 'london') {
     londonAudio = `<audio src="https://s3.amazonaws.com/aws-advanced-alexa/london-baby.mp3" />`;
   }


   //Respond to User
   if (cityMatch !== '') {
     this.emit(':ask', `${londonAudio} Yes! ${city} has an Alexa developer meetup!`, 'How can i help?');
   } else {
     this.emit(':ask', `Sorry, looks like ${city} doesn't have an Alexa developer meet up yet - why don't you start one?`);
   }
 },

 'AlexaMeetupOrganizerCheck': function () {

   // Get Slot Values
   var USCitySlot = this.event.request.intent.slots.USCity.value;
   var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

   // Get city
   var city;
   if (USCitySlot) {
     city = USCitySlot;
   } else if (EuropeanCitySlot) {
     city = EuropeanCitySlot;
   } else {
     this.emit(':ask', 'Sorry, I didn\'t recognize that city name.', 'How can i help?');
   }

   // Check for city
   var cityMatch = '';
   var cityOrganizers;
   for (var i = 0; i < alexaMeetups.length; i++){
     if (alexaMeetups[i].city.toLowerCase() === city.toLowerCase()) {
       cityMatch = alexaMeetups[i].city;
       cityOrganizers = alexaMeetups[i].organisers;
     }
   }

   // Add London Audio
   var londonAudio = ``;
   if (city.toLowerCase() === 'london') {
     londonAudio = `<audio src="https://s3.amazonaws.com/aws-advanced-alexa/london-baby.mp3" />`;
   }

   //Respond to User
   if (cityMatch !== '') {
     //1 Organizer
     if (cityOrganizers.length === 1) {
        this.emit(':ask', `${londonAudio} The organizer of the ${city} Alexa developer meetup is ${cityOrganizers[0]}.`, 'How can i help?');
     }

     //Multiple Organizers
     else {
       this.emit(':ask', `${londonAudio} The Organizers of the ${city} Alexa developer meetup are ${convertArrayToReadableString(cityOrganizers)}`, 'How can i help?');
     }
  } else {
     this.emit(':ask', `Sorry, looks like ${city} doesn't have an Alexa developer meet up yet - why don't you start one?`);
  }
 }


};
