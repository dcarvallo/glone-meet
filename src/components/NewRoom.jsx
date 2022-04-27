import {useState, useEffect} from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import GNavbar from './GNavbar';
import {Button, Grid, TextField, Link } from '@mui/material';
import WaitingRoom from './WaitingRoom';
import ModalText from './ModalText';
const NewRoom = () => {

  const { isAuthenticated, loginWithPopup } = useAuth0();
  const [createNewRoom, setCreateNewRoom] = useState(false)
  const [isInWaitingRoom, setIsInWaitingRoom] = useState(false);
  const [open, setOpen]  = useState(false);

 
  const handleNewRoom = async () => {
    if(isAuthenticated) {
      setCreateNewRoom(true)
     } 
     else{
       loginWithPopup();
       
      }
  }

  useEffect(() => {
    console.log(isAuthenticated);
    console.log('test')
    isAuthenticated && setCreateNewRoom(true)
  },[isAuthenticated])

  const handleClose = () =>{
    setOpen(false)
  }

  return (
    <div>
      <GNavbar />
      <ModalText handleClose={handleClose} open={open}>
        <p>Please Login first </p>
      </ModalText>
      { !createNewRoom ? 
      <div >
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
            <div style={{ display: 'flex',gap: "10px" }}>
              <Button style={{ minWidth: '160px'}} onClick={handleNewRoom} variant='contained'>Reunión nueva</Button>
              
              <TextField fullWidth label="Ingresa un código o un vínculo" id="fullWidth" />
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
      </div>
        :
        <WaitingRoom />  
        }
    </div>
  );
};

export default NewRoom