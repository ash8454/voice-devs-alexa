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
  }

};
