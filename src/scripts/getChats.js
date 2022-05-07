// import { getChatToken } from "../scripts/getTokens";
// const Chat = require("twilio-chat");

const getChats = async ({room,username}) => {
  
//     let token2 = ""
//     let chatMessages = []
//     try {
//       token2 = await getChatToken(user.name);
//       // setToken(token2)
//     } catch {
//       throw new Error("Error, please reload this page");
//     }

//     const client = await Chat.Client.create(token2);
     
//     client.on("tokenAboutToExpire", async () => {
//       const token = await getChatToken(user.name);
//       await client.updateToken(token);
//     });

//     client.on("tokenExpired", async () => {
//       const token = await getChatToken(user.name);
//       await client.updateToken(token);
//     });

//     client.on("channelJoined", async (channel) => {
//       const messages2 = await channel.getMessages();
//       // setChatMessages(messages2.items || [] );
//       chatMessages = [...messages2.items]
//       scrollToBottom();
//     });

//     try {
//       let channel2 = await client.getChannelByUniqueName(room);
//       await joinChannel(channel2);
//       setChannel(channel2)
//     } catch {
//       try {
//         let channel3 = await client.createChannel({
//           uniqueName: room,
//           friendlyName: room,
//         });
        
//         await joinChannel(channel3);
//         setChannel(channel3)
//       } catch {
//         throw new Error("unable to create channel, please reload this page");
//       }
//     }
//     return [chatMessages ,client]
}

export default getChats