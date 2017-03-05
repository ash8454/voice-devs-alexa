var Alexa = require('alexa-sdk');

//constants
var constants = require('../constants/constants');

//Data
var alexaMeetups = require('../data/alexaMeetups');

//helpers
var convertArrayToReadableString = require('../helpers/convertArrayToReadableString');
var landlordAPI = require('../helpers/landlordAPI');

//Onboarding handlers
var mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {
  'LaunchRequest': function () {
    this.emit(':ask', `Hello, You can ask me about the landlords information!`, 'What would you like to do?');
    //Check for User Data in Session Attributes
    // var userName = this.attributes['userName'];
    // if (userName) {
    //   //Welcome User Back by Name
    //   this.emit(':ask', `Welcome back ${userName}! You can ask me about the landlords information!`, 'What would you like to do?');
    // } else {
    //   this.handler.state = constants.state.ONBOARDING;
    //   this.emitWithState('NewSession');
    //   // this.emit(':ask', `Welcome to Voice Devs, The skill that gives you information about the alexa developer community.
    //   // You can ask me about the various alexa meetups around the world, or listen to the Alexa Dev Chat podcast.
    //   // But first I\'d like to get to know you better.
    //   // Tell me your name by saying: My name is, and then your name.`, 'Tell me your name by saying: My name is, and then your name.');
    // }
  },

  'AlexaLandlordCheck': function () {
    landlordAPI.GetLandLordDetails()
    .then((landlordDetails) => {

      //Get landlord information
      var firstName = landlordDetails.firstName;
      var lastName = landlordDetails.lastName;
      var apartments = landlordDetails.apartments.length;

      this.emit(':ask', `Landlord name is ${firstName} ${lastName}. He currently has ${apartments} available for rent`, 'Do you want to rent it out?');
    })
    .catch((error) => {
         //Return error
         console.log('MEETUP API ERROR: ', error);
         this.emit(':tell', 'Sorry, there was a problem accessing your meetup account details.');
    });
  }

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

    this.emit(':ask', `You can ask me about the landlord information.`, 'What would you like to do?');
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
