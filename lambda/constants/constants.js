var constants = Object.freeze({

  // App-ID. : Set Your App ID
  appId : '',

  //  DynamoDB Table Name
  dynamoDBTableName : 'VoiceDeveloper',

  // Skill States
  states : {
    ONBOARDING : '',
    MAIN : '_MAIN',
  }

});

module.exports = constants;
