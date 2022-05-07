import {useState, useEffect} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import GNavbar from './GNavbar';
import {Button, Grid, TextField,CssBaseline, Link, Container } from '@mui/material';
import WaitingRoom from './WaitingRoom';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const themeDark = createTheme({
  palette: {
    background: {
      default: "#222222"
    },
    text: {
      primary: "#ffffff"
    }
  }
});

const NewRoom = () => {


  const { isAuthenticated, loginWithPopup } = useAuth0();
  const [createNewRoom, setCreateNewRoom] = useState(false)
  const [selectNew, setSelectNew] = useState(false);
  const [roomName, setRoomName] =useState(localStorage.getItem('room') || '')
  const [open, setOpen]  = useState(false);
  const [roomOwner, setRoomOwner] = useState(false);

  useEffect(() => {
    let local = localStorage.getItem('room');
    if( local &&  isAuthenticated ){
      setSelectNew(true)
      setCreateNewRoom(true)
    }
    
  },[ isAuthenticated ])
 
  const handleNewRoom = () => {
    const room = 'tt'
    setRoomName(room)
    setSelectNew(true)

      if(isAuthenticated){
        localStorage.setItem('room', room)
        setRoomOwner(true)
        setCreateNewRoom(true)
      }
      else{
        loginWithPopup();
       }
  }

  const joinRoom = (e) => {
    if (e.key === 'Enter') {
      setSelectNew(true)
      localStorage.setItem('room', roomName)
      isAuthenticated ? setCreateNewRoom(true) : loginWithPopup();
    }
  }
  function clickJoin(){
    setSelectNew(true)
    localStorage.setItem('room', roomName)
    isAuthenticated ? setCreateNewRoom(true) : loginWithPopup();
  }

  const createRandomRoom = () => {
    let data = Math.random().toString(36).replace(/[^a-z0-9]+/gi, 'g').substring(1, 10)     
    let tes = data.split('')
    tes.splice(3,0,'-')
    tes.splice(7,0,'-')
    return tes.join(''); 
   }

  return (
    <div>
      
      { !createNewRoom ? 
      <Container >
        <Container>
          <GNavbar />
        </Container>
        <Grid
        alignItems="center"
        justifyContent="center"
        style={{minHeight: '85vh'}}
        container columnSpacing={{ xs: 1, sm: 2, md: 12 }}>
          <Grid
          align="center"
          justify="center"
          item xs={12} sm={6}>
            <div>
              <h2>Videoconferencias premium. Ahora gratis para todos.</h2>
              <p>Rediseñamos Google Meet, nuestro servicio de reuniones de negocios seguras, de modo que sea gratuito y esté desponible para todos.</p>
            </div>
            <div xs={{flexDirection: 'column'}} style={{ display: 'flex',gap: "10px" }}>
              <Button  style={roomName.length !== 0 ? { minWidth: '160px'}: {minWidth: '160px',backgroundColor: 'green' }} onClick={roomName.length !== 0 ? clickJoin : handleNewRoom} variant='contained'> {roomName.length !== 0 ? "Unirse" : "Reunión nueva"}</Button>
              
              <TextField fullWidth onChange={(e) => setRoomName(e.target.value)} onKeyDown={joinRoom} label="Ingresa un código o un vínculo" id="fullWidth" />
            </div>
            <p><Link  href="">Más información</Link > sobre google meet</p>
          </Grid>
          <Grid 
          align="center"
          justify="center"
          item xs={12} sm={6}>
            <div>

              <img src="https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg" alt="" />
              <h5>Obtén un vínculo para compartir </h5>
              <p>Haz click en <strong>Reunión nueva</strong> para obtener un vínculo que puedas enviar a las personas con quienes quieras reunirte.</p>
            </div>
          </Grid>
        </Grid>
      </Container>
        :
        <ThemeProvider theme={themeDark}>
          <CssBaseline>
            <div>
              <WaitingRoom roomName={roomName} roomOwner={roomOwner}/>  
            </div>
          </CssBaseline>
        </ThemeProvider>
        
        }
    </div>
  );
};

export default NewRoom