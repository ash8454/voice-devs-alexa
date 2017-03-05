var Alexa = require('alexa-sdk');

//constants
var constants = require('../constants/constants');

//Data
//var alexaMeetups = require('../data/alexaMeetups');

// helpers
var meetupAPI = require('../helpers/meetupAPI');

//Onboarding handlers
var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {
  'NewSession': function () {
    this.emit(':ask', `Welcome to Landlord Portal! The skill that gives you all the information about the
    landlord in your community. You can ask me about the various landlords around your community,
    But first, I\'d like to get to know you better. Tell me your name by saying: My name is, and then your name.`,
    `Tell me your name by saying: My name is, and then your name.`);
  },
  //
  // 'NewSession': function () {
  //    // Check for User Data in Session Attributes
  //    var userName = this.attributes['userName'];
  //    if (userName) {
  //      // Change State to Onboarding:
  //      this.handler.state = constants.states.MAIN;
  //      this.emitWithState('LaunchRequest');
  //    } else {
  //      // Welcome User for the First Time
  //      this.emit(':ask', `Welcome to Landlord Portal! The skill that gives you all the information about the
  //      landlord in your community. You can ask me about the various landlords around your community,
  //      But first, I\'d like to get to know you better. Tell me your name by saying: My name is, and then your name.`,
  //      `Tell me your name by saying: My name is, and then your name.`);
  //    }
  //  },

  // 'NameCapture': function () {
  //   // Get Slot Values
  //   var USFirstNameSlot = this.event.request.intent.slots.USFirstName.value;
  //   var UKFirstNameSlot = this.event.request.intent.slots.UKFirstName.value;
  //
  //   // Get Name
  //   var name;
  //   if (USFirstNameSlot) {
  //     name = USFirstNameSlot;
  //   } else if (UKFirstNameSlot) {
  //     name = UKFirstNameSlot;
  //   }
  //
  //   // Save Name in Session Attributes and Ask for Country
  //   if (name) {
  //     this.attributes['userName'] = name;
  //     this.emit(':ask', `Ok ${name}! Tell me what information do you want to know about landlord!`, `Tell me what information do you want to know about landlord portal.`);
  //   } else {
  //     this.emit(':ask', `Sorry, I didn\'t recognise that name!`, `'Tell me your name by saying: My name is, and then your name.'`);
  //   }
  // },

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
    this.emit(':ask', 'Please tell me what information do you want to know about landlord portal');
  },

  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  }


});

module.exports = onboardingStateHandlers;
