var request = require('request-promise');

module.exports = {
  GetStockDetails: () => {
    return new Promise((resolve, reject) => {

      // Call Meetup api
      request({
        url: "https://www.quandl.com/api/v3/datasets/WIKI/FB.json?api_key=4t1ZqF3uw5s39ivtEt_F",
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
        reject("Stocks API Error", error);
      });
    });
  }

};
