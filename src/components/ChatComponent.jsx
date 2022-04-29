import {useState, useEffect, useRef} from "react";
import {
  AppBar,
  Backdrop,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  List,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import ChatItem from "./ChatItem";
import { useAuth0 } from '@auth0/auth0-react';
const Chat = require("twilio-chat");
// import {Chat} from "twilio-chat";

const ChatComponent = ({room}) => {

  const {user} = useAuth0();

  const [text, setText] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [channel, setChannel] = useState(null);
  const [token, setToken] = useState("")

  const scrollDiv = useRef(null)


   useEffect( async () => {
     await llamada()
   },[]) 

   const getToken = async () => {
     const response = await fetch('/get_token_chat?username='+user.name, {
    //  const response = await fetch('/get_token_chat?username=room2', {
     method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify('user.email')
    });
    const data = await response.json();
    setToken(data.token)
    return data.token;

  };

   const llamada = async () => {
    // setLoading(true);
    let token2 = ""
    try {
      token2 = await getToken();
      // setToken(token2)
    } catch {
      throw new Error("Error, please reload this page");
    }

    const client = await Chat.Client.create(token2);
     
    client.on("tokenAboutToExpire", async () => {
      const token = await getToken();
      await client.updateToken(token);
    });

    client.on("tokenExpired", async () => {
      const token = await getToken();
      await client.updateToken(token);
    });

    client.on("channelJoined", async (channel) => {
      const messages2 = await channel.getMessages();
      setChatMessages(messages2.items || [] );
      scrollToBottom();
    });

      
      
    try {
      let channel2 = await client.getChannelByUniqueName(room);
      await joinChannel(channel2);
      setChannel(channel2)
      console.log('recupera bien')
      // setLoading(false)
    } catch {
      try {
        let channel3 = await client.createChannel({
          uniqueName: room,
          friendlyName: room,
        });
        
        await joinChannel(channel3);
        setChannel(channel3)
        // setLoading(false)
      } catch {
        throw new Error("unable to create channel, please reload this page");
      }
    }
   }

  const joinChannel = async (channel2) => {
    if (channel2.channelState.status !== "joined") {
      await channel2.join();
    }
    channel2.on("messageAdded", handleMessageAdded);

  };

  const handleMessageAdded =  (message) => {
    setChatMessages(messages =>[...messages, message])
    
    scrollToBottom();
  };

  const scrollToBottom = () => {
    const scrollHeight = scrollDiv.current.scrollHeight;
    const height = scrollDiv.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  const sendMessage = async () => {
    if (text && String(text).trim()) {
      channel && channel.sendMessage(text);
    //   const data = await channel.getMessages()
    // setChatMessages(data.items)
      setText('')
    }
  };

    return (
      <Container component="main" maxWidth="md">
        <Backdrop open={loading} style={{ zIndex: 999 }}>
          <CircularProgress style={{ color: "white" }} />
        </Backdrop>
        <CssBaseline />
        <Grid container direction="column" >
          <Grid item style={styles.gridItemChatList} ref={scrollDiv}>
            <List dense={true}>
              {chatMessages.length > 0 &&
                chatMessages.map(message => (
                  <ChatItem
                    key={message.index}
                    message={message}
                    email={user.email}
                  />
                  // <>
                  // <p>{message.author}</p>
                  // <p>{message.body}</p>
                  // </>
                ))}
            </List>
          </Grid>
          <Grid item >
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item >
                <TextField
                  required
                  style={styles.textField}
                  placeholder="Enter message"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={text}
                  disabled={!channel}
                  onChange={(event) =>
                   setText(event.target.value)
                  }
                />
              </Grid>
              <Grid item>
                <IconButton
                  // style={styles.sendButton}
                  onClick={sendMessage}
                  disabled={!channel || !text}
                >
                  <Send style={styles.sendIcon} />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
}

const styles = {
  textField: { width: "100%", borderWidth: 0, borderColor: "transparent" },
  textFieldContainer: { flex: 1, marginRight: 12 },
  gridItem: { paddingTop: 12, paddingBottom: 12 },
  gridItemChatList: { overflow: "auto", height: "70vh" },
  gridItemMessage: { marginTop: 12, marginBottom: 12 },
  sendButton: { backgroundColor: "#3f51b5" },
  sendIcon: { color: "white" },
  mainGrid: { paddingTop: 100, borderWidth: 1 },
};

export default ChatComponent;