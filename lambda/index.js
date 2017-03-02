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

 'NewSession': function () {
   this.emit(':ask', `Welcome to Voice Devs, The skill that gives you information about the alexa developer community.
   You can ask me about the various alexa meetups around the world, or listen to the Alexa Dev Chat podcast.
   But first I\'d like to get to know you better.
   Tell me your name by saying: My name is, and then your name.`, 'Tell me your name by saying: My name is, and then your name.');
 },

 'NameCapture': function () {
   // Get Slot Values
   var USFirstNameSlot = this.event.request.intent.slots.USFirstName.value;
   var UKFirstNameSlot = this.event.request.intent.slots.UKFirstName.value;

   //Get NameCapture
   var name;
   if (USFirstNameSlot) {
     name = USFirstNameSlot;
   } else if (UKFirstNameSlot) {
     name = UKFirstNameSlot
   }

   //Save name in Session Attributes and Ask for Country
   if (name) {
     this.attributes['userName'] = name;
     this.emit(':ask', `Ok, ${name}! Tell me what country you're from by saying: I'm from, and then the country you're from.`, `Tell me what country you're from by saying: I'm from, and then the country you're from.`);
   } else {
     this.emit(':ask', `Sorry I didn't recognize that name. Please tell me your name by saying: My name is, and then your name.`, `Please tell me your name by saying: My name is, and then your name.`);
   }
  //  this.emit(':ask', ``);
 },

 'CountryCapture': function () {
   //Get slot Values
   var country = this.event.request.intent.slots.Country.value;
   //Get user name from session attributes
   var userName = this.attributes['userName'];

   // Save Country Name in Session Attributes and Ask for favorite programming language
   if (country) {
     this.attributes['userCountry'] = country;
     this.emit(':ask', `Ok ${userName}! Your from ${country}, that's great! You can ask me about the various alexa meetups around the world, or listen to the Alexa dev chat podcast.
     What would you like to do?`, 'What would you like to do');
   } else {
     this.emit(':ask', `Sorry I didn't recognize that country. Please tell me what country you're from by saying: I am from and then your country.`, `Please tell me what country you're from by saying: I am from and then your country.`);
   }
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
