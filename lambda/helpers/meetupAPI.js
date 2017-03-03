var request = require('request-promise');

module.exports = {
  GetUserDetails: (accessToken) => {
    return new Promise((resolve, reject) => {

      // Call Meetup api
      request({
        url: "https://api.meetup.com/2/member/self/?access_token="+accessToken,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        //Return user details
        resolve(JSON.parse(response));
      })
      .catch((error) => {
        //Return error
        reject("Meetup API Error", error);
      });
    });
  },

  GetMeetupGroupDetails: (accessToken, meetupURL) => {
    return new Promise((resolve, reject) => {
      //Call Meetup api
      request({
        url: "https://api.meetup.com/"+meetupURL,
        qs: {
          access_token: accessToken,
          fields: 'next_event,last_event, plain_text_description'
        },
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-meta-photo-host': 'secure'
        }
      })
      .then((response) => {
        //Return user details
        resolve(JSON.parse(response));
      })
      .catch((error) => {
        //Return error
        reject("Meetup API Error", error);
      });
    });
  }

};
