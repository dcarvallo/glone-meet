import {useState, useEffect, useRef} from "react";
import {
  Backdrop,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  List,
  TextField,
  Box,
  Divider,
  Drawer,
  Typography
} from "@mui/material";
import { Send } from "@mui/icons-material";
import ChatItem from "./ChatItem";
import { useAuth0 } from '@auth0/auth0-react';
import { getChatToken } from "../scripts/getTokens";
import { createTheme, ThemeProvider } from '@mui/material/styles';
const Chat = require("twilio-chat");

const themeLight = createTheme({
  palette: {
    background: {
      // default: "#222222"
    },
    text: {
      primary: "#000"
    }
  }
});
const SideBar = ({open,setOpen,room, setShowBadge}) => {
  const {user} = useAuth0();

  const [text, setText] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [channel, setChannel] = useState(null);

  const scrollDiv = useRef(null)


  useEffect( async () => {
    await llamada()
  },[]);

  const llamada = async () => {
   let token2 = ""
   try {
     token2 = await getChatToken(user.name);
   } catch {
     throw new Error("Error, please reload this page");
   }

   const client = await Chat.Client.create(token2);

   console.log({client})
    
   client.on("tokenAboutToExpire", async () => {
     const token = await getChatToken(user.name);
     await client.updateToken(token);
   });

   client.on("tokenExpired", async () => {
     const token = await getChatToken(user.name);
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
   } catch {
     try {
       let channel3 = await client.createChannel({
         uniqueName: room,
         friendlyName: room,
       });
       
       await joinChannel(channel3);
       setChannel(channel3)
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
   console.log('nuevo mensaje de chat')
   
   setShowBadge(false)
   scrollToBottom();
 };

 const scrollToBottom = () => {
   if(open){

     const scrollHeight = scrollDiv.current.scrollHeight;
     const height = scrollDiv.current.clientHeight;
     const maxScrollTop = scrollHeight - height;
     scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
 };

 const sendMessage = async () => {
   if (text && String(text).trim()) {
     channel && channel.sendMessage(text);
     setText('')
   }
 };

  const toggleSlider = () => {
    setOpen(!open);
  };


  return (
    <>
      <ThemeProvider theme={themeLight}>
      <Box>
        <Drawer open={open} anchor="right" onClose={toggleSlider}>
          
            <Box>
            <Typography>
              Chat
            </Typography>
            <Divider />
            <Container  maxWidth="xs">
              <Backdrop open={loading} style={{ zIndex: 999 }}>
                <CircularProgress style={{ color: "white" }} />
              </Backdrop>
              {/* <CssBaseline /> */}
              <Grid maxWidth="xs" direction="column" >
                <Grid item style={styles.gridItemChatList} ref={scrollDiv}>
                  <List dense={true}>
                    {chatMessages.length > 0 &&
                      chatMessages.map(message => (
                        <ChatItem
                          key={message.index}
                          message={message}
                          email={user.email}
                        />
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
                        <Send />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Drawer>
      </Box>
      </ThemeProvider>
    </>
  );
}

const styles = {
  // textField: { width: "100%", borderWidth: 0, borderColor: "transparent" },
  textField: { width: "100%", color: "black"},
  textFieldContainer: { flex: 1, marginRight: 5 },
  gridItem: { paddingTop: 12, paddingBottom: 12, maxWidth: '100%' },
  gridItemChatList: { overflow: "auto", height: "82vh" },
  gridItemMessage: { marginTop: 12, marginBottom: 12 },
  // sendButton: { backgroundColor: "#3f51b5" },
  // sendIcon: { color: "white" },
  mainGrid: { paddingTop: 100, borderWidth: 1 },
};

export default SideBar;