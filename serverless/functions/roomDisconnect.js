const twilio = require('twilio')

exports.handler = async function (context, event, callback) {
  const { ACCOUNT_SID, API_KEY_SID, API_KEY_SECRET } = context

  const client = new twilio(API_KEY_SID, API_KEY_SECRET, {accountSid: ACCOUNT_SID});
  // console.log({event})
  try {
    
    let lista = await client.video.rooms(event.roomName)
                      .participants
                      .list({status: 'connected'})

    await test(lista, client,event );


  } catch (error) {
    console.log(error)
    const response = new twilio.Response();
    response.setBody({
      message: 'Unable to disconnect',
      error: error
    });
    return callback(null, response);
  }

  callback(null, {
    status: 'Room disconnected',
  })
}

async function test(lista,client,event){
   
  for(const participant of lista){

    console.log(participant.sid)
    await client.video.rooms(event.roomName)
    .participants(participant.sid)
    .update({status: 'disconnected'})
    .then(participant => {
      console.log(participant.status);
    });
  }

}