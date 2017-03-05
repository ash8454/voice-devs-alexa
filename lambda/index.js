var Alexa = require('alexa-sdk');

// Data
var alexaMeetups = require('./data/alexaMeetups');

// Helpers
var convertArrayToReadableString = require('./helpers/convertArrayToReadableString');
var stocksAPI = require('./helpers/stocksAPI');
var landlordAPI = require('./helpers/landlordAPI');
var postToDoTaskAPI = require('./helpers/postToDos');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  'NewSession': function () {
    this.emit(':ask', `Welcome to Landlord Portal! The skill that gives you all the information about the landlord portal community.
    You can ask me about the various landlords around the community. But first,
    I\'d like to get to know you better. Tell me your name by saying: My name is, and then your name.', 'Tell me your name by saying: My name is, and then your name.`);
  },

  'LaunchRequest': function () {
    this.emit(':ask', 'Welcome to Landlord Portal! The skill that gives you all the information about the landlord portal community. You can ask me about the various landlords around the community.  What would you like to do?');
  },

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
  //     this.emit(':ask', `Ok ${name}! Tell me what country you're from by saying: I'm from, and then the country you're from.`, `Tell me what country you're from by saying: I'm from, and then the country you're from.`);
  //   } else {
  //     this.emit(':ask', `Sorry, I didn\'t recognise that name!`, `'Tell me your name by saying: My name is, and then your name.'`);
  //   }
  // },


  'AlexaStocksCheck': function () {
    stocksAPI.GetStockDetails()
    .then((stocksDetails) => {
      //this.emit(':ask', `Thank you for connecting.`);
      //Get stocks information

      var tickerName = stocksDetails.dataset.name;
      var tickerSymbol = stocksDetails.dataset.dataset_code;
      var tickerDescription = stocksDetails.dataset.description;
      // var firstName = landlordDetails.firstName;
      // var lastName = landlordDetails.lastName;
      // var apartments = landlordDetails.apartments.length;
      //
      this.emit(':ask', `Ticker Name is ${tickerName}. Ticker Symbol is ${tickerSymbol}. ${tickerDescription}`, 'Do you need help?');
    })
    .catch((error) => {
      //Return error
      console.log('STOCKS API ERROR: ', error);
      this.emit(':tell', 'Sorry, there was a problem accessing your stocks details.');
    });
  },

  'AlexaLandlordCheck': function () {
    landlordAPI.GetLandlordDetails()
    .then((landlordDetails) => {
      //this.emit(':ask', `Thank you for connecting.`);
      //Get stocks information

      // var tickerName = stocksDetails.dataset.name;
      // var tickerSymbol = stocksDetails.dataset.dataset_code;
      // var tickerDescription = stocksDetails.dataset.description;
      // var firstName = landlordDetails.firstName;
      // var lastName = landlordDetails.lastName;
      // var apartments = landlordDetails.apartments.length;

      var todoTask = landlordDetails.todo.text;
      this.emit(':ask', `To do task is ${todoTask}`, 'Do you need help?');
    })
    .catch((error) => {
      //Return error
      console.log('LANDLORD API ERROR: ', error);
      this.emit(':tell', 'Sorry, there was a problem accessing your landlord details.');
    });
  },


  'AlexaPostToDoTaskCheck': function () {
    postToDoTaskAPI.PostToDoTaskDetails()
    .then((toDoTaskDetails) => {
      //this.emit(':ask', `Thank you for connecting.`);
      //Get stocks information

      // var tickerName = stocksDetails.dataset.name;
      // var tickerSymbol = stocksDetails.dataset.dataset_code;
      // var tickerDescription = stocksDetails.dataset.description;
      // var firstName = landlordDetails.firstName;
      // var lastName = landlordDetails.lastName;
      // var apartments = landlordDetails.apartments.length;

      var todoTask = toDoTaskDetails.todo.text;
      this.emit(':ask', `To do task is ${todoTask}`, 'Do you need help?');
    })
    .catch((error) => {
      //Return error
      console.log('TODO TASKS API ERROR: ', error);
      this.emit(':tell', 'Sorry, there was a problem accessing your landlord details.');
    });
  },

  // 'AlexaLandlordCheck': function () {
  //   meetupAPI.GetUserDetails(accessToken)
  //     .then((userDetails) => {
  //       //Return user details
  //       var name = userDetails.name;
  //
  //       //Store Users Name in Session
  //       this.attributes['userName'] = name;
  //
  //       //Change state to MAIN
  //       this.handler.state = constants.states.MAIN;
  //
  //       //Welcome User for the First times
  //       this.emit(':ask', `Hi ${name} ! Welcome to Voice Devs! The skill that gives you all the information about the alexa developer
  //       community. You can ask me about the various alexa meetups around the world, or listen to the Alexa Dev Chat podcast.
  //       What would you like to do`, 'What would you like to do?');
  //     })
  //   .catch((error) => {
  //     //Return error
  //     console.log('MEETUP API ERROR: ', error);
  //     this.emit(':tell', 'Sorry, there was a problem accessing your meetup account details.');
  //   });
  // }




};
