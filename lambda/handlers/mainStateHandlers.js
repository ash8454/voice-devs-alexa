var Alexa = require('alexa-sdk');

//constants
var constants = require('../constants/constants');

//Data
var alexaMeetups = require('../data/alexaMeetups');

//helpers
var convertArrayToReadableString = require('../helpers/convertArrayToReadableString');

//Onboarding handlers
var mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {
  'LaunchRequest': function () {
    //Check for User Data in Session Attributes
    var userName = this.attributes['userName'];
    if (userName) {
      //Welcome User Back by Name
      this.emit(':ask', `Welcome back ${userName}! You can ask me about the various alexa meetups around the world or listen to the Alexa Dev Chat podcast.`, 'What would you like to do?');
    } else {
      this.handler.state = constants.state.ONBOARDING;
      this.emitWithState('NewSession');
      // this.emit(':ask', `Welcome to Voice Devs, The skill that gives you information about the alexa developer community.
      // You can ask me about the various alexa meetups around the world, or listen to the Alexa Dev Chat podcast.
      // But first I\'d like to get to know you better.
      // Tell me your name by saying: My name is, and then your name.`, 'Tell me your name by saying: My name is, and then your name.');
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
  },

  'AMAZON.StopIntent': function () {
    //State Automactially Saved with : tell
    this.emit(':tell', 'Good Bye');
  },

  'AMAZON.CancelIntent': function () {
    //State Automactially Saved with : tell
    this.emit(':tell', 'Good Bye');
  },

  'SessionEndedRequest': function () {
    //Force State to Save when the user times out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent': function () {

    this.emit(':ask', `You can ask me about the various alexa meetups aroudn the world or listen to the Alexa Dev Chat podcast.`, 'What would you like to do?');
    //  //User Name Attribute Check
    //  var userName = this.attributes['userName'];
    //
    //  if (userName) {
    //    this.emit(':ask', `Please tell me what country you're from by saying: I'm from, and then the country you're from.`, `Tell me what country you're from by saying: I'm from, and then the country you're from.`);
    //  } else {
    //    this.emit(':ask', `Please tell me your name by saying: My name is, and then your name.`, `Please tell me your name by saying: My name is, and then your name.`);
    //  }
  },

  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  }
});

module.exports = mainStateHandlers;
