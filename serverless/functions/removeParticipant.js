const twilio = require('twilio')

exports.handler = async function (context, event, callback) {
  const { ACCOUNT_SID, API_KEY_SID, API_KEY_SECRET } = context

  const client = new twilio(API_KEY_SID, API_KEY_SECRET, {accountSid: ACCOUNT_SID});
  
  try {
     await client.video.rooms(event.roomName).participants(event.participantSid).update({status: 'disconnected'})
  } catch (error) {
    console.log(error)
    const response = new twilio.Response();
    // response.setStatusCode(401);
    response.setBody({
      message: 'Unable to remove participant',
      error: error
    });
    return callback(null, response);
  }

  callback(null, {
    status: 'Participant disconnected',
  })
}