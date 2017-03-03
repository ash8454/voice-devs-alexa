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
    //Check for User Data in Session Attributes
    var userName = this.attributes['userName'];
    if (userName) {
      //Change State to MAIN
      this.handler.state = constants.states.MAIN;
      this.emitWithState('LaunchRequest');
      //Welcome User Back by Name
      //this.emit(':ask', `Welcome back ${userName}! You can ask me about the various alexa meetups aroudn the world or listen to the Alexa Dev Chat podcast.`, 'What would you like to do?');
    } else {
      // Get Access Token
      var accessToken = this.event.session.user.accessToken;

      //Account Linked
      if (accessToken) {
        //Get user details from meetup api
        meetupAPI.GetUserDetails(accessToken)
        .then((userDetails) => {
          //Return user details
          var name = userDetails.name;

          //Store Users Name in Session
          this.attributes['userName'] = name;

          //Change state to MAIN
          this.handler.state = constants.states.MAIN;
          
          //Welcome User for the First times
          this.emit(':ask', `Hi ${name} ! Welcome to Voice Devs! The skill that gives you all the information about the alexa developer
          community. You can ask me about the various alexa meetups around the world, or listen to the Alexa Dev Chat podcast.
          What would you like to do`, 'What would you like to do?');
        })
        .catch((error) => {
          //Return error
          console.log('MEETUP API ERROR: ', error);
          this.emit(':tell', 'Sorry, there was a problem accessing your meetup account details.');
        });

      }
      // Account not linked
      else {
        this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skill. I\'ve sent details to your account');
      }

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
    this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skill. I\'ve sent details to your account');
  },

  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  }


});

module.exports = onboardingStateHandlers;
