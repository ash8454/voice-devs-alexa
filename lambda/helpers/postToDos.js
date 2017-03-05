var request = require('request-promise');

module.exports = {
  PostToDoTaskDetails: () => {
    return new Promise((resolve, reject) => {

      // Call Meetup api
      var myJSONObject = { 	"text": `Complete HOA Form`	}
      request({
        url: "https://shrouded-citadel-68964.herokuapp.com/todos",
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OGEwY2E5MDgxNjFiMDAwMTFiNDJmZjAiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNDg2OTMyNjI0fQ.EvyiEMWaj7YWp2wobeqoCHl9o9Q62zXpdsnhsuw2urk'
        },
        body: myJSONObject

      })
      .then((response) => {
        //Return user details
        resolve(JSON.parse(response));
      })
      .catch((error) => {
        //Return error
        reject("Landlord API Error", error);
      });
    });
  }

};
