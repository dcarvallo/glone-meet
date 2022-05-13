import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Card, CardMedia } from '@mui/material';
const ChangeViewModal = ({openModal, setOpenModal,changeView,gridView}) => {
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
          <Typography color="black"> Cambiar la modalidad de la vista </Typography>
      <div dense style={{width: '100%', display:'flex', gap: '20px'}}>
        {gridView.map(el => (
          <Card key={el.id} className={el.selected && 'viewSelection' } style={el.selected ? {border: '2px solid', borderColor: 'green', cursor: 'pointer', width: '600px'} : {cursor:'pointer', width: '600px'}}>
          
          <CardMedia
            component="img"
            width="100%"
            image={el.src}
            onClick={() => changeView(el.id)}
            />
          </Card>
        ))}
          
      </div>
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

export default ChangeViewModal