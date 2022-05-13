import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';


const DisconnectModal = ({openModal, setOpenModal, disconnectAll, disconnect}) => {
  return (

    <Modal
      aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
    >
      <Fade in={openModal}>
          <Box sx={style}>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <Typography color="black"> You want to end the meeting? </Typography>
              <Box dense style={{display:'flex', gap: '5px'}}>
                <Button size="small" onClick={disconnect}>Leave the room</Button>
                <Button size="small" color="secondary" onClick={disconnectAll}>Finish for everyone</Button>
              </Box>
            </Typography>
          </Box>
        </Fade>
    </Modal>

  )
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export default DisconnectModal