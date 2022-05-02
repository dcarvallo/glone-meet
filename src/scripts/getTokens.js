
export const getRoomToken = async ({username, roomName}) => {
  
  const response = await fetch('/get_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username, roomName})
  })

  const data = await response.json()
  return data.token

}


export const getChatToken = async (username) => {
  const response = await fetch('/get_token_chat?username='+username, {
  method: 'GET',
   headers: {
     'Content-Type': 'application/json'
   },
 });
 const data = await response.json();
 return data.token;
};

