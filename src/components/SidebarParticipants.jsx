import {useState} from 'react'
import {
  Backdrop,
  CircularProgress,
  Container,
  Grid,
  List,
  Box,
  Divider,
  Drawer,
  Typography,
  ListItem,
  IconButton,
  ThemeProvider,
  createTheme,
  TextField,
  Button
} from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PanToolIcon from '@mui/icons-material/PanTool';
import MicOffIcon from '@mui/icons-material/MicOff';

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

const SidebarParticipants = ({isOwner, openParticipants,setOpenParticipants,participants,removeParticipant,raiseHand,disableMics, micsOff}) => {

  const [searchText, setSearchText] = useState("")

  const toggleSlider = () => {
    setOpenParticipants(!openParticipants);
  };
  
  return (
    <>
      <ThemeProvider theme={themeLight}>
      <Box>
        <Drawer  open={openParticipants} anchor="right" onClose={ toggleSlider }>
          
            <Box style={{minWidth: '250px'}}>
            <Typography padding={2} align="center">
              Participants
            </Typography>
            <Divider />
            <Container maxWidth="xs">
              <Backdrop  style={{ zIndex: 999 }}>
                <CircularProgress style={{ color: "white" }} />
              </Backdrop>
              {/* <CssBaseline /> */}
              {isOwner && 
              JSON.parse(isOwner.localParticipant.identity).roomOwner && 
              <Button  variant='contained' style={{margin: '5px'}} dense onClick={disableMics}>Disable Mics</Button>}
              <TextField
                required
                style={styles.textField}
                placeholder="Search participant"
                variant="outlined"
                dense
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
              />
              <Grid maxWidth="xs"  direction="column" >
                <Grid item style={styles.gridItemChatList} >
                  <List dense={true}>
                    {participants.length > 0 ? 
                      participants.filter(participant => {
                        if (searchText === '') {
                          return participant;
                        } else if (participant.identity.toLowerCase().includes(searchText.toLowerCase())) {
                          return participant;
                        }
                      }).map(participant => {
                        let data = JSON.parse(participant.identity)
                        return <>
                        <ListItem secondaryAction={
                          JSON.parse(isOwner.localParticipant.identity).roomOwner && <IconButton onClick={() => removeParticipant(participant)} edge="end" aria-label="delete">
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        }>
                          <Box style={styles.data}>

                            {raiseHand.length > 0 && raiseHand.includes(participant.sid) && <IconButton style={{backgroundColor: 'black', color: 'yellow'}} ><PanToolIcon /> </IconButton> }
                            {micsOff.length > 0 && micsOff.includes(participant.sid) && <IconButton style={{color: 'red'}} ><MicOffIcon /> </IconButton> }
                            <Typography>{data.name}</Typography> 
                          </Box>
                        </ListItem>
                        <Divider />
                        </>
                      })
                      : <Typography align="center" variant="caption"> 0 participants</Typography>
                    }
                  </List>
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
  textField: { width: "100%", color: "black"},
  gridItemChatList: { overflow: "auto", height: "82vh" },
  data: {display: 'flex', alignItems: 'center', justifyContent: 'start'},
};

export default SidebarParticipants;