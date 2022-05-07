const twilio = require('twilio')

exports.handler = async function (context, event, callback) {
  
  const { ACCOUNT_SID, API_KEY_SID, API_KEY_SECRET, TWILIO_CHAT_SERVICE_SID } = context

  const accessToken = new twilio.jwt.AccessToken(ACCOUNT_SID, API_KEY_SID, API_KEY_SECRET)
 
  accessToken.identity = event.username

  const chatGrant = new twilio.jwt.AccessToken.ChatGrant({
    serviceSid: TWILIO_CHAT_SERVICE_SID
  });

  const syncGrant = new twilio.jwt.AccessToken.SyncGrant({
    serviceSid: 'default'
  });
  accessToken.addGrant(chatGrant)
  // accessToken.addGrant(syncGrant)
  
  callback(null, {
    identity: accessToken.identity,
    token: accessToken.toJwt()
  })
}













// const Twilio = require('twilio');

// const AccessToken = Twilio.jwt.AccessToken;
// const ChatGrant = AccessToken.ChatGrant;
// const SyncGrant = AccessToken.SyncGrant;

// function tokenGenerator(identity = 0) {
//   token.identity = identity || 'Carl';

//   if (process.env.TWILIO_CHAT_SERVICE_SID) {
//     const chatGrant = new ChatGrant({
//       serviceSid: config.TWILIO_CHAT_SERVICE_SID
//     });
//     token.addGrant(chatGrant);
//   }

//   if (process.env.TWILIO_SYNC_SERVICE_SID) {
//     const syncGrant = new SyncGrant({
//       serviceSid: config.TWILIO_SYNC_SERVICE_SID || 'default'
//     });
//     token.addGrant(syncGrant);
//   }

//   // Serialize the token to a JWT string and include it in a JSON response
//   return {
//     identity: token.identity,
//     token: token.toJwt()
//   };
// }

// module.exports = tokenGenerator;